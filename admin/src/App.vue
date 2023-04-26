<script setup lang="ts">
import { useMainStore } from './store/main';

const mainStore = useMainStore();

onMounted(async () => {
  mainStore.user && mainStore.initUserAbilityFn(mainStore.user.id);
});
</script>

<template>
  <div class="container">
    <router-view></router-view>
  </div>
</template>

<style scoped></style>
