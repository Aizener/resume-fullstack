<script setup lang="ts">
import { ElPopover } from 'element-plus';
import { Icon } from '@iconify/vue';
import { useMainStore } from '@/store/main';
import { saveSessionStorage } from '@/utils/business';

const router = useRouter();
const mainStore = useMainStore();
const user = mainStore.user;
const handleLogout = () => {
  saveSessionStorage('menus', '');
  saveSessionStorage('permissions', '');
  saveSessionStorage('accessToken', '');
  mainStore.updateMenusFn([]);
  router.replace('/login');
};
</script>

<template>
  <div class="co-header">
    <div class="left">1</div>
    <div class="right">
      <el-popover placement="bottom" trigger="hover" width="100px">
        <template #reference>
          <div class="btn">
            <Icon icon="solar:user-circle-broken"></Icon>
            <span>用户信息</span>
          </div>
        </template>
        <template #default>
          <div class="info">
            <span>你好啊：</span>
            <p>{{ user?.username }}</p>
          </div>
          <el-button class="pop-item-btn" type="text" link @click="handleLogout">
            <span>登出</span>
            <Icon icon="ri:logout-circle-line"></Icon>
          </el-button>
        </template>
      </el-popover>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.co-header {
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .right {
    .btn {
      color: #606266;
      display: flex;
      align-items: center;
      color: #333;
      border: 1px solid #dcdfe6;
      border-radius: 5px;
      padding: 0.5rem;
      cursor: pointer;
      &:hover {
        color: #409eff;
        border-color: #c6e2ff;
        background-color: #ecf5ff;
      }
      span {
        font-size: 14px;
        margin-left: 5px;
        transform: translateY(1px);
      }
    }
    &:global(.info) {
      border-bottom: 1px solid #eee;
      margin-bottom: 1rem;
    }
    &:global(.pop-item-btn) {
      width: 100%;
    }
    &:global(.pop-item-btn > span) {
      width: 100%;
      justify-content: space-between;
    }
  }
}
</style>
