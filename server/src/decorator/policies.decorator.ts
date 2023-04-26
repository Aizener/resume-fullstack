import { SetMetadata } from '@nestjs/common';
import { AppAbility } from '../casl/casl-ability.factory';

export interface IPolicyHandler {
  handle(ability: AppAbility): boolean;
}
type PolicyHandlerCallback = (ability: AppAbility) => boolean;
export type PolicyHandler = IPolicyHandler | PolicyHandlerCallback;

export const POLICIES_KEY = 'policy';
export const Policies = (...handlers: PolicyHandler[]) =>
  SetMetadata(POLICIES_KEY, handlers);
