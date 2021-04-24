import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { Role } from './role.enum';
import { RolesGuard } from './roles.guard';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) =>
    applyDecorators(SetMetadata(ROLES_KEY, roles), UseGuards(RolesGuard));
