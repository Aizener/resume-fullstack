<script setup lang="ts">
import { ElDrawer, ElTree, ElDropdown, ElDropdownMenu } from 'element-plus';
import { useTable } from './service/useTable';
import { useDrawerForm } from './service/useDrawerForm';
import { hasRoleAction, Action } from '@/utils/actions';

const menuRef = ref(),
  permissionRef = ref(),
  formRef = ref(),
  tableRef = ref();
const { tableHeader, tableCondition, tableData, searchFn, getTitle } = useTable();
const {
  showDrawer,
  showDrawerType,
  menuTree,
  permissionGroup,
  form,
  rules,
  isLoading,
  submitLoading,
  closeDrawerFn,
  openDrawerFn,
  onMenuTreeClickFn,
  onPermissionClickFn,
  saveRoleFn,
} = useDrawerForm({ menuRef, permissionRef, formRef, tableRef });
</script>

<template>
  <CoTable
    ref="tableRef"
    :table-header="tableHeader"
    :table-data="tableData"
    v-model:table-condition="tableCondition"
    :add="hasRoleAction(Action.CREATE) ? '添加角色' : ''"
    @add="openDrawerFn('add')"
    @search="searchFn"
  >
    <template v-slot="{ row, prop }">
      <template v-if="prop === 'operate' && hasRoleAction(Action.UPDATE)">
        <el-dropdown split-button type="primary" @click="openDrawerFn('edit', row)">
          编辑
          <template #dropdown>
            <div v-action:role.delete>
              <el-dropdown-menu>
                <el-dropdown-item command="delete">删除</el-dropdown-item>
              </el-dropdown-menu>
            </div>
          </template>
        </el-dropdown>
      </template>
      <template v-else-if="prop === 'menusInfo'">
        {{ getTitle(row, prop) }}
      </template>
      <template v-else-if="prop === 'permissionsInfo'">
        {{ getTitle(row, prop) }}
      </template>
    </template>
  </CoTable>
  <el-drawer
    v-model="showDrawer"
    :title="showDrawerType === 'add' ? '角色添加' : '角色修改'"
    direction="rtl"
    :before-close="closeDrawerFn"
  >
    <el-form ref="formRef" v-loading="isLoading" :model="form" :rules="rules">
      <el-form-item label="角色名" prop="name">
        <el-input v-model="form.name" placeholder="请输入角色名"></el-input>
      </el-form-item>
      <el-form-item label="菜单权限" prop="menus">
        <el-tree
          ref="menuRef"
          @check="onMenuTreeClickFn"
          v-model="form.menus"
          :data="menuTree"
          :props="{ label: 'title' }"
          show-checkbox
          node-key="id"
        />
      </el-form-item>
      <el-form-item label="操作权限" prop="permissions">
        <el-tree
          ref="permissionRef"
          @check="onPermissionClickFn"
          :data="permissionGroup"
          :props="{ label: 'title' }"
          show-checkbox
          node-key="id"
        />
      </el-form-item>
      <el-form-item class="form-item__right">
        <el-button @click="showDrawer = false">取消</el-button>
        <el-button type="primary" @click="saveRoleFn" :loading="submitLoading"
          >保存</el-button
        >
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<style lang="scss" scoped>
.el-tree {
  width: 100%;
  background-color: rgb(250, 250, 250);
  padding: 0.5rem;
  transform: translate(0, 5px);
}
.form-item__right {
  margin-top: 2rem;
  &:deep(.el-form-item__content) {
    justify-content: flex-end;
  }
}
</style>
