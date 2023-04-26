<script setup lang="ts">
import { toRefs } from 'vue';
import { Icon } from '@iconify/vue';

const props = defineProps<{
  data: Record<string, any>;
}>();

const { data } = toRefs(props);

const getSortOrder = (name: string) => {
  if (!data.value.sort) {
    return 0;
  }
  const target = data.value.sort.find((item: any) => item.name === name);
  return target?.order || 0;
};
</script>

<template>
  <div class="formal">
    <div class="formal-left">
      <div class="avatar-box row">
        <img
          class="avatar"
          v-if="data.avatar"
          :src="'https://cdn.yangxiang.cc/' + data.avatar"
          alt=""
        />
      </div>
      <div class="row info">
        <div class="row info-item">
          <div class="icon-box">
            <Icon class="info-icon" icon="material-symbols:date-range" />
          </div>
          <span>{{ data.age || '26' }}岁</span>
        </div>
        <div class="row info-item">
          <div class="icon-box">
            <Icon class="info-icon" icon="ph:gender-intersex" />
          </div>
          <span>{{ data.sex ? ['女', '男'][data.sex] || '-' : '男' }}</span>
        </div>
        <div class="row info-item">
          <div class="icon-box">
            <Icon
              class="info-icon"
              icon="streamline:interface-edit-typewriter-typewriter-company-office-supplies-work"
            />
          </div>
          <span>{{ data.job || 'Web前端开发工程师' }}</span>
        </div>
        <div class="row info-item">
          <div class="icon-box">
            <Icon class="info-icon" icon="eos-icons:cronjob" />
          </div>
          <span>{{ data.workAge || '2' }}年经验</span>
        </div>
        <div class="row info-item">
          <div class="icon-box">
            <Icon
              class="info-icon"
              icon="material-symbols:phone-android-outline-rounded"
            />
          </div>
          <span>{{ data.phone || '13678398296' }}</span>
        </div>
        <div class="row info-item">
          <div class="icon-box">
            <Icon
              class="info-icon"
              icon="material-symbols:attach-email-outline-rounded"
            />
          </div>
          <span>{{ data.email || '1215627787@qq.com' }}</span>
        </div>
      </div>
      <div class="row likes">
        <p class="row likes-title">兴趣爱好：</p>
        <p class="row likes-content">{{ data.likes }}</p>
      </div>
      <div class="row links">
        <p class="row links-title">个人链接：</p>
        <p class="row links-content" v-for="(item, idx) in data.links" :key="idx">
          {{ item.protocal }}{{ item.value }}
        </p>
      </div>
    </div>
    <div class="formal-right">
      <div class="row block">
        <div class="title">
          <div class="icon-box">
            <Icon class="title-icon" icon="material-symbols:personal-injury" />
          </div>
          <div class="title-content">个人优势</div>
        </div>
        <div class="block-content" v-html="data.advantage"></div>
      </div>
      <div class="row block">
        <div class="row title">
          <div class="row icon-box">
            <Icon class="title-icon" icon="material-symbols:personal-injury" />
          </div>
          <div class="row title-content">工作经历</div>
        </div>
        <div
          class="row block-content b-color"
          v-for="(item, idx) in data.workList"
          :key="idx"
        >
          <div class="row block-top">
            <p class="block-title">{{ item.title }}</p>
            <p class="block-subtitle">{{ item.subtitle }}</p>
          </div>
          <div class="row block-center">{{ item.dateStr }}</div>
          <div class="row block-bottom" v-html="item.desc"></div>
        </div>
      </div>
      <div class="row block">
        <div class="row title">
          <div class="row icon-box">
            <Icon class="title-icon" icon="material-symbols:personal-injury" />
          </div>
          <div class="row title-content">项目经历</div>
        </div>
        <div
          class="row block-content b-color"
          v-for="(item, idx) in data.projectList"
          :key="idx"
        >
          <div class="row block-top">
            <p class="block-title">{{ item.title }}</p>
            <p class="block-subtitle">{{ item.subtitle }}</p>
          </div>
          <div class="row block-center">{{ item.dateStr }}</div>
          <div class="row block-bottom" v-html="item.desc"></div>
        </div>
      </div>
      <div class="row block">
        <div class="row title">
          <div class="row icon-box">
            <Icon class="title-icon" icon="material-symbols:personal-injury" />
          </div>
          <div class="row title-content">教育经历</div>
        </div>
        <div
          class="row block-content b-color"
          v-for="(item, idx) in data.educationList"
          :key="idx"
        >
          <div class="row block-top">
            <p class="block-title">{{ item.title }}</p>
            <p class="block-subtitle">{{ item.subtitle }}</p>
          </div>
          <div class="row block-center">{{ item.dateStr }}</div>
          <div class="row block-bottom" v-html="item.desc"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$color: rgb(37, 70, 101);
.formal {
  display: flex;
  &-left {
    width: 150px;
    background-color: $color;
    display: flex;
    flex-direction: column;
    padding: 2rem;
    .avatar-box {
      .avatar {
        width: 100px;
        height: 100px;
      }
    }
    .info {
      margin-top: 1rem;
      .icon-box {
        min-width: 24px;
        height: 24px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        background-color: #fff;
        margin-right: 1rem;
      }
      &-icon {
        color: $color;
        font-size: 18px;
      }
      &-item {
        margin-top: 1rem;
        color: #fff;
        display: flex;
        align-items: center;
      }
    }
    .likes {
      color: #fff;
      font-weight: bold;
      margin-top: 3rem;
      &-content {
        margin-top: 0.5rem;
        font-weight: 400;
      }
    }
    .links {
      color: #fff;
      font-weight: bold;
      margin-top: 3rem;
      &-content {
        margin-top: 0.5rem;
        font-weight: 400;
        word-break: break-all;
      }
    }
  }
  &-right {
    flex: 1;
    padding: 2rem 1rem;
    .block {
      .title {
        display: flex;
        align-items: center;
        .icon-box {
          width: 36px;
          height: 36px;
          color: #fff;
          background-color: $color;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          .title-icon {
            font-size: 24px;
          }
        }
        &-content {
          flex: 1;
          font-size: 17px;
          color: $color;
          font-weight: bold;
          margin-left: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid $color;
        }
      }
      &-content {
        padding-left: 1rem;
        margin-top: 1rem;
        &.b-color {
          padding-bottom: 0.5rem;
          border-bottom: 1px dashed $color;
          &:last-child {
            border: none;
          }
        }
      }
      &-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      &-center {
        color: #333;
        text-align: right;
        margin: 0.5rem 0;
      }
      &-title {
        font-size: 15px;
      }
      &-subtitle {
        color: gray;
        font-size: 14px;
      }
    }
  }
}
</style>
