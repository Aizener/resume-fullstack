<script setup lang="ts">
import { useUserStore } from '~/store';
const { user } = useUserStore();

onNuxtReady(async () => {
  await _getMyTemplates();
});

const myTemplates = ref<Array<Record<string, any>>>([]);
const myTemplateTotal = ref(0);
const _getMyTemplates = async () => {
  const res = await getMyTemplates();
  if (res.code === 0) {
    myTemplates.value = res.data.map((item: any) => {
      const cover = item?.template?.cover;
      return {
        ...item,
        cover,
      };
    });
    myTemplateTotal.value = res.total as number;
  }
};
const isLoading = ref(false);
const activeName = ref('temps');
const handleClick = () => {};
const onClickEvent = async (item: Record<string, any>) => {
  await navigateTo({ path: '/editor', query: { id: item.id } });
};
</script>

<template>
  <div class="personal">
    <div class="container">
      <div class="personal-left">
        <div class="info">
          <img src="@/assets/imgs/logo.png" alt="" class="avatar" />
          <div class="info-right">
            <h2 class="name">{{ user?.username }}</h2>
          </div>
        </div>
        <div class="content">
          <el-tabs v-model="activeName" class="tabs" @tab-click="handleClick">
            <el-tab-pane :label="`我的简历(${myTemplateTotal})`" name="temps">
              <div class="temps" v-loading="isLoading">
                <div v-if="!myTemplates.length" class="empty">
                  <el-empty description="暂无模板" />
                </div>
                <template v-else v-for="(item, idx) in myTemplates" :key="idx">
                  <co-resume
                    :resume="item"
                    button-text="进行编辑"
                    :click-event="() => onClickEvent(item)"
                  ></co-resume>
                </template>
              </div>
            </el-tab-pane>
            <el-tab-pane label="标签栏" name="my-temps"></el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <div class="personal-right">
        <div class="date">
          <span>创建时间：</span>
          <span>{{ parseTimeString(user?.createdTime) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.personal {
  width: 100%;
  min-height: 100vh;
  color: $dark-color;
  background-color: rgb(245, 245, 245);
  overflow: hidden;
  .container {
    width: 1200px;
    margin: 2rem auto;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    .info,
    .content,
    .personal-right {
      background-color: #fff;
      box-shadow: 0 0 5px #ccc;
    }
  }
  &-left {
    flex: 1;
    margin-right: 2rem;
    .info {
      width: 100%;
      height: 200px;
      display: flex;
      padding: 2rem;
      .avatar {
        width: 158px;
        height: 108px;
        // border-radius: 50%;
        border-radius: 1rem;
        padding: 3px;
        object-fit: cover;
        object-position: left;
        border: 1px solid #ddd;
      }
      &-right {
        margin-left: 2rem;
      }
    }
    .content {
      margin-top: 2rem;
      padding: 1rem;
      .temps {
        margin-top: 2rem;
        display: flex;
        flex-wrap: wrap;
        .empty {
          width: 100%;
          text-align: center;
        }
        .temp {
          width: 235px;
          &:nth-child(3n) {
            margin-right: 0;
          }
        }
      }
    }
  }
  &-right {
    width: 320px;
    padding: 1rem;
    .date {
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
