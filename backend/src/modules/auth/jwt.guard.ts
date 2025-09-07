import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RequestWithUser, JwtPayload } from './auth.types';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<RequestWithUser>();
    const token =
      typeof req.cookies?.['auth_token'] === 'string'
        ? req.cookies['auth_token']
        : undefined;

    if (!token) throw new UnauthorizedException('No token found');

    try {
      req.user = this.jwtService.verify<JwtPayload>(token, {
        secret: process.env.JWT_SECRET_KEY,
      });
      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
