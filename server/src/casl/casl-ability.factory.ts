import { Injectable } from '@nestjs/common';
import { Action } from 'src/enum/action.enum';
import {
  InferSubjects,
  PureAbility,
  AbilityBuilder,
  createMongoAbility,
} from '@casl/ability';
import { User } from 'src/users/entities/user.entity';
import { Permission } from 'src/permission/entities/permission.entity';

// type Subjects = InferSubjects<typeof User> | 'all';
type Subjects = string;
export type AppAbility = PureAbility<[Action, Subjects]>;

type UserPermission = User & { permissions: Permission[] };
@Injectable()
export class CaslAbilityFactory {
  createForUser(user: UserPermission) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      createMongoAbility,
    );

    if (user.permissions) {
      user.permissions.forEach((p) => {
        const { name, method } = p;
        const action = method.toUpperCase();
        can(Action[action], name);
      });
    }

    return build();
  }
}
