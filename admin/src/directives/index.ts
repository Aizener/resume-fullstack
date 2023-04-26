import { getSessionStorage } from "@/utils/business";
import { App } from "vue"

export const useGlobalDirectives = {
  install(app: App) {
    app.directive('action', {
      mounted(el, binding) {
        const userAction: any = getSessionStorage('permissions');
        if (!userAction) {
          el.remove();
          return;
        }
        const { arg, modifiers } = binding;
        if (!arg) {
          el.remove();
          return;
        }
        const m = userAction[arg];
        if (!m) {
          el.remove();
          return;
        }
        const actions = Object.keys(modifiers);
        const can = actions.every(action => m[action]);
        if (!can) {
          el.remove();
        }
      },
    });
  }
};