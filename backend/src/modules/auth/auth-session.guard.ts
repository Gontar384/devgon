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

@Injectable()
export class AuthSessionGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = this.getRequest(context);
    if (req.method === 'OPTIONS') {
      return true;
    }

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

  private tryVerifyAccess(token: string): JwtPayload | null {
    try {
      return this.jwtService.verify<JwtPayload>(token, {
        secret: process.env.JWT_SECRET_KEY,
      });
    } catch {
      return null;
    }
  }

  private getRequest(context: ExecutionContext): RequestWithUser {
    if (context.getType<string>() === 'graphql') {
      return GqlExecutionContext.create(context).getContext<{
        req: RequestWithUser;
      }>().req;
    }

    return context.switchToHttp().getRequest<RequestWithUser>();
  }

  private getResponse(context: ExecutionContext): Response {
    if (context.getType<string>() === 'graphql') {
      return GqlExecutionContext.create(context).getContext<{ res: Response }>()
        .res;
    }

    return context.switchToHttp().getResponse<Response>();
  }
}
