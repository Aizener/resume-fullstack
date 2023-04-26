<script setup lang="ts">
import { Icon } from '@iconify/vue';

const props = withDefaults(
  defineProps<{
    data: any;
    title?: string;
    subtitle?: string;
    dateTitle?: string;
  }>(),
  {
    data: {},
    title: '标题',
    subtitle: '副标题',
    dateTitle: '时间',
  }
);

const emits = defineEmits(['remove', 'change']);
const data = ref(props.data);
watch(
  () => props.data,
  (val) => {
    data.value = val;
  }
);

watch(
  () => [data.value.title, data.value.subtitle, data.value.date, data.value.desc],
  (val) => {
    emits('change');
  },
  { deep: true }
);

const handleChangeDate = (e: any) => {
  const [start, end] = e;
  data.value.dateStr =
    parseTimeString(start, 'YYYY-MM-DD') + '-' + parseTimeString(end, 'YYYY-MM-DD');
  data.value.startDate = start.getTime();
  data.value.endDate = end.getTime();
};
</script>

<template>
  <div class="info-form">
    <div class="info-form--header">
      <div class="info">
        <h2 class="info-title">{{ data.title || `请编辑${props.title}` }}</h2>
        <span class="info-subtitle">{{ data.subtitle || `请编辑${props.title}` }}</span>
      </div>
      <div class="info-bottom">
        <span class="info-date"
          >{{ props.dateTitle }}：{{ data.dateStr || '0000-00-00 ~ 0000-00-00' }}</span
        >
        <div class="info-operate">
          <Icon
            @click="emits('remove')"
            class="info-icon remove-icon"
            icon="mdi:delete-circle"
          />
          <Icon
            class="info-icon toggle-icon"
            :class="{ active: data.show }"
            icon="material-symbols:arrow-drop-down-circle-rounded"
            @click="data.show = !data.show"
          />
        </div>
      </div>
    </div>
    <Transition name="toggle">
      <div class="info-form--content" v-show="data.show">
        <el-form>
          <el-form-item :label="props.title" label-width="80px">
            <el-input :placeholder="`请输入${title}`" v-model="data.title"></el-input>
          </el-form-item>
          <el-form-item :label="props.subtitle" label-width="80px">
            <el-input
              :placeholder="`请输入${props.subtitle}`"
              v-model="data.subtitle"
            ></el-input>
          </el-form-item>
          <el-form-item class="date-item" :label="props.dateTitle" label-width="80px">
            <el-date-picker
              :unlink-panels="false"
              v-model="data.date"
              type="daterange"
              range-separator="~"
              start-placeholder="请选择开始时间"
              end-placeholder="请选择结束时间"
              @change="handleChangeDate"
            />
          </el-form-item>
          <el-form-item class="editor-item" label="内容介绍" label-width="80px">
            <co-editor v-model="data.desc"></co-editor>
          </el-form-item>
        </el-form>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
.el-form {
  display: flex;
  flex-wrap: wrap;
  &-item {
    width: 300px;
    margin-right: 2rem;
    &.date-item {
      width: 380px;
    }
    &.editor-item {
      width: 100%;
    }
  }
}
.info-form {
  margin: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 0 5px #ccc;

  &--header {
    .remove-icon {
      color: red;
      margin-right: 0.5rem;
    }
    .toggle-icon {
      color: $primary-color;
      transform: rotate(180deg);
      transition: all 0.3s;
      &.active {
        transform: rotate(0deg);
      }
    }
  }
  .info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    &-title {
      font-size: 20px;
    }
    &-subtitle {
      color: gray;
      font-size: 14px;
    }
    &-bottom {
      padding: 0 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 1rem;
      border-bottom: 1px solid #eee;
      font-size: 24px;
      cursor: pointer;
      .info-date {
        color: gray;
        font-size: 14px;
      }
    }
  }
  &--content {
    padding: 2rem 0;
  }
}

.toggle-enter-from,
.toggle-leave-to {
  opacity: 0;
  transform: scaleX(0);
}
.toggle-enter-active,
.toggle-leave-active {
  transition: all 0.3s;
}
</style>
