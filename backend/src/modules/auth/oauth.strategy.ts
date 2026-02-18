import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from './auth.service';
import { GoogleProfile } from './auth.types';

/**
 * Passport strategy for Google OAuth 2.0.
 * On successful authentication, delegates to AuthService.validateOAuthLogin
 * and passes the resulting JWT payload to the request pipeline via `done`.
 */
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: `${process.env.BACKEND_URL}/api/auth/oauth/callback`,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: GoogleProfile,
    done: VerifyCallback,
  ) {
    try {
      const jwtPayload = await this.authService.validateOAuthLogin(profile);
      done(null, jwtPayload);
    } catch (err) {
      done(err, false);
    }
  }
}
