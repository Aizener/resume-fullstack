import { getSessionStorage } from "./business";

export enum Action {
  CREATE = 'create',
  UPDATE = 'update',
  READ = 'read',
  DELETE = 'delete'
}

export enum ActionModule {
  USER = 'user',
  ROLE = 'role'
}

export const hasAction = (type: ActionModule, actions: Action[]) => {
  const userAction: any = getSessionStorage('permissions');
  const m = userAction[type];
  if (!m) {
    return false;
  }
  return actions.every(action => m[action]);
}

export const hasUserAction = (...actions: Action[]) => hasAction(ActionModule.USER, actions);
export const hasRoleAction = (...actions: Action[]) => hasAction(ActionModule.ROLE, actions);

