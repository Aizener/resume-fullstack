<script setup lang="ts">
import { ElContainer, ElAside, ElHeader, ElMain } from 'element-plus';
import Aside from './Aside.vue';
import Header from './Header.vue';
</script>

<template>
  <el-container>
    <el-aside width="200px">
      <Aside></Aside>
    </el-aside>
    <el-container>
      <el-header>
        <Header></Header>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.el-container {
  height: 100%;
  .el-header {
    border-bottom: 1px solid #ddd;
  }
}
</style>
