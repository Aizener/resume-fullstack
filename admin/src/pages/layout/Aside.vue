<script setup lang="ts">
import AsideItem from './AsideItem.vue';
import { getSessionStorage } from '@/utils/business';
import { ElMenu } from 'element-plus';
import { useMainStore } from '@/store/main';

const mainStore = useMainStore();
const router = useRouter();
const onSelected = (index: string) => {
  router.push(index);
};
</script>

<template>
  <el-menu class="aside" mode="vertical" @select="onSelected">
    <AsideItem :menus="mainStore.menus"></AsideItem>
  </el-menu>
</template>

<style lang="scss" scoped>
.aside {
  height: 100%;
}
</style>
