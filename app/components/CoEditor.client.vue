<script setup lang="ts">
import '@wangeditor/editor/dist/css/style.css'; // 引入 css
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';

const props = defineProps<{
  modelValue: string;
}>();
const emits = defineEmits(['update:modelValue', 'change']);
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();

// 内容 HTML
const valueHtml = ref();
watch(
  () => props.modelValue,
  (val) => {
    valueHtml.value = val;
  },
  { immediate: true }
);
watch(
  () => valueHtml.value,
  (newVal) => {
    emits('update:modelValue', newVal);
    emits('change');
  }
);

// 模拟 ajax 异步获取内容
// onMounted(() => {
//   setTimeout(() => {
//     console.log(editorRef.value.getConfig());
//     valueHtml.value = '<p>模拟 Ajax 异步设置内容</p>';
//   }, 1500);
// });

const toolbarConfig = ref({
  toolbarKeys: [
    'bold',
    'color',
    'fontSize',
    'lineHeight',
    'bulletedList',
    'numberedList',
  ],
});
const editorConfig = ref({ placeholder: '请输入内容...' });

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

const handleCreated = (editor: Component) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};
</script>

<template>
  <div class="co-editor">
    <div>
      <Toolbar
        style="border-bottom: 1px solid #ccc"
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        mode="simple"
      ></Toolbar>
      <Editor
        style="height: 300px; overflow-y: hidden"
        v-model="valueHtml"
        :defaultConfig="editorConfig"
        mode="simple"
        @onCreated="handleCreated"
      ></Editor>
    </div>
  </div>
</template>

<style lang="scss">
.co-editor {
  border: 1px solid #ccc;
  width: 100%;
}
</style>
