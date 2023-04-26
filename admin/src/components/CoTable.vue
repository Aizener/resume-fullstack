<script setup lang="ts">
export type CoTableHeaderType = {
  prop: string;
  label: string;
  width?: string | number;
  fixed?: boolean | string;
};
export type CoTableConditionType = {
  page: number;
  size: number;
  total: number;
  seoForm?: Array<{ [prop: string]: any }>;
};

const { tableData, tableHeader, tableCondition, add } = defineProps<{
  tableData: Array<unknown>;
  tableHeader: CoTableHeaderType[];
  tableCondition: CoTableConditionType;
  add?: string;
}>();

const emit = defineEmits([
  'add',
  'reset',
  'search',
  'update:tableData',
  'update:tableCondition',
]);

const copyTableCondition: CoTableConditionType = JSON.parse(
  JSON.stringify(tableCondition)
);

const handleReset = () => {
  emit('update:tableCondition', copyTableCondition);
  emit('reset');
  searchFn();
};

const loading = ref(false);

const searchFn = () => {
  loading.value = true;
  emit('update:tableData', []);
  emit('search', () => {
    loading.value = false;
  });
};

const handleSearch = () => {
  tableCondition.page = 1;
  searchFn();
};

const handleChangePage = (page: number) => {
  tableCondition.page = page;
  searchFn();
};

const handleChangeSize = (size: number) => {
  tableCondition.size = size;
  searchFn();
};

defineExpose({
  searchFn,
});

onMounted(() => {
  searchFn();
});
</script>

<template>
  <div class="co-table">
    <div class="search">
      <div class="search-left">
        <template v-for="item in tableCondition.seoForm">
          <el-input
            v-if="item.type === 'input'"
            v-model="item.value"
            :placeholder="item.placeholder"
            :clearable="item.clearable === undefined ? true : item.clearable"
          ></el-input>
          <el-select
            v-if="item.type === 'select'"
            v-model="item.value"
            :placeholder="item.placeholder"
            :clearable="item.clearable === undefined ? true : item.clearable"
          >
            <el-option
              v-for="opt in item.option"
              :label="opt.label"
              :value="opt.value"
            ></el-option>
          </el-select>
        </template>
      </div>
      <div class="search-right">
        <el-button @click="handleReset">重置</el-button>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button v-if="add" type="success" @click="$emit('add')">{{
          add || '添加'
        }}</el-button>
      </div>
    </div>
    <el-table :data="tableData" border v-loading="loading">
      <el-table-column
        v-for="item in tableHeader"
        :prop="item.prop"
        :label="item.label"
        :minWidth="item.width || '200px'"
        :fixed="item.fixed"
      >
        <template #default="scope">
          <slot :row="scope.row" :prop="item.prop">
            <span v-if="scope.row[item.prop]">{{ scope.row[item.prop] }}</span>
            <span class="not-data" v-else>-</span>
          </slot>
        </template>
        <template #header>
          <slot name="header" :label="item.label" :prop="item.prop">{{
            item.label
          }}</slot>
        </template>
      </el-table-column>
    </el-table>
    <div class="page">
      <el-pagination
        background
        layout="prev, pager, next, sizes"
        :current-page="tableCondition.page"
        :total="tableCondition.total"
        @current-change="handleChangePage"
        @size-change="handleChangeSize"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.co-table {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.search {
  flex-shrink: 0;
  display: flex;
  flex-wrap: wrap;
  &-right {
    display: flex;
    justify-content: flex-end;
    flex-shrink: 0;
    flex-grow: 1;
  }
  .el-input,
  .el-select {
    width: 250px;
    margin-right: 15px;
    margin-bottom: 10px;
  }
}
.el-table {
  flex: 1;
  margin: 15px 0;
}
.page {
  display: flex;
  height: 32px;
  flex-shrink: 0;
  justify-content: flex-end;
}

.not-data {
  color: #ccc;
}
</style>
