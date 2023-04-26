<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    resume: any;
    buttonText: string;
    clickEvent: () => void;
  }>(),
  {
    resume: {},
    buttonText: '立即制作',
    clickEvent: () => {},
  }
);

const { createResumeByDialog } = useResume();
const handleClick = async (item: Record<string, any>) => {
  if (props.clickEvent) {
    props.clickEvent();
    return;
  }
  createResumeByDialog(item.id);
};
</script>

<template>
  <div class="temp">
    <img class="cover" :src="'https://cdn.yangxiang.cc/' + props.resume.cover" alt="" />
    <div class="temp-operate">
      <el-button type="primary" @click="handleClick">{{ buttonText }}</el-button>
    </div>
    <div class="temp-info">{{ props.resume.title }}</div>
  </div>
</template>

<style lang="scss" scoped>
.temp {
  width: 200px;
  height: 300px;
  position: relative;
  border: 1px solid #ddd;
  overflow: hidden;
  box-shadow: 0 0 5px #ccc;
  border-radius: 5px;
  margin-right: 50px;
  margin-bottom: 2rem;
  &:hover {
    .temp-operate {
      opacity: 1;
    }
  }
  &-operate {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 2;
    transition: all 0.3s;
    opacity: 0;
  }
  .cover {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    object-fit: cover;
    object-position: left;
  }
  &-info {
    font-size: 14px;
    color: $dark-color;
    position: absolute;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.9);
    width: 100%;
    padding: 1rem 0.5rem;
    box-shadow: 0 -2px 3px #ccc;
    text-align: center;
  }
}
</style>
