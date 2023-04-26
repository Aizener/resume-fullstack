<script setup lang="ts">
definePageMeta({
  layout: 'index',
});

const types = ref<Array<Record<string, any>>>([{ name: '全部' }]);
const activeType = ref(0);
const templates = ref<Array<Record<string, any>>>([]);
const isLoading = ref(false);
const total = ref(0);
const page = ref(1),
  size = ref(10);
onNuxtReady(async () => {
  await getTemplateTypeList();
  await getTemplateList();
});

const handleChangeType = async (idx: number) => {
  activeType.value = idx;
  const target = types.value[idx];
  await getTemplateList(target.id);
};

const getTemplateTypeList = async () => {
  const res = await getTemplateTypes().catch((err) => err);
  if (res.code === 0) {
    types.value = [...types.value, ...res.data];
  }
};

const getTemplateList = async (templateTypeId?: number) => {
  const condition: Record<string, any> = {
    page: page.value,
    size: size.value,
  };
  if (templateTypeId) {
    condition.templateTypeId = templateTypeId;
  }
  isLoading.value = true;
  const res = await getTemplates(condition).catch((err) => err);
  isLoading.value = false;
  if (res.code === 0) {
    templates.value = res.data;
    total.value = res.total;
  }
};
</script>

<template>
  <NuxtLayout>
    <div class="store">
      <div class="limits">
        <div class="row">
          <p>类型：</p>
          <div
            class="item"
            :class="{ active: activeType === idx }"
            v-for="(item, idx) in types"
            :key="idx"
            @click="handleChangeType(idx)"
          >
            {{ item.name }}
          </div>
        </div>
        <div class="row">
          <p>价格：</p>
          <div class="item active">免费</div>
          <!-- <div class="item">付费</div> -->
        </div>
      </div>
      <div class="temps" v-loading="isLoading">
        <div v-if="!templates.length" class="empty">
          <el-empty description="暂无模板" />
        </div>
        <template v-else v-for="(item, idx) in templates" :key="idx">
          <co-resume :resume="item"></co-resume>
        </template>
      </div>
      <ClientOnly>
        <div class="page" v-if="templates.length && templates.length > size">
          <el-pagination background layout="prev, pager, next" :total="total" />
        </div>
      </ClientOnly>
    </div>
  </NuxtLayout>
</template>

<style lang="scss" scoped>
.store {
  width: 1200px;
  margin: 2rem auto;
  .limits {
    padding: 1rem;
    border-radius: 1rem;
    box-shadow: 0 0 5px #ccc;
    .row {
      display: flex;
      margin: 0.5rem 0;
      display: flex;
      align-items: center;
      font-size: 14px;
      p {
        font-weight: bold;
        margin-right: 1rem;
      }
      .item {
        margin-right: 1rem;
        padding: 6px 15px;
        transition: all 0.3s;
        border-radius: 1rem;
        cursor: pointer;
        &:last-child {
          margin-right: 0;
        }
        &.active {
          color: #fff;
          background-color: $primary-color;
        }
      }
    }
  }

  .temps {
    margin-top: 2rem;
    display: flex;
    flex-wrap: wrap;
    .empty {
      width: 100%;
      text-align: center;
    }
    .temp:nth-child(5n) {
      margin-right: 0;
    }
  }

  .page {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
