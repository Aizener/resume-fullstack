<script setup lang="ts">
import qs from 'qs';
import { onMounted, ref } from 'vue';
import Base from './pages/base.vue';
import Formal from './pages/formal.vue';

const paramsStr = decodeURIComponent(location.hash).split('?')[1];
const data = ref<any>({});
const url =
  process.env.NODE_ENV === 'development'
    ? '/api/resume/get/'
    : 'http://localhost:5555/resume/get/';
onMounted(async () => {
  const params = qs.parse(paramsStr);
  fetch(`${url}?id=${params.id}&userId=${params.userId}`)
    .then((res) => res.json())
    .then(({ data: _data }) => {
      data.value = _data;
      data.value.workList = _data.workList ? JSON.parse(_data.workList) : [];
      data.value.projectList = _data.projectList ? JSON.parse(_data.projectList) : [];
      data.value.educationList = _data.educationList
        ? JSON.parse(_data.educationList)
        : [];

      data.value.links = _data.links ? JSON.parse(_data.links) : [];
      data.value.sort = _data.sort ? JSON.parse(_data.sort) : [];
    });
});
</script>

<template>
  <div id="resume" class="resume-container">
    <i v-if="data.title" id="loaded" style="display: none"></i>
    <component :is="Base" :data="data"></component>
  </div>
</template>

<style lang="scss">
* {
  font-size: 12px;
  font-family: '微软雅黑';
}
li {
  margin-top: 0.5rem;
}
.resume-container {
  width: 794px;
  background-color: #fff;
  print-color-adjust: exact;
  -webkit-print-color-adjust: exact;
}
</style>
