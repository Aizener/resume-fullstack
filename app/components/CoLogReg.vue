<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { useUserStore } from '~/store';

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
  }>(),
  {
    modelValue: false,
  }
);
const form = ref({
  username: '',
  password: '',
  confirmPassword: '',
});
const loading = ref(false);
const { updateUserFn } = useUserStore();

const emits = defineEmits(['update:modelValue']);
const type = ref<'signin' | 'signup'>('signin');
const handleSubmit = async () => {
  if (loading.value) {
    return;
  }
  const { username, password, confirmPassword } = form.value;
  if (!username || !password) {
    ElMessage.warning('请输入用户名或者密码');
    return;
  }
  if (type.value === 'signin') {
    await handleLogin();
  } else {
    if (!confirmPassword || password !== confirmPassword) {
      ElMessage.warning('两次输入的密码不一致');
      return;
    }
    await handleRegisterUser();
  }
};

const handleFinish = (data: Record<string, any>) => {
  const { accessToken, ...user } = data;
  updateUserFn(user);
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('user', JSON.stringify(user));
  emits('update:modelValue', false);
};

const handleLogin = async () => {
  const { username, password } = form.value;
  loading.value = true;
  console.log(loading.value);
  const res = await login(username, password).catch((err) => err);
  loading.value = false;
  if (res.code === 0) {
    handleFinish(res.data);
    ElMessage.success('登录成功');
  }
};

const handleRegisterUser = async () => {
  const { username, password } = form.value;
  loading.value = true;
  const res = await registerUser(username, password).catch((err) => err);
  loading.value = false;
  if (res.code === 0) {
    handleFinish(res.data);
    ElMessage.success('注册成功，自动登入');
  }
};
const handleChangeType = (_type: 'signin' | 'signup') => {
  form.value = {
    username: '',
    password: '',
    confirmPassword: '',
  };
  type.value = _type;
};
const handleClose = () => {
  type.value = 'signin';
  form.value = {
    username: '',
    password: '',
    confirmPassword: '',
  };
  emits('update:modelValue', false);
};
</script>

<template>
  <Transition>
    <div
      class="dialog-form"
      :class="[type === 'signup' && 'register-form']"
      v-show="props.modelValue"
    >
      <div class="dialog-form--content">
        <div class="header">
          <div class="header-left">
            {{ type === 'signin' ? '用户登入' : '用户注册' }}
          </div>
          <div class="header-right">
            <p
              v-show="type === 'signin'"
              class="regist"
              @click="handleChangeType('signup')"
            >
              注册
            </p>
            <p
              v-show="type === 'signup'"
              class="regist"
              @click="handleChangeType('signin')"
            >
              登入
            </p>
          </div>
        </div>
        <div class="form">
          <div class="form-item">
            <Icon icon="ph:user" />
            <input v-model="form.username" placeholder="请输入用户名" />
          </div>
          <div class="form-item">
            <Icon icon="solar:lock-password-outline" />
            <input v-model="form.password" type="password" placeholder="请输入密码" />
          </div>
          <div class="form-item" v-show="type === 'signup'">
            <Icon icon="solar:lock-password-outline" />
            <input
              v-model="form.confirmPassword"
              type="password"
              placeholder="请确认密码"
            />
          </div>
        </div>
        <div class="operate">
          <div class="operate-left"></div>
          <div class="operate-right">
            <!-- <p class="visitor">游客登录</p> -->
            <p class="visitor" @click="handleClose">关闭</p>
            <div class="login" :class="[loading && 'loading']" @click="handleSubmit">
              <Icon class="login-icon" icon="ri:login-circle-line" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
.dialog-form {
  position: fixed;
  left: 50%;
  top: 50%;
  width: 390px;
  transform: translate(-50%, -50%) scale(0.999);
  background: linear-gradient(to right, rgb(257, 243, 231), rgb(251, 244, 225));
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 0 5px #ccc;
  transition: all 0.5s;
  user-select: none;
  &.register-form {
    transform: translate(-50%, -50%) rotateY(180deg);
    .dialog-form--content {
      transform: rotateY(-180deg);
    }
  }
  .header {
    margin-bottom: 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &-left {
      color: #333;
      font-size: 22px;
      font-family: '楷体';
    }
    .regist {
      font-size: 14px;
      color: gray;
      cursor: pointer;
    }
  }
  .form {
    &-item {
      height: 45px;
      padding: 0.5rem 1rem;
      border-radius: 3rem;
      background-color: #fff;
      box-shadow: 0 0 5px #eee;
      display: flex;
      align-items: center;
      color: gray;
      margin-bottom: 1.5rem;
      &:last-child {
        margin-bottom: 0;
      }
      input {
        color: gray;
        flex: 1;
        border: none;
        outline: none;
        margin-left: 1rem;
      }
    }
  }
  .operate {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
    padding-right: 0.5rem;
    &-left,
    &-right {
      display: flex;
      align-items: center;
    }
    .visitor {
      color: gray;
      font-size: 14px;
      margin-right: 1rem;
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }
    .login {
      color: #fff;
      width: 40px;
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      font-size: 24px;
      padding: 0.5rem;
      background: linear-gradient(to right, rgb(186, 223, 163), rgb(100, 182, 239));
      cursor: pointer;
      &.loading {
        .login-icon {
          animation: rotate 1s linear infinite;
        }
        @keyframes rotate {
          0% {
            transform: rotate(0);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      }
      &:hover {
        animation: debounce 0.5s 1 ease-in-out;
        box-shadow: 0 0 5px #999;
      }
    }
    @keyframes debounce {
      0% {
        transform: scaleY(1);
      }
      10% {
        transform: scaleY(0.3);
      }
      50% {
        transform: scaleY(1.2);
      }
      90% {
        transform: scaleY(0.8);
      }
      100% {
        transform: scaleY(1);
      }
    }
  }
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translate(-50%, -55%);
}
.v-enter-active,
.v-leave-active {
  transition: all 0.5s;
}
</style>
