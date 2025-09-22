import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtPayload, RequestWithUser } from './auth.types';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = this.getRequest(context);

    const token = req.cookies?.['auth_token'];
    if (!token) throw new UnauthorizedException('No JWT token found');

    try {
      req.user = this.jwtService.verify<JwtPayload>(token, {
        secret: process.env.JWT_SECRET_KEY,
      });
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired JWT token');
    }
  }

  private getRequest(context: ExecutionContext): RequestWithUser {
    const httpReq = context.switchToHttp().getRequest<RequestWithUser>();
    if (httpReq) return httpReq;

    const gqlCtx = GqlExecutionContext.create(context);
    return gqlCtx.getContext<{ req: RequestWithUser }>().req;
  }
}
