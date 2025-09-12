import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../user/user.repository';
import { User } from '../user/user.entity';
import { GoogleProfile, JwtPayload, UserRole } from './auth.types';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userRepo: UserRepository,
  ) {}

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
    }

    return {
      userId: user.id,
      email: user.email,
      role: user.role,
    };
  }

  setJwtCookie(jwtPayload: JwtPayload, res: Response) {
    const token = this.jwtService.sign(jwtPayload);
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  logout(res: Response) {
    res.cookie('auth_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    });
  }

  refreshJwtCookie(
    user: JwtPayload & { exp?: number; iat?: number },
    res: Response,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { exp, iat, ...payload } = user;
    const token = this.jwtService.sign(payload, { expiresIn: '7d' });

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }
}
