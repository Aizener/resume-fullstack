<script setup lang="ts">
import { useForm } from './service/useForm';

const { form, model, rules, loginFn } = useForm();
</script>

<template>
  <div class="login">
    <div class="login-form">
      <h2>用户登录</h2>
      <CoForm
        :form="form"
        :model="model"
        :rules="rules"
        :show-cancel-button="false"
        @submit="loginFn"
      ></CoForm>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgb(245, 245, 245);
  &-form {
    width: 350px;
    padding: 3rem 3rem;
    border-radius: 5px;
    box-shadow: 0 0 5px #ddd;
    background-color: #fff;
  }
}
</style>
