import { SetMetadata } from '@nestjs/common';
import { RoleType } from 'src/enum/roles.enum';
export const ROLES_KEY = 'roles';
export const Role = (role: RoleType) => SetMetadata(ROLES_KEY, role);
