<script setup lang="ts">
import { useTable } from './service/useTable';
import { useDrawerForm } from './service/useDrawerForm';
import { useDialogForm } from './service/useDialogForm';
import { ElDropdown, ElDialog, ElMessage, ElMessageBox } from 'element-plus';
import { transferSex, transferDateString } from '@/utils/business';
import { deleteUserById } from '@/utils/request/api/user';
import { hasUserAction, Action } from '@/utils/actions';

const formRef = ref();
const tableRef = ref();
const { tableHeader, tableCondition, tableData, serachFn } = useTable();
const {
  showDrawer,
  showDrawerType,
  form,
  model,
  rules,
  loadingForm,
  oepnDrawerFn,
  closeDrawerFn,
  saveUserFn,
} = useDrawerForm(formRef, tableRef);
const {
  showDialog,
  form: dialogForm,
  model: dialogModel,
  rules: dialogRules,
  openDialogFn,
  onDialogCloseFn,
  updatePasswordFn,
} = useDialogForm();

const deleteUser = async (user: ApiUser) => {
  const confirm = await ElMessageBox.confirm(
    `你确定要删除用户'${user.username}'吗？`,
    '删除警告',
    {
      cancelButtonText: '取消',
      confirmButtonText: '确定',
    }
  ).catch((err) => err);
  if (confirm !== 'confirm') {
    return;
  }
  const res = await deleteUserById(user.id);
  if (res.code === 0) {
    ElMessage.success('删除成功');
    tableRef.value && tableRef.value.searchFn();
  } else {
    ElMessage.success(res.msg);
  }
};

const handleCommand = (e: string, user: ApiUser) => {
  switch (e) {
    case 'updatePassword':
      openDialogFn(user);
      break;
    case 'delete':
      deleteUser(user);
      break;
  }
};
</script>

<template>
  <CoTable
    ref="tableRef"
    :table-header="tableHeader"
    :table-data="tableData"
    v-model:table-condition="tableCondition"
    :add="hasUserAction(Action.CREATE) ? '添加用户' : ''"
    @add="oepnDrawerFn('add')"
    @search="serachFn"
  >
    <template v-slot="{ row, prop }">
      <template v-if="prop === 'operate'">
        <el-dropdown
          split-button
          type="primary"
          @click="oepnDrawerFn('edit', row)"
          @command="handleCommand($event, row)"
        >
          编辑
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="updatePassword">修改密码</el-dropdown-item>
              <div v-action:user.delete>
                <el-dropdown-item command="delete">删除</el-dropdown-item>
              </div>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
      <template v-else-if="prop === 'sex'">
        {{ transferSex(row.sex) }}
      </template>
      <template v-else-if="prop === 'createdTime'">
        {{ transferDateString(row.createdTime) }}
      </template>
      <template v-else-if="prop === 'role'">
        <span v-if="row.role">{{ row.role.name }}</span>
      </template>
    </template>
  </CoTable>
  <el-drawer
    v-model="showDrawer"
    :title="showDrawerType === 'add' ? '用户添加' : '用户修改'"
    direction="rtl"
    :before-close="closeDrawerFn"
  >
    <CoForm
      ref="formRef"
      :form="form"
      :model="model"
      :rules="rules"
      :loading="loadingForm"
      @submit="saveUserFn"
    ></CoForm>
  </el-drawer>
  <el-dialog
    v-model="showDialog"
    title="密码修改"
    width="30%"
    :before-close="onDialogCloseFn"
  >
    <CoForm
      :form="dialogForm"
      :model="dialogModel"
      :rules="dialogRules"
      @submit="updatePasswordFn"
    ></CoForm>
  </el-dialog>
</template>

<style lang="scss" scoped></style>
