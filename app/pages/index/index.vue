<script setup lang="ts">
import { Icon } from '@iconify/vue';

definePageMeta({
  layout: 'index',
});

onNuxtReady(() => {
  const nuxtApp = useNuxtApp();
  const initScroll = nuxtApp.$indexScroll as Function;
  initScroll();
});

const handleBegin = async () => {
  if (!localStorage.getItem('user')) {
    ElMessage.warning('请先登录');
    return;
  }
  ElMessageBox({
    title: '请设置简历名称',
    showInput: true,
    inputPlaceholder: '请输入',
    showCancelButton: true,
    confirmButtonText: '提交',
    cancelButtonText: '取消',
    beforeClose: async (action, instance, done) => {
      if (action === 'confirm') {
        instance.confirmButtonLoading = true;
        instance.confirmButtonText = '加载中...';
        const { inputValue } = instance;
        const res = await createResume({ title: inputValue }).catch((err) => err);
        instance.confirmButtonLoading = false;
        instance.confirmButtonText = '提交';
        console.log(res);
        if (res.code === 0) {
          done();
          ElMessage.success('创建成功，即将跳转...');
          setTimeout(async () => {
            await navigateTo({ path: '/editor', query: { id: res.data.id } });
          }, 1e3);
        }
      } else {
        done();
      }
    },
  });
};

const typeActive = ref(0);

const handleStar = () => {
  window.open('https://github.com/Aizener/resume-fullstack');
};
</script>

<template>
  <NuxtLayout>
    <div class="index">
      <div class="content">
        <div class="title-box">
          <h1>一简</h1>
          <p>一个开源、免费、简易的简历编写工具</p>
          <p>即时编写，即时预览</p>
        </div>
        <div class="btns">
          <el-button size="large" type="primary" @click="handleBegin">立即开始</el-button>
          <el-button size="large" type="warning" @click="handleStar"
            ><Icon icon="mdi:github" />Star</el-button
          >
        </div>
      </div>
      <div class="intro">
        <img class="cover" src="@/assets/imgs/cover.gif" />
        <div class="intro-title">
          <div class="title-header">
            <div
              class="title-header-item"
              :class="[typeActive === 0 && 'active']"
              @click="typeActive = 0"
            >
              简单
            </div>
            <div
              class="title-header-item"
              :class="[typeActive === 1 && 'active']"
              @click="typeActive = 1"
            >
              免费
            </div>
            <div
              class="title-header-item"
              :class="[typeActive === 2 && 'active']"
              @click="typeActive = 2"
            >
              快捷
            </div>
          </div>
          <div
            class="title-content"
            :class="[typeActive === 0 && 'active']"
            @click="typeActive = 0"
          >
            <p>使用简单，点击「立即开始」即可编写简历</p>
            <p class="subtitle">—— 简单</p>
          </div>
          <div
            class="title-content"
            :class="[typeActive === 1 && 'active']"
            @click="typeActive = 1"
          >
            <p>您编辑的所有简历模板都是免费下载使用的</p>
            <p class="subtitle">—— 免费</p>
          </div>
          <div
            class="title-content"
            :class="[typeActive === 2 && 'active']"
            @click="typeActive = 2"
          >
            <p>编写完成后，可以直接进行渲染或下载</p>
            <p class="subtitle">—— 快捷</p>
          </div>
        </div>
      </div>
      <div class="example">
        <h1>模板样例</h1>
        <h2>为您列举一些简历模板的图片</h2>
        <div class="list">
          <img
            class="example-img"
            src="https://cdn.yangxiang.cc/base.png"
            alt=""
            v-for="(item, idx) in 12"
          />
        </div>
      </div>
      <div class="feature">
        <h1>简历特点</h1>
        <h2>小站简历编写有以下几个特点</h2>
        <div class="feature-list">
          <div class="feature-item">
            <Icon class="feature-icon" icon="solar:round-sort-vertical-bold" />
            <p class="title">可排序</p>
            <p class="subtitle">可以调整部分简历内容的显示顺序</p>
          </div>
          <div class="feature-item">
            <Icon class="feature-icon" icon="material-symbols:switch-camera-sharp" />
            <p class="title">可切换</p>
            <p class="subtitle">可以切换不同的模板进行编写</p>
          </div>
          <div class="feature-item">
            <Icon class="feature-icon" icon="fluent:preview-link-20-filled" />
            <p class="title">可预览</p>
            <p class="subtitle">编写简历后可立即预览当前内容</p>
          </div>
          <div class="feature-item">
            <Icon class="feature-icon" icon="ic:baseline-cloud-download" />
            <p class="title">可下载</p>
            <p class="subtitle">预览满意后可直接一键下载</p>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<style lang="scss" scoped>
.index {
  width: 100%;
  min-height: 100vh;
  overflow-x: hidden;
  overflow-y: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  background-color: rgb(245, 245, 245);

  .content {
    width: 1200px;
    height: calc(100vh - 10rem);
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 6rem;
    border-radius: 1rem;
    box-shadow: 0 0 5px #ccc;
    background: linear-gradient(
      135deg,
      rgb(185, 239, 248),
      rgb(194, 190, 251),
      rgb(247, 234, 185)
    );
    position: absolute;
    .title-box {
      color: $dark-color;
      text-align: center;
      transform: translateY(-2rem);

      h1 {
        font-size: 52px;
        margin-bottom: 2rem;
      }
      p {
        font-size: 18px;
        margin-top: 0.5rem;
      }
    }
    .btns {
      text-align: center;
      margin-top: 1rem;
      .el-button {
        margin: 0 1rem;
        width: 180px;
        height: 50px;
        font-size: 18px;
      }
    }
  }
  .intro {
    height: 500px;
    position: absolute;
    top: 400px;
    .cover {
      width: 800px;
      height: 500px;
      border-radius: 1rem;
      box-shadow: 0 0 5px #ccc;
      position: relative;
      z-index: 2;
    }
    .intro-title {
      width: 450px;
      height: 300px;
      padding: 1rem;
      border-radius: 0.5rem;
      opacity: 0;
      margin-top: -500px;
      transform: translate(-200px, 0);
      .title-header {
        display: flex;
        &-item {
          flex: 1;
          color: $dark-color;
          color: #fff;
          font-weight: bold;
          font-size: 28px;
          display: flex;
          justify-content: center;
          border-radius: 5rem;
          padding: 0.5rem 0;
          margin: 0 0.5rem;
          position: relative;
          cursor: pointer;
          &.active {
            color: $dark-color;
            box-shadow: 0 0 5px #ddd;
            background-color: #fff;
          }
        }
      }
      .title-content {
        width: 100%;
        color: $dark-color;
        font-size: 20px;
        margin-top: 2rem;
        margin-left: 1rem;
        text-align: center;
        background-color: #fff;
        padding: 1rem;
        box-shadow: 0 0 5px #ccc;
        border-radius: 1rem;
        position: absolute;
        opacity: 0;
        .subtitle {
          color: gray;
          font-size: 14px;
          text-align: right;
          margin-top: 0.5rem;
        }
        &.active {
          opacity: 1;
        }
      }
    }
  }

  .example {
    position: absolute;
    text-align: center;
    top: 600px;
    opacity: 0;
    h2 {
      color: gray;
      font-size: 18px;
      margin-top: 0.5rem;
      margin-bottom: 2rem;
    }
    .list {
      width: 100vw;
      display: flex;
      &::-webkit-scrollbar {
        height: 0;
      }
    }
    &-img {
      width: 200px;
      height: 300px;
      object-fit: cover;
      object-position: left;
      box-shadow: 0 0 5px #ccc;
      margin: 1rem;
      border-radius: 5px;
    }
  }

  .feature {
    margin-top: 960px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #fff;
    padding: 2rem;
    h1 {
      font-size: 28px;
    }
    h2 {
      color: gray;
      font-size: 16px;
      margin-top: 0.5rem;
    }
    &-list {
      display: flex;
      margin-top: 2rem;
      flex-wrap: wrap;
    }
    &-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 0 1rem;
      .title {
        font-size: 18px;
        margin: 0.5rem 0;
      }
      .subtitle {
        color: gray;
      }
      &:nth-child(1) .feature-icon {
        color: tomato;
      }
      &:nth-child(2) .feature-icon {
        color: orange;
      }
      &:nth-child(3) .feature-icon {
        color: purple;
      }
      &:nth-child(4) .feature-icon {
        color: green;
      }
    }
    &-icon {
      font-size: 60px;
    }
  }
}
</style>
