<script setup lang="ts">
import { useUserStore } from '~/store';

const route = useRoute();
const currentPath = ref(route.path);
const dialogVisible = ref(false);
const { user } = useUserStore();
</script>

<template>
  <div class="index-layout">
    <header>
      <div class="header-left">
        <div class="logo"></div>
      </div>
      <div class="header-right">
        <NuxtLink class="link" :class="{ active: currentPath === '/' }" to="/"
          >首页</NuxtLink
        >
        <NuxtLink class="link" :class="{ active: currentPath === '/store' }" to="/store"
          >模板商店</NuxtLink
        >
        <NuxtLink
          class="link"
          :class="{ active: currentPath === '/personal' }"
          to="/personal"
          v-if="user"
          >{{ user.username }}</NuxtLink
        >
        <el-button v-else type="primary" round @click="dialogVisible = true"
          >登录</el-button
        >
      </div>
    </header>
    <div class="main-container">
      <slot />
    </div>
    <footer>
      <p class="greet">谢谢您的使用</p>
      <div class="tips">如有疑问，可联系作者QQ：1215627787</div>
    </footer>
    <co-log-reg v-model="dialogVisible"></co-log-reg>
  </div>
</template>

<style lang="scss" scoped>
$indexHeight: 60px;
.index-layout {
  width: 100%;
  min-height: 100vh;
  padding-top: $indexHeight;
  background-color: rgb(251, 251, 251);
  .main-container {
    min-height: calc(100vh - 60px - 67px - 32px - 32px - 2rem);
  }
  header {
    position: fixed;
    inset: 0;
    width: 100%;
    height: $indexHeight;
    // border-bottom: 1px solid #eee;
    box-shadow: 0 3px 5px #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    background-color: #fff;
    z-index: 9;
    .logo {
      width: 100px;
      height: 50px;
      background: url('@/assets/imgs/logo.png');
      background-position: -20px -30px;
    }
    .link {
      color: #333;
      text-decoration: none;
      margin-right: 2rem;
      &.active {
        color: $primary-color;
      }
      &:hover {
        color: $primary-color;
      }
      &:last-child {
        margin: 0;
      }
    }
  }
  footer {
    height: 100px;
    padding: 1rem;
    margin-top: 2rem;
    display: flex;
    justify-content: space-between;
    border-top: 1px solid #eee;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    .tips {
      color: gray;
      font-size: 14px;
      margin-top: 0.5rem;
    }
  }
}
</style>
