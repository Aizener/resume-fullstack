import { useMainStore } from '@/store/main';
import { CoFormType } from "@/components/CoForm.vue";
import { getAbility, getUserInfo, login } from "@/utils/request/api/user";
import { getPermissionTree, saveSessionStorage } from '@/utils/business';

const form = ref<CoFormType[]>([
  { prop: 'username', label: '用户名', type: 'input' },
  { prop: 'password', label: '密码', type: 'password' }
]);
const rules = ref({
  username: [{ required: true, message: '请输入用户名' }],
  password: [{ required: true, message: '请输入密码' }]
});
const model = ref({
  username: '',
  password: ''
});

export const useForm = () => {
  const mainStore = useMainStore();
  const router = useRouter();

  const loginFn = async (isValid: boolean, done: () => void) => {
    if (!isValid) {
      return;
    }
    const { username, password } = model.value;
    const res = await login(username, password).catch(() => done());
    if (!res) {
      return;
    }
    saveSessionStorage('accessToken', res.data.accessToken);
    const id = res.data.id
    const userRes = await getUserInfo(id).catch(() => done());
    if (!userRes) {
      return;
    }
    mainStore.updateUserFn(userRes.data);
    mainStore.initUserAbilityFn(id).catch(() => done());
    router.push('/');
    done();
  }
  
  return {
    form,
    rules,
    model,
    loginFn
  }
}