import { AppAbility } from 'src/casl/casl-ability.factory';
import { IPolicyHandler } from 'src/decorator/policies.decorator';
import { Action } from 'src/enum/action.enum';
import { Subject } from 'src/enum/subject.enum';

export class UserPolicyHandler implements IPolicyHandler {
  action: Action;
  constructor(action: Action) {
    this.action = action;
  }
  handle(ability: AppAbility) {
    return ability.can(this.action, Subject.USER);
  }
}
