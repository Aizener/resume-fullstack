import { initRouter } from '@/router';
import { getPermissionTree, saveSessionStorage } from '@/utils/business';
import { getAbility } from '@/utils/request/api/user';
import { defineStore } from 'pinia';

export const useMainStore = defineStore('mainStore', () => {
  const user = ref<ApiUser>();
  const menus = ref<ApiMenuList>([]);

  const updateMenusFn = (_menus: ApiMenuList) => {
    menus.value = _menus;
  }

  const updateUserFn = (_user: ApiUser) => {
    user.value = _user;
  }

  const initUserAbilityFn = async (id: number) => {
    const abilityRes = await getAbility(id);
    if (!abilityRes) {
      return;
    }
    const menus = abilityRes.data.menus;
    const permissions = getPermissionTree(abilityRes.data.permissions);
    saveSessionStorage('permissions', permissions);
    saveSessionStorage('menus', menus);
    updateMenusFn(menus);
    initRouter();
  }
  return {
    user,
    menus,
    updateMenusFn,
    updateUserFn,
    initUserAbilityFn,
  }
}, {
  persist: true
});