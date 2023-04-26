import { ElMessage } from 'element-plus';
import { CoFormType } from '@/components/CoForm.vue';
import { getAllRole } from '@/utils/request/api/role';
import { createUser, getUserInfo, patchUserById } from '@/utils/request/api/user';
import { filterEmptyValueForObject } from '@/utils/business';

const showDrawer = ref(false);
const loadingForm = ref(false);
const showDrawerType = ref<'add' | 'edit' | ''>('');

const form = ref<CoFormType[]>([
  { prop: 'username', label: '用户名', type: 'input' },
  { prop: 'password', label: '密码', type: 'password' },
  { prop: 'nickname', label: '昵称', type: 'input' },
  { prop: 'age', label: '年龄', type: 'select', option: Array(188).fill('').map((_, idx) => ({ label: idx, value: String(idx) })) },
  { prop: 'sex', label: '性别', type: 'select', option: [{ label: '男', value: '1' }, { label: '女', value: '0' }] },
  { prop: 'role', label: '角色', type: 'select', option: [] },
]);
const model = ref({
  id: 0,
  username: '',
  password: '',
  nickname: '',
  age: '',
  sex: '',
  role: ''
});
const rules = ref({
  username: [{ required: true, message: '请输入用户名' }],
  password: [{ required: true, message: '请输入密码' }],
});

const initRoleList = async () => {
  const res = await getAllRole();
  if (res.code === 0) {
    const item = form.value.find(item => item.prop === 'role');
    if (item) {
      item.option = res.data.map(role => ({ label: role.name, value: String(role.id) }));
    }
  } else {
    ElMessage.warning('角色列表获取失败');
  }
}

const initUserInfo = async (id: number) => {
  const res = await getUserInfo(id);
  if (res.code === 0) {
    const { id, nickname, age, sex, role } = res.data;
    model.value.id = id;
    model.value.nickname = nickname;
    model.value.age = age ? String(age) : '';
    model.value.sex = sex ? String(sex) : '';
    model.value.role = role ? String(role) : '';
  } else {
    ElMessage.warning('获取用户信息失败');
  }
}

const setFormItemDisplay = (items: string[], show: boolean) => {
  const addFormItems = form.value.filter(item => items.includes(item.prop))
  addFormItems.forEach(formItem => formItem.show = show);
}

export const useDrawerForm = (formRef: Ref, tableRef: Ref) => {
  const closeDrawerFn = (done: () => void) => {
    formRef.value && formRef.value.resetFields();
    done();
  };
  
  const oepnDrawerFn = async (type: 'add' | 'edit', user?: ApiUser) => {
    showDrawer.value = true;
    loadingForm.value = true;
    showDrawerType.value = type;
    await initRoleList();
    if (type === 'edit' && user) {
      setFormItemDisplay(['username', 'password'], false);
      await initUserInfo(user.id);
    } else {
      setFormItemDisplay(['username', 'password'], true);
    }
    loadingForm.value = false;
  };
  
  const saveUserFn = async (isValid: boolean, done: () => void) => {
    if (!isValid) {
      return;
    }
    const { id, username, password, nickname, age, sex, role } = model.value; 
    let res: AxiosResponseType<ApiUser>;
    if (id) {
      res = await patchUserById(id, filterEmptyValueForObject({ nickname, age, sex, role }));
    } else {
      res = await createUser(filterEmptyValueForObject({ username, password, nickname, age, sex, role }));
    }
    done();
    if (res.code === 0) {
      tableRef.value && tableRef.value.searchFn();
      showDrawer.value = false;
      ElMessage.success('保存成功');
    } else {
      ElMessage.warning(res.msg);
    }
  }

  return {
    showDrawer,
    showDrawerType,
    form,
    model,
    rules,
    loadingForm,
    closeDrawerFn,
    oepnDrawerFn,
    saveUserFn
  };
};
