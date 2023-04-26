<script setup lang="ts">
import { withDefaults } from 'vue';
import { FormInstance, FormRules } from 'element-plus';

export type CoFormType = {
  prop: string;
  label: string;
  type: string;
  placeholder?: string;
  option?: any[];
  show?: boolean | (() => boolean);
};
const props = withDefaults(
  defineProps<{
    form: CoFormType[];
    model: Record<string, any>;
    rules: FormRules;
    column?: boolean;
    showCancelButton?: boolean;
    loading?: boolean;
  }>(),
  {
    column: false,
    showCancelButton: true,
    loading: false,
  }
);
const { form, model, rules, column, showCancelButton, loading } = toRefs(props);

const formRef = ref<FormInstance>();
const submitLoading = ref(false);
const emit = defineEmits(['submit', 'cancel']);

const getLabelWidth = (item: any) => {
  return item.labelWidth ? item.labelWidth : '100px';
};
const getPlaceholderTitle = (item: any) => {
  let msg = '',
    { type, label } = item;
  switch (type) {
    case 'input':
    case 'password':
      msg = '输入';
      break;
    case 'select':
    case 'date':
      msg = '选择';
      break;
  }
  return `请${msg}${label}`;
};

const getShowStatus = (item: any) => {
  if (item.show === undefined) {
    return true;
  } else if (typeof item.show === 'boolean') {
    return item.show;
  }
  return item.show(model);
};

const validate = async () => {
  const isValid = await formRef.value!.validate().catch(() => false);
  return isValid;
};
const validateField = async (field: string) => {
  const isValid = await formRef.value!.validateField(field).catch(() => false);
  return isValid;
};
const scrollToField = async (field: string) => {
  formRef.value!.scrollToField(field);
};
const resetFields = async () => {
  formRef.value!.resetFields();
};
const clearValidate = async () => {
  formRef.value!.clearValidate();
};

const handleSubmit = async () => {
  const isValid = await validate();
  if (isValid) {
    submitLoading.value = true;
  }
  emit('submit', isValid, () => {
    submitLoading.value = false;
  });
};
const handleCancel = () => {
  emit('cancel');
};

defineExpose({
  validate,
  validateField,
  resetFields,
  scrollToField,
  clearValidate,
});
</script>

<template>
  <el-form
    class="co-form"
    :class="{ column: column }"
    ref="formRef"
    :model="model"
    :rules="rules"
    v-loading="loading"
  >
    <template v-for="(item, idx) in form">
      <div class="row" :key="idx" v-if="getShowStatus(item)">
        <el-form-item
          :prop="item.prop"
          :label="item.label"
          :label-width="getLabelWidth(item)"
        >
          <template v-if="item.type === 'input'">
            <slot :name="item.prop">
              <el-input
                :placeholder="
                  item.placeholder ? item.placeholder : getPlaceholderTitle(item)
                "
                v-model="model[item.prop]"
              ></el-input>
            </slot>
          </template>
          <template v-if="item.type === 'password'">
            <slot :name="item.prop">
              <el-input
                type="password"
                :placeholder="
                  item.placeholder ? item.placeholder : getPlaceholderTitle(item)
                "
                v-model="model[item.prop]"
              ></el-input>
            </slot>
          </template>
          <template v-else-if="item.type === 'select'">
            <slot :name="item.prop">
              <el-select
                v-model="model[item.prop]"
                :placeholder="
                  item.placeholder ? item.placeholder : getPlaceholderTitle(item)
                "
              >
                <el-option
                  v-for="(opt, idx) in item.option"
                  :idx="idx"
                  :label="opt.label"
                  :value="opt.value"
                ></el-option>
              </el-select>
            </slot>
          </template>
          <template v-else-if="item.type === 'radio'">
            <slot :name="item.prop">
              <el-radio-group
                v-model="model[item.prop]"
                :placeholder="
                  item.placeholder ? item.placeholder : getPlaceholderTitle(item)
                "
              >
                <el-radio
                  v-for="(opt, idx) in item.option"
                  :idx="idx"
                  :label="opt.value"
                  >{{ opt.label }}</el-radio
                >
              </el-radio-group>
            </slot>
          </template>
          <template v-else-if="item.type === 'checkbox'">
            <slot :name="item.prop">
              <el-checkbox-group
                v-model="model[item.prop]"
                :placeholder="
                  item.placeholder ? item.placeholder : getPlaceholderTitle(item)
                "
              >
                <el-checkbox
                  v-for="(opt, idx) in item.option"
                  :idx="idx"
                  :label="opt.value"
                  >{{ opt.label }}</el-checkbox
                >
              </el-checkbox-group>
            </slot>
          </template>
          <template v-else-if="item.type === 'switch'">
            <slot :name="item.prop">
              <el-switch v-model="model[item.prop]" />
            </slot>
          </template>
          <template v-else-if="item.type === 'date' || item.type === 'daterange'">
            <slot :name="item.prop">
              <el-date-picker
                v-model="model[item.prop]"
                :type="item.type"
                :placeholder="
                  item.placeholder ? item.placeholder : getPlaceholderTitle(item)
                "
                :start-placeholder="`请选择开始${item.label}`"
                :end-placeholder="`请选择结束${item.label}`"
              />
            </slot>
          </template>
        </el-form-item>
      </div>
    </template>
    <slot name="form-oerpate">
      <slot slot="operate">
        <div class="operate">
          <el-button v-if="showCancelButton" @click="handleCancel">取消</el-button>
          <el-button :loading="submitLoading" type="primary" @click="handleSubmit"
            >提交</el-button
          >
        </div>
      </slot>
    </slot>
  </el-form>
</template>

<style lang="scss" scoped>
.co-form {
  &.column {
    display: flex;
    flex-wrap: wrap;
    .row {
      width: 50%;
    }
  }
  .operate {
    width: 100%;
    padding-top: 15px;
    text-align: right;
  }
}
</style>
