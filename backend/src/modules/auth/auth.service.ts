import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../user/user.repository';
import { User } from '../user/user.entity';
import { GoogleProfile, JwtPayload, UserRole } from './auth.types';
import { Response, Request } from 'express';
import { randomBytes } from 'crypto';
import { RefreshTokenRepository } from './refresh-token.repository';
import { AUTH_POLICY } from './auth.policy';
import { clearAuthCookie, setAuthCookie } from './auth.cookies';

/**
 * Core authentication service handling OAuth login, session management,
 * and token rotation.
 *
 * Auth flow:
 * 1. User authenticates via Google OAuth → `validateOAuthLogin` creates
 *    or retrieves the user record and returns a JWT payload.
 * 2. `setAuthCookies` issues a short-lived access token (JWT) and a
 *    long-lived refresh token (opaque, stored in DB). Enforces a per-user
 *    device limit by evicting oldest tokens when the cap is reached.
 * 3. `refreshAccessToken` implements token rotation — the old refresh token
 *    is atomically deleted and replaced with a new one on each use.
 * 4. `getCurrentUser` is used by the /me endpoint: tries access token first,
 *    silently falls back to refresh, returns a guest object on failure.
 */
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private jwtService: JwtService,
    private userRepo: UserRepository,
    private refreshTokenRepo: RefreshTokenRepository,
  ) {}

  /**
   * Validates a Google OAuth profile and returns a JWT payload.
   * Creates a new user record on first login.
   *
   * @throws UnauthorizedException if the profile contains no valid email
   */
  async validateOAuthLogin(profile: GoogleProfile): Promise<JwtPayload> {
    if (
      !profile ||
      !profile.emails ||
      profile.emails.length === 0 ||
      !profile.emails[0].value
    ) {
      throw new UnauthorizedException('Invalid OAuth profile');
    }

    const email = profile.emails[0].value;
    let user: User | null = await this.userRepo.findByEmail(email);

    if (!user) {
      const username = email.split('@')[0];
      user = await this.userRepo.create({
        email,
        username,
        role: UserRole.USER,
      });
      this.logger.log(`New user created: ${email}`);
    }

    return {
      userId: user.id,
      email: user.email,
      role: user.role,
    };
  }

  /**
   * Issues access and refresh tokens and sets them as HttpOnly cookies.
   * Enforces the per-user device limit (`AUTH_POLICY.devices.maxPerUser`)
   * by removing the oldest refresh tokens before creating a new one.
   */
  async setAuthCookies(
    jwtPayload: JwtPayload,
    res: Response,
    req?: Request,
  ): Promise<void> {
    const refreshToken = this.generateSecureToken();
    const expiresAt = new Date(Date.now() + AUTH_POLICY.tokens.refresh.ttlMs);

    const userAgent = req?.headers['user-agent'];
    const ipAddress = this.getClientIp(req);

    await this.refreshTokenRepo.enforceMaxTokensPerUser(
      jwtPayload.userId,
      AUTH_POLICY.devices.maxPerUser,
    );

    await this.refreshTokenRepo.create({
      userId: jwtPayload.userId,
      token: refreshToken,
      expiresAt,
      userAgent,
      ipAddress,
    });

    const accessToken = this.jwtService.sign(jwtPayload, {
      expiresIn: AUTH_POLICY.tokens.access.jwtExpiry,
    });

    this.logger.log(`Auth cookies set for user: ${jwtPayload.email}`);

    setAuthCookie(res, 'access', accessToken);
    setAuthCookie(res, 'refresh', refreshToken);
  }

  /**
   * Rotates the refresh token and reissues the access token.
   * The old refresh token is deleted atomically before the new one is created,
   * preventing replay attacks. Expiry is checked after deletion.
   *
   * @throws UnauthorizedException if the token is invalid, expired, or the user no longer exists
   */
  async refreshAccessToken(
    oldRefreshToken: string,
    res: Response,
    req?: Request,
  ): Promise<JwtPayload> {
    const consumed =
      await this.refreshTokenRepo.deleteByTokenReturning(oldRefreshToken);

    if (!consumed) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (consumed.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token expired');
    }

    const user = await this.userRepo.findById(consumed.userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const newRefreshToken = this.generateSecureToken();
    const newExpiresAt = new Date(
      Date.now() + AUTH_POLICY.tokens.refresh.ttlMs,
    );

    await this.refreshTokenRepo.create({
      userId: user.id,
      token: newRefreshToken,
      expiresAt: newExpiresAt,
      userAgent: req?.headers['user-agent'],
      ipAddress: this.getClientIp(req),
    });

    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: AUTH_POLICY.tokens.access.jwtExpiry,
    });

    setAuthCookie(res, 'access', accessToken);
    setAuthCookie(res, 'refresh', newRefreshToken);

    return payload;
  }

  /**
   * Resolves the current user from cookies without throwing.
   * Tries access token first; on failure silently attempts a refresh.
   * Returns a guest object `{ userId: '', role: 'guest' }` if both fail.
   */
  async getCurrentUser(req: Request, res: Response) {
    const accessToken = req?.cookies?.[
      AUTH_POLICY.cookies.access.name
    ] as string;
    const refreshToken = req?.cookies?.[
      AUTH_POLICY.cookies.refresh.name
    ] as string;

    if (!accessToken && !refreshToken) {
      return { userId: '', email: '', role: 'guest' };
    }

    if (accessToken) {
      try {
        const payload = this.jwtService.verify<JwtPayload>(accessToken, {
          secret: process.env.JWT_SECRET_KEY,
        });
        return {
          userId: payload.userId,
          email: payload.email,
          role: payload.role,
        };
      } catch {
        /* empty */
      }
    }

    if (refreshToken) {
      try {
        const payload = await this.refreshAccessToken(refreshToken, res, req);
        return {
          userId: payload.userId,
          email: payload.email,
          role: payload.role,
        };
      } catch {
        /* empty */
      }
    }

    return { userId: '', email: '', role: 'guest' };
  }

  /**
   * Deletes the refresh token from the database and clears both auth cookies.
   * Safe to call with `undefined` (e.g. when no refresh token is present).
   */
  async logout(refreshToken: string | undefined, res: Response): Promise<void> {
    if (refreshToken) {
      await this.refreshTokenRepo.deleteByToken(refreshToken);
      this.logger.log('User logged out');
    }

    this.logger.log(`Session cleared`);
    clearAuthCookie(res, 'access');
    clearAuthCookie(res, 'refresh');
  }

  /** Generates a cryptographically secure 128-character hex token. */
  private generateSecureToken(): string {
    return randomBytes(64).toString('hex');
  }

  /**
   * Extracts the real client IP, accounting for reverse proxies.
   * Checks x-forwarded-for, x-real-ip, then falls back to socket address.
   */
  private getClientIp(req?: Request): string | undefined {
    if (!req) return undefined;

    return (
      (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
      (req.headers['x-real-ip'] as string) ||
      req.ip ||
      req.socket.remoteAddress
    );
  }
}
