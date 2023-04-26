import { ElMessage } from 'element-plus';
import { getMenuTree, getPermissionGroup, getRoleInfo, saveRole, updateRole } from '@/utils/request/api/role';
type Tree = {
  label: string
  children?: Tree[]
}
const showDrawer = ref(false);
const showDrawerType = ref<'add' | 'edit' | ''>('');
const menuTree = ref<any>([]);
const permissionGroup = ref<any>([]);
const submitLoading = ref(false);
const form = ref<{
  id?: number,
  name: string,
  menus: number[],
  permissions: number[]
}>({
  id: 0,
  name: '',
  menus: [],
  permissions: [],
});
const rules = ref({
  name: [{ required: true, message: '请输入角色名称' }],
  menus: [{ required: true, message: '请选择菜单权限' }],
  permissions: [{ required: true, message: '请选择操作权限' }],
});
const isLoading = ref(false);

const initMenuTree = async () => {
  const res = await getMenuTree();
  if (res.code === 0) {
    menuTree.value = res.data;
  }
};

const initPermissionGroup = async () => {
  const res = await getPermissionGroup();
  if (res.code === 0) {
    permissionGroup.value = res.data;
  }
};

const initRoleInfo = async (role: ApiRole) => {
  const res = await getRoleInfo(role.id);
  if (res.code === 0) {
    const { id, name, menus, permissions } = res.data;
    form.value.id = id;
    form.value.name = name;
    form.value.menus = menus ? menus : [];
    form.value.permissions = permissions ? permissions : [];
  } else {
    ElMessage.warning('获取角色信息失败');
  }
}

export const useDrawerForm = ({ menuRef, permissionRef, formRef, tableRef }: { menuRef: Ref, permissionRef: Ref, formRef: Ref, tableRef: Ref }) => {
  const openDrawerFn = async (type: 'add' | 'edit', role?: ApiRole) => {
    showDrawerType.value = type;
    showDrawer.value = true;
    isLoading.value = true;
    await initMenuTree();
    await initPermissionGroup();
    if (type === 'edit' && role) {
      await initRoleInfo(role);
      menuRef.value.setCheckedKeys(form.value.menus);
      permissionRef.value.setCheckedKeys(form.value.permissions);
    }
    isLoading.value = false;
  };
  const closeDrawerFn = (done: () => void) => {
    formRef.value && formRef.value.resetFields();
    done();
  };
  const onMenuTreeClickFn = (_: Tree, { checkedNodes }: { checkedNodes: ApiMenu[] }) => {
    form.value.menus = checkedNodes.map((item: ApiMenu) => item.id);
  }
  const onPermissionClickFn = (_: Tree, { checkedNodes }: { checkedNodes: ApiPermission[] }) => {
    form.value.permissions = checkedNodes.map((item: ApiPermission) => item.id);
  }
  const saveRoleFn = async () => {
    submitLoading.value = true;
    let res: AxiosResponseType<ApiRole>;
    if (form.value.id) {
      res = await updateRole(form.value.id, form.value);
    } else {
      res = await saveRole(form.value);
    }
    submitLoading.value = false;
    if (res.code === 0) {
      ElMessage.success('保存成功');
      showDrawer.value = false;
      tableRef.value.searchFn();
    } else {
      ElMessage.warning(res.msg);
    }
  }

  return {
    showDrawer,
    showDrawerType,
    menuTree,
    permissionGroup,
    form,
    rules,
    isLoading,
    submitLoading,
    closeDrawerFn,
    openDrawerFn,
    onMenuTreeClickFn,
    onPermissionClickFn,
    saveRoleFn
  };
};
