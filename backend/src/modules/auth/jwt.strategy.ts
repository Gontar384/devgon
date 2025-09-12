import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './auth.types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    const secret = process.env.JWT_SECRET_KEY;

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: { cookies?: Record<string, string> } | undefined) =>
          req?.cookies?.['auth_token'] ?? null,
      ]),
      ignoreExpiration: false,
      secretOrKey: secret!,
    });
  }

  validate(payload: JwtPayload): JwtPayload {
    if (!payload) {
      throw new UnauthorizedException('Invalid JWT payload');
    }
    return payload;
  }
}
