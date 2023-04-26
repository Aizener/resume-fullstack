import { ElMessage } from 'element-plus';
import { CoFormType } from "@/components/CoForm.vue";
import { patchUserById } from "@/utils/request/api/user";

const showDialog = ref(false);
const user = ref();
const form = ref<CoFormType[]>([
  { prop: 'password', label: '新密码', type: 'password' },
  { prop: 'passwordConfirm', label: '确认密码', type: 'password' }
]);
const model = ref({
  password: '',
  passwordConfirm: ''
});
const rules = ref({
  password: [{ required: true, message: '请输入密码' }],
  passwordConfirm: [{ required: true, validator: (_: unknown, value: string, callback: Function) => {
    if (value.trim() !== model.value.password) {
      callback('两次输入的密码不一致');
      return;
    }
    callback();
  } }],
})

const onDialogCloseFn = (done: () => void) => {
  done();
}

const openDialogFn = (_user: ApiUser) => {
  user.value = _user;
  showDialog.value = true;
}

export const useDialogForm = () => {
  const updatePasswordFn = async () => {
    const res = await patchUserById(user.value.id, { password: model.value.password });
    if (res.code === 0) {
      showDialog.value = false;
      ElMessage.success('密码修改成功');
    } else {
      ElMessage.warning(res.msg);
    }
  }

  return {
    showDialog,
    form,
    model,
    rules,
    openDialogFn,
    onDialogCloseFn,
    updatePasswordFn
  }
}