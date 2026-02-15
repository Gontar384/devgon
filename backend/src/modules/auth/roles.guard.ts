import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole, RequestWithUser } from './auth.types';
import { GqlExecutionContext } from '@nestjs/graphql';

const ROLES_KEY = 'roles';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<UserRole[]>(
      ROLES_KEY,
      context.getHandler(),
    );

    if (!requiredRoles || requiredRoles.length === 0) return true;

    const req = this.getRequest(context);
    const user = req.user;

    if (!user) throw new ForbiddenException('No user info attached');
    if (requiredRoles.includes(user.role)) return true;

    throw new ForbiddenException('Insufficient permissions');
  }

  private getRequest(context: ExecutionContext): RequestWithUser {
    const httpReq = context.switchToHttp().getRequest<RequestWithUser>();
    if (httpReq) return httpReq;

    const gqlCtx = GqlExecutionContext.create(context);
    return gqlCtx.getContext<{ req: RequestWithUser }>().req;
  }
}

export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
