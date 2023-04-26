<script setup lang="ts">
import { toRefs } from 'vue';

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
  <div class="base">
    <div class="row top">
      <div class="avatar-box">
        <img
          class="avatar"
          v-if="data.avatar"
          :src="'https://cdn.yangxiang.cc/' + data.avatar"
          alt=""
        />
      </div>
      <div class="row info">
        <h2 class="row name">{{ data.name || '姓名' }}</h2>
        <div class="row more-info">
          <span>{{ data.age || '26' }}岁</span>
          <span>|</span>
          <span>{{ data.sex ? ['女', '男'][data.sex] || '-' : '男' }}</span>
          <span>|</span>
          <span>Phone：{{ data.phone || '13678398293' }}</span>
          <span>|</span>
          <span>Email：{{ data.email || '1215627787@qq.com' }}</span>
        </div>
        <div class="row more-info">
          <span>求职意向：{{ data.job || 'Web前端开发工程师' }}</span>
          <span>|</span>
          <span>工作经验：{{ data.workAge || '3' }}年</span>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="row performance">
        <h1 class="row title">个人优势</h1>
        <div class="row content" v-html="data.advantage"></div>
      </div>
      <div class="row block" :style="{ order: getSortOrder('workList') }">
        <h1 class="row title">工作经历</h1>
        <div class="row block-item" v-for="(item, idx) in data.workList" :key="idx">
          <div class="row info">
            <h2 class="name">
              {{ item.title || '公司名称' }}
              <p>{{ item.subtitle || '任职岗位' }}</p>
            </h2>
            <span class="date">{{ item.dateStr }}</span>
          </div>
          <div class="row content" v-html="item.desc"></div>
        </div>
      </div>
      <div class="row block" :style="{ order: getSortOrder('projectList') }">
        <h1 class="row title">项目经历</h1>
        <div class="block-item" v-for="(item, idx) in data.projectList" :key="idx">
          <div class="row info">
            <h2 class="name">
              {{ item.title }}
              <p>{{ item.subtitle }}</p>
            </h2>
            <span class="date">2022.07~2022.8</span>
          </div>
          <div class="row content" v-html="item.desc"></div>
        </div>
      </div>
      <div class="row block" :style="{ order: getSortOrder('educationList') }">
        <h1 class="row title">教育经历</h1>
        <div class="row block-item" v-for="(item, idx) in data.educationList" :key="idx">
          <div class="row info">
            <h2 class="name">
              {{ item.title || '学校名称' }}
              <p>{{ item.subtitle || '专业名称' }}</p>
            </h2>
            <span class="date">2022.07~2022.8</span>
          </div>
          <div
            class="row content"
            v-if="item.desc && item.desc !== '<p><br></p>'"
            v-html="item.desc"
          ></div>
        </div>
      </div>
      <div class="row interesting" :style="{ order: getSortOrder('likes') }">
        <h1 class="row title">个人爱好</h1>
        <div class="interesting-content" v-if="data.likes" v-html="data.likes"></div>
      </div>
      <div class="row links" :style="{ order: getSortOrder('links') }">
        <h1 class="row title">个人链接</h1>
        <div class="links-content">
          <div class="link" v-for="(item, idx) in data.links" :key="idx">
            {{ item.protocal }}{{ item.value }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.base {
  .content {
    padding: 0 1rem;
    display: flex;
    flex-direction: column;
  }
  .top {
    color: #fff;
    height: 180px;
    background-color: rgb(52, 58, 75);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 2rem;
    .avatar {
      width: 88px;
      height: 88px;
      border-radius: 50%;
      border: 1px solid #eee;
      padding: 0.5rem;
    }
    .info {
      display: flex;
      align-items: flex-end;
      flex-direction: column;
      .name {
        font-size: 14px;
      }
      .more-info {
        margin-top: 0.5rem;
        span {
          margin: 0 0.1rem;
        }
      }
    }
  }

  .title {
    font-size: 17px;
    margin-top: 0.5rem;
    padding: 1rem 1rem 1rem 0.5rem;
    position: relative;
    display: flex;
    align-items: center;
    &::after {
      content: '';
      position: absolute;
      left: 90px;
      width: calc(100% - 100px);
      height: 2px;
      background-color: #eee;
    }
  }
  .list {
    li {
      margin-top: 0.5rem;
      counter-increment: counter;
      &::before {
        content: counter(counter) '.';
      }
    }
  }

  .performance .content {
    padding-left: 1rem;
  }

  .block {
    &-item {
      padding: 0 1rem;
      margin-bottom: 1rem;
      .info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        h2 {
          display: flex;
          align-items: center;
          font-size: 15px;
          p {
            color: gray;
            font-size: 14px;
            margin-left: 1rem;
          }
        }
      }
      .content {
        margin-top: 0.5rem;
      }
    }
  }

  .interesting-content {
    padding: 0 0 1rem 1rem;
  }

  .links-content {
    padding: 0 0 1rem 1rem;
    .link {
      margin-top: 3px;
    }
  }
}
</style>
