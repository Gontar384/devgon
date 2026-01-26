import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtPayload, RequestWithUser } from './auth.types';
import { AUTH_POLICY } from './auth.policy';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = this.getRequest(context);
    const token = req.cookies[AUTH_POLICY.cookies.access.name] as string;

    if (!token) throw new UnauthorizedException();

    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify<JwtPayload>(token, {
        secret: process.env.JWT_SECRET_KEY,
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired JWT token');
    }

    req.user = payload;
    return true;
  }

  private getRequest(context: ExecutionContext): RequestWithUser {
    const httpReq = context.switchToHttp().getRequest<RequestWithUser>();
    if (httpReq) return httpReq;

    const gqlCtx = GqlExecutionContext.create(context);
    return gqlCtx.getContext<{ req: RequestWithUser }>().req;
  }
}
