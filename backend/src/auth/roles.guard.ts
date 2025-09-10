import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // GraphQL context
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;
    // role может приходить из cookie или быть проставленным в req.user
  const roleCookie = req?.cookies?.role;
  const isAdminCookie = req?.cookies?.isAdmin === 'true';
  const role = roleCookie ? roleCookie : (isAdminCookie ? 'admin' : (req?.user?.role ?? 'user'));
    return requiredRoles.includes(role);
  }
}
