<script setup lang="ts">
import { routeDict } from '@/router/route-dict';

const props = defineProps<{
  menus: ApiMenuList;
}>();
</script>

<template>
  <template v-for="(menu, idx) in props.menus">
    <el-sub-menu :index="menu.path" v-if="menu.children && menu.children.length">
      <template #title>
        <span>{{ menu.title }}</span>
      </template>
      <AsideItem :menus="menu.children"></AsideItem>
    </el-sub-menu>
    <el-menu-item v-else-if="routeDict[menu.name]" :index="menu.path">{{
      menu.title
    }}</el-menu-item>
  </template>
</template>

<style lang="scss" scoped></style>
