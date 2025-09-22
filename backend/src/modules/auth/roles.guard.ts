import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole, RequestWithUser, JwtPayload } from './auth.types';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<UserRole[]>(
      ROLES_KEY,
      context.getHandler(),
    );
    if (!requiredRoles || requiredRoles.length === 0) return true;

    let user: JwtPayload | undefined;

    const gqlCtx = GqlExecutionContext.create(context);
    const gqlReq = gqlCtx.getContext<{ req: RequestWithUser }>().req;
    if (gqlReq) user = gqlReq.user;

    if (!user) {
      const req = context.switchToHttp().getRequest<RequestWithUser>();
      user = req.user;
    }

    if (!user) throw new ForbiddenException('No user info attached');
    if (requiredRoles.includes(user.role)) return true;

    throw new ForbiddenException('Insufficient permissions');
  }
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
