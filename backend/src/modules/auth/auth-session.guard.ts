import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AUTH_POLICY } from './auth.policy';
import { JwtPayload, RequestWithUser } from './auth.types';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Response } from 'express';

/**
 * Guard that authenticates requests via HttpOnly cookies.
 * Works for both REST and GraphQL contexts (extracts req/res accordingly).
 *
 * On each request:
 * 1. Tries to verify the access token — attaches payload to req.user if valid.
 * 2. If access token is missing or expired, attempts silent refresh using
 *    the refresh token. This transparently rotates both tokens.
 * 3. If both fail, clears cookies and throws UnauthorizedException.
 */
@Injectable()
export class AuthSessionGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = this.getRequest(context);

    const res = this.getResponse(context);

    const accessToken = req.cookies?.[
      AUTH_POLICY.cookies.access.name
    ] as string;
    const refreshToken = req.cookies?.[
      AUTH_POLICY.cookies.refresh.name
    ] as string;

    if (accessToken) {
      const payload = this.tryVerifyAccess(accessToken);
      if (payload) {
        req.user = payload;
        return true;
      }
    }

    if (!refreshToken) {
      await this.authService.logout(undefined, res);
      throw new UnauthorizedException();
    }

    try {
      req.user = await this.authService.refreshAccessToken(
        refreshToken,
        res,
        req,
      );
      return true;
    } catch {
      await this.authService.logout(refreshToken, res);
      throw new UnauthorizedException();
    }
  }

  /**
   * Verifies a JWT access token without throwing.
   * Returns the payload on success, or `null` if invalid/expired.
   */
  private tryVerifyAccess(token: string): JwtPayload | null {
    try {
      return this.jwtService.verify<JwtPayload>(token, {
        secret: process.env.JWT_SECRET_KEY,
      });
    } catch {
      return null;
    }
  }

  /** Extracts the Express request from REST or GraphQL execution context. */
  private getRequest(context: ExecutionContext): RequestWithUser {
    if (context.getType<string>() === 'graphql') {
      return GqlExecutionContext.create(context).getContext<{
        req: RequestWithUser;
      }>().req;
    }

    return context.switchToHttp().getRequest<RequestWithUser>();
  }

  /** Extracts the Express response from REST or GraphQL execution context. */
  private getResponse(context: ExecutionContext): Response {
    if (context.getType<string>() === 'graphql') {
      return GqlExecutionContext.create(context).getContext<{ res: Response }>()
        .res;
    }

    return context.switchToHttp().getResponse<Response>();
  }
}
