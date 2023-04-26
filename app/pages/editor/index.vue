<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { useDebounceFn } from '@vueuse/core';
import draggable from 'vuedraggable';
import { useDriver } from '~/utils/service/editor/steps';

const baseForm = ref({
  name: '',
  avatar: '',
  age: '',
  sex: '',
  phone: '',
  email: '',
  job: '',
  workAge: '',
  status: '',
});
const advantage = ref('');
const workList = ref<Array<Record<string, any>>>([]);
const projectList = ref<Array<Record<string, any>>>([]);
const educationList = ref<Array<Record<string, any>>>([]);
const likes = ref('');
const links = ref<Array<Record<string, any>>>([]);
const sort = ref<Array<Record<string, any>>>([
  { order: 0, name: 'workList', title: '工作经历' },
  { order: 1, name: 'projectList', title: '项目经历' },
  { order: 2, name: 'educationList', title: '教育经历' },
  { order: 3, name: 'likes', title: '个人爱好' },
  { order: 4, name: 'links', title: '个人链接' },
]);

const imgs = ref<any>([]);
const isLoading = ref(true);
const resumeInfo = ref<Record<string, any>>({});

const route = useRoute();
let isInitData = false;

onNuxtReady(async () => {
  useDriver();

  const id = route.query.id;
  const res = await getResumeById((id as unknown) as number).catch((err) => err);
  isLoading.value = false;
  if (res.code === 0) {
    const { data } = res;
    resumeInfo.value = data;
    if (!data.template) {
      const tempRes = await getDefaultTemplate();
      data.template = tempRes.data;
    }
    for (const key in baseForm.value) {
      baseForm.value[key as keyof typeof baseForm.value] = data[key];
    }
    if (data.workList) {
      workList.value = JSON.parse(data.workList).map((item: any) => ({
        ...item,
        show: false,
      }));
    }
    if (data.projectList) {
      projectList.value = JSON.parse(data.projectList).map((item: any) => ({
        ...item,
        show: false,
      }));
    }
    if (data.educationList) {
      educationList.value = JSON.parse(data.educationList).map((item: any) => ({
        ...item,
        show: false,
      }));
    }
    if (data.links) {
      links.value = JSON.parse(data.links);
    }
    if (data.sort) {
      sort.value = JSON.parse(data.sort);
    }
    advantage.value = data.advantage || '';
    likes.value = data.likes || '';
    setTimeout(() => (isInitData = true), 3e3);
  }
});

const handleEditTitle = () => {
  ElMessageBox({
    title: '请设置简历名称',
    showInput: true,
    inputValue: resumeInfo.value.title,
    inputPlaceholder: '请输入',
    showCancelButton: true,
    confirmButtonText: '提交',
    cancelButtonText: '取消',
    beforeClose: async (action, instance, done) => {
      if (action === 'confirm') {
        instance.confirmButtonLoading = true;
        instance.confirmButtonText = '保存中...';
        const res = await updateResume(resumeInfo.value.id, {
          title: instance.inputValue,
        }).catch((err) => err);
        instance.confirmButtonLoading = false;
        instance.confirmButtonText = '保存';
        if (res.code === 0) {
          ElMessage.success('简历标题修改成功');
          resumeInfo.value = res.data;
          done();
        }
      } else {
        done();
      }
    },
  });
};

watch(
  [baseForm, advantage, likes, sort],
  () => {
    if (isInitData) {
      saveInfoFn();
    }
  },
  { deep: true }
);

const saveInfoFn = useDebounceFn(() => {
  handleSaveInfo();
}, 3e3);
// const rederFn = useDebounceFn(() => {
//   handleRender();
// }, 10e3);

const saveLoading = ref(false);
const handleSaveInfo = async () => {
  saveLoading.value = true;
  const res = await updateResume(resumeInfo.value.id, {
    title: resumeInfo.value.title,
    ...baseForm.value,
    advantage,
    workList: JSON.stringify(workList.value),
    projectList: JSON.stringify(projectList.value),
    educationList: JSON.stringify(educationList.value),
    links: JSON.stringify(links.value),
    likes: likes.value,
    sort: JSON.stringify(sort.value),
    templateId: resumeInfo.value.template.id,
  });
  saveLoading.value = false;
  if (res.code === 0) {
    ElMessage.success('保存成功');
    resumeInfo.value = res.data;
    // rederFn();
  }
};

const pdfData = shallowRef();
const renderLoading = ref(false);
const handleRender = async () => {
  renderLoading.value = true;
  const res = await generatePDF(resumeInfo.value.id).catch((err) => err);
  renderLoading.value = false;

  const blob = new Blob([res], { type: 'application/pdf' });
  pdfData.value = blob;
  const blobUrl = URL.createObjectURL(blob);
  const nuxtApp = useNuxtApp();
  const pdf = nuxtApp.$pdf as Function;
  pdf(blobUrl);
};

const downloadLoading = ref(false);
const handleDownload = async () => {
  if (!pdfData.value) {
    return;
  }
  const { template } = resumeInfo.value;
  if (!template) {
    return;
  }
  const templateId = template.id;
  downloadLoading.value = true;
  const res = await downloadTemplate(templateId);
  downloadLoading.value = false;
  if (res.code === 0) {
    const a = document.createElement('a');
    a.download = `${resumeInfo.value.title}.pdf`;
    a.href = URL.createObjectURL(pdfData.value);
    a.click();
    a.remove();
  }
};

const handleAddInfoItem = (type: string) => {
  const obj = {
    title: '',
    subtitle: '',
    date: null,
    dateStr: '',
    desc: '',
    show: false,
  };
  const types: Record<string, Ref> = {
    work: workList,
    project: projectList,
    education: educationList,
  };
  const target = types[type];
  target && target.value.push(obj);
};

const handleRemoveInfoItem = async (type: string, idx: number) => {
  const confirm = await ElMessageBox.confirm('你确定要删除这条数据嘛？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  }).catch((err) => err);
  if (confirm === 'confirm') {
    const types: Record<string, Ref> = {
      work: workList,
      project: projectList,
      education: educationList,
    };
    const target = types[type];
    target && target.value.splice(idx, 1);
  }
};

const handleLinks = () => {
  links.value.push({
    value: '',
    protocal: 'http://',
  });
};
const handleRemoveLink = (idx: number) => links.value.splice(idx, 1);
const handleChangeProtocal = (item: Record<string, any>) => {
  item.protocal = item.protocal === 'http://' ? 'https://' : 'http://';
};

const previewPage = ref(1);
const showPreviewPage = ref(false);
const hiddenPreviewPgaeFn = useDebounceFn(() => {
  showPreviewPage.value = false;
}, 2.5e3);
const scrollFn = useDebounceFn(() => {
  showPreviewPage.value = true;
  hiddenPreviewPgaeFn();
  const box = document.querySelector('.preview-box');
  const top = box?.scrollTop as number,
    height = box?.clientHeight as number;
  previewPage.value = top === 0 ? 1 : Math.ceil((top + 420) / height);
}, 50);
const handleScrollPreviewBox = () => {
  scrollFn();
};

const onChangeSort = () => {
  sort.value.forEach((item, idx) => {
    item.order = idx;
  });
};
const getSortOrder = (name: string) => {
  const target = sort.value.find((item) => item.name === name);
  return target?.order;
};

const showTemplates = ref(false);
const loadingTemplate = ref(false);
const templatesInfo = ref({
  list: [],
  total: 0,
});
const handleShowTemplate = async (page = 1) => {
  loadingTemplate.value = true;
  const res = await getTemplates({ page, size: 10 });
  loadingTemplate.value = false;
  if (res.code === 0) {
    showTemplates.value = true;
    templatesInfo.value.list = res.data;
    templatesInfo.value.total = res.total as number;
  }
};
const handleChangeTemplatePage = async (page: number) => {
  await handleShowTemplate(page);
};
const handleSwitchTemplate = async (_template: Record<string, any>) => {
  const { template } = resumeInfo.value;
  if (template.id === _template.id) {
    ElMessage.warning('该模板正在使用中');
    return;
  }
  const res = await updateResume(resumeInfo.value.id, {
    templateId: _template.id,
  }).catch((err) => err);
  if (res.code === 0) {
    ElMessage.success('模板切换成功');
    showTemplates.value = false;
    template.id = res.data.templateId;
  }
};
const handleCloseTemplates = (done: () => void) => {
  done();
};

const handleAvatarSuccess = () => {
  console.log('success');
};
const handleChangeAvatar = async (file: any) => {
  const res = await getToken();
  if (res.code !== 0) {
    return;
  }
  const formData = new FormData();
  formData.append('file', file.raw);
  formData.append('uploadToken', res.data);
  const uploadRes = await uploadFile(formData);
  if (uploadRes.code === 0) {
    baseForm.value.avatar = uploadRes.data.key;
  }
};
</script>

<template>
  <ClientOnly>
    <div class="editor" v-loading="isLoading" element-loading-text="加载模板中...">
      <div id="operate" class="operate">
        <div class="operate-left">
          <el-popover trigger="click" title="排序设置">
            <div class="sort-box">
              <draggable
                v-model="sort"
                ghostClass="ghost"
                item-key="id"
                @change="onChangeSort"
              >
                <template #item="{ element }">
                  <div class="sort-item" :key="element.name">
                    <span class="sort-title">{{ element.title }}</span>
                    <Icon class="move-icon" icon="ri:drag-move-2-fill" />
                  </div>
                </template>
              </draggable>
            </div>
            <template #reference>
              <Icon id="sort" class="sort-icon" icon="solar:square-sort-vertical-bold" />
            </template>
          </el-popover>
        </div>
        <div id="title" class="operate-center">
          <span class="title" @click="handleEditTitle">{{ resumeInfo.title }}</span>
          <el-tooltip
            class="question"
            effect="dark"
            content="点击简历名称可重新设置"
            placement="bottom"
          >
            <Icon class="question" icon="ph:question-fill" />
          </el-tooltip>
        </div>
        <div id="btns" class="operate-right">
          <el-button
            id="switch"
            type="danger"
            plain
            :loading="loadingTemplate"
            @click="handleShowTemplate()"
            >切换模板</el-button
          >
          <el-button
            id="save"
            type="warning"
            :loading="saveLoading"
            @click="handleSaveInfo"
            >保存</el-button
          >
          <el-button
            id="render"
            type="primary"
            :loading="renderLoading"
            @click="handleRender"
            >渲染</el-button
          >
          <el-tooltip placement="bottom" content="渲染后可进行当前内容的PDF文件下载">
            <el-button
              id="download"
              :type="pdfData ? 'success' : 'info'"
              :loading="downloadLoading"
              @click="handleDownload"
              >下载PDF文件</el-button
            >
          </el-tooltip>
        </div>
      </div>
      <div class="editor-container">
        <div id="editor-form" class="editor-form">
          <div class="editor-form--item">
            <h2 class="title">个人信息</h2>
            <el-form :model="baseForm">
              <el-form-item label-width="100px" label="姓名">
                <el-input v-model="baseForm.name" placeholder="请输入姓名"></el-input>
              </el-form-item>
              <el-form-item label-width="100px" label="头像">
                <el-upload
                  accept="image/*"
                  class="avatar-uploader"
                  :show-file-list="false"
                  :auto-upload="false"
                  :on-success="handleAvatarSuccess"
                  :on-change="handleChangeAvatar"
                >
                  <div v-if="baseForm.avatar" class="avatar">
                    <img :src="addQiniuUrl(baseForm.avatar)" />
                    <div class="avatar-bg">编辑</div>
                  </div>
                  <div v-else class="avatar-box">
                    <Icon class="upload-icon" icon="ic:outline-cloud-upload" />
                  </div>
                </el-upload>
              </el-form-item>
              <el-form-item label-width="100px" label="年龄">
                <el-select v-model="baseForm.age" placeholder="请选择年龄">
                  <el-option
                    v-for="(item, idx) in 100"
                    :key="idx"
                    :label="`${idx} 岁`"
                    :value="idx"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label-width="100px" label="性别">
                <el-select v-model="baseForm.sex" placeholder="请输入性别">
                  <el-option label="男" :value="1"></el-option>
                  <el-option label="女" :value="0"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label-width="100px" label="电话">
                <el-input v-model="baseForm.phone" placeholder="请输入电话"></el-input>
              </el-form-item>
              <el-form-item label-width="100px" label="邮箱">
                <el-input v-model="baseForm.email" placeholder="请输入邮箱"></el-input>
              </el-form-item>
              <el-form-item label-width="100px" label="求职岗位">
                <el-input v-model="baseForm.job" placeholder="请输入岗位"></el-input>
              </el-form-item>
              <el-form-item label-width="100px" label="工作年限">
                <el-select v-model="baseForm.workAge" placeholder="请选择工作年限">
                  <el-option
                    v-for="(item, idx) in 30"
                    :key="idx"
                    :label="`${idx} 年经验`"
                    :value="idx"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label-width="100px" label="当前状态">
                <el-select v-model="baseForm.status" placeholder="请选择当前状态">
                  <el-option label="离职" :value="0"></el-option>
                  <el-option label="在职" :value="1"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
          <div class="editor-form--item">
            <h2 class="title">个人优势</h2>
            <el-form>
              <el-form-item class="editor-item" label-width="100px" label="内容">
                <co-editor v-model="advantage"></co-editor>
              </el-form-item>
            </el-form>
          </div>
          <div class="editor-form--item" :style="{ order: getSortOrder('workList') }">
            <h2 class="title">工作经历</h2>
            <co-info-form
              v-for="(item, idx) in workList"
              :key="idx"
              :data="item"
              title="公司名称"
              subtitle="任职岗位"
              date-title="工作时间"
              @change="saveInfoFn"
              @remove="handleRemoveInfoItem('work', idx)"
            ></co-info-form>
            <div class="add" @click="handleAddInfoItem('work')">
              <Icon icon="material-symbols:add-circle-rounded" />
              <span>添加公司经历</span>
            </div>
          </div>

          <div class="editor-form--item" :style="{ order: getSortOrder('projectList') }">
            <h2 class="title">项目经历</h2>
            <co-info-form
              v-for="(item, idx) in projectList"
              :key="idx"
              :data="item"
              title="项目名称"
              subtitle="项目角色"
              date-title="项目时间"
              @change="saveInfoFn"
              @remove="handleRemoveInfoItem('project', idx)"
            ></co-info-form>
            <div class="add" @click="handleAddInfoItem('project')">
              <Icon icon="material-symbols:add-circle-rounded" />
              <span>添加项目经历</span>
            </div>
          </div>

          <div
            class="editor-form--item"
            :style="{ order: getSortOrder('educationList') }"
          >
            <h2 class="title">教育经历</h2>
            <co-info-form
              v-for="(item, idx) in educationList"
              :key="idx"
              :data="item"
              title="学校名称"
              subtitle="所学专业"
              date-title="起止时间"
              @change="saveInfoFn"
              @remove="handleRemoveInfoItem('education', idx)"
            ></co-info-form>
            <div class="add" @click="handleAddInfoItem('education')">
              <Icon icon="material-symbols:add-circle-rounded" />
              <span>添加教育经历</span>
            </div>
          </div>

          <div class="editor-form--item" :style="{ order: getSortOrder('likes') }">
            <h2 class="title">个人爱好</h2>
            <el-input
              class="likes-input"
              type="textarea"
              placeholder="请输入你的个人爱好"
              :rows="3"
              v-model="likes"
            ></el-input>
          </div>

          <div class="editor-form--item" :style="{ order: getSortOrder('links') }">
            <h2 class="title">个人链接</h2>
            <div class="links">
              <el-form>
                <el-form-item
                  label-width="80px"
                  :label="`链接${idx + 1}`"
                  v-for="(item, idx) in links"
                  :key="idx"
                  class="link-item"
                >
                  <div class="links-item">
                    <el-input
                      placeholder="请输入个人链接"
                      v-model="item.value"
                      @blur="saveInfoFn"
                    >
                      <template #prepend>
                        <div class="link-type" @click="handleChangeProtocal(item)">
                          {{ item.protocal }}
                        </div>
                      </template>
                    </el-input>
                    <Icon
                      class="delete-icon"
                      icon="typcn:delete"
                      @click="handleRemoveLink(idx)"
                    />
                  </div>
                </el-form-item>
              </el-form>
              <div class="add" @click="handleLinks">
                <Icon icon="material-symbols:add-circle-rounded" />
                <span>添加个人链接</span>
              </div>
            </div>
          </div>
        </div>
        <div class="editor-preview">
          <div
            id="preview-box"
            class="preview-box"
            @scroll="handleScrollPreviewBox"
          ></div>
          <div class="page" :class="{ active: showPreviewPage }">{{ previewPage }}</div>
        </div>
      </div>
    </div>
    <el-drawer
      v-model="showTemplates"
      title="模板商店"
      direction="rtl"
      :before-close="handleCloseTemplates"
      size="500px"
    >
      <div class="templates-container" v-loading="loadingTemplate">
        <div class="templates">
          <div
            class="templates-item"
            v-for="(item, idx) in templatesInfo.list"
            :key="idx"
          >
            <co-resume
              button-text="模板切换"
              :resume="item"
              :click-event="() => handleSwitchTemplate(item)"
            ></co-resume>
          </div>
        </div>
        <div class="templates-page" v-if="templatesInfo.total > 10">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="templatesInfo.total"
            @current-change="handleChangeTemplatePage"
          />
        </div>
      </div>
    </el-drawer>
  </ClientOnly>
</template>

<style lang="scss" scoped>
:global(body) {
  overflow-x: hidden;
}
.editor {
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: rgb(245, 245, 245);
  .operate {
    padding: 1rem;
    margin-bottom: 1rem;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &-left {
      display: flex;
      align-items: center;
      .switch-icon {
        color: purple;
        font-size: 30px;
        margin-left: 0.5rem;
        cursor: pointer;
      }
      .sort-icon {
        color: $primary-color;
        font-size: 30px;
        cursor: pointer;
        &:focus {
          outline: none;
          border: none;
          box-shadow: 0 0 5px #ccc;
          border-radius: 0.5rem;
        }
      }
      &:global(.sort-item) {
        color: $dark-color;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 16px;
        padding: 3px 8px;
        user-select: none;
        cursor: grab;
      }
      &:global(.sort-item.ghost) {
        color: #fff;
        background-color: $primary-color;
      }
    }
    &-center {
      color: #333;
      font-weight: bold;
      .title {
        cursor: pointer;
      }
      .question {
        transform: translate(2px, 2px);
      }
    }
  }
  &-container {
    flex: 1;
    display: flex;
    overflow: hidden;
  }
  &-form {
    flex: 1;
    display: flex;
    flex-direction: column;
    background-color: #fff;
    overflow-y: auto;
    padding-bottom: 2rem;
    .avatar-box {
      width: 100px;
      height: 100px;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid #ccc;
      border-radius: 0.5rem;
      .upload-icon {
        color: #ccc;
        font-size: 50px;
      }
    }

    .avatar {
      width: 100px;
      height: 100px;
      position: relative;
      &-bg {
        color: #fff;
        position: absolute;
        inset: 0;
        opacity: 0;
        transition: opacity 0.5s;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        &:hover {
          opacity: 1;
        }
      }
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        position: absolute;
        inset: 0;
      }
    }
    .title {
      font-size: 20px;
      padding: 1rem 1rem 1rem 1.5rem;
      position: relative;
      display: flex;
      align-items: center;
      &::before {
        content: '';
        position: absolute;
        left: 0.5rem;
        width: 6px;
        height: 20px;
        transform: translateY(1px);
        background-color: #4e6ef2;
      }
    }
    .el-form {
      display: flex;
      flex-wrap: wrap;
      &-item {
        width: 300px;
        margin-right: 2rem;
        align-items: center;
        &.date-item {
          width: 380px;
        }
        &.link-item {
          width: 450px;
        }
        &.editor-item {
          width: 100%;
        }
      }
    }
  }
  .add {
    color: $primary-color;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-right: 1rem;
    cursor: pointer;
    span {
      margin-left: 2px;
      font-size: 14px;
    }
  }

  .likes-input {
    padding: 1rem;
    &:deep(textarea) {
      resize: none;
    }
  }
  .links {
    .link-type {
      user-select: none;
      cursor: pointer;
    }
    .links-item {
      display: flex;
      align-items: center;
      .delete-icon {
        color: tomato;
        font-size: 28px;
        margin-left: 0.5rem;
        cursor: pointer;
      }
    }
  }

  &-preview {
    width: calc(600px + 2rem);
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
    position: relative;
    .preview-box {
      width: 600px;
      height: 845px;
      box-shadow: 0 0 5px inset #999;
      overflow-y: auto;
      margin-top: 0.5rem;
    }
    .page {
      position: absolute;
      right: 2rem;
      top: 50%;
      transform: translateY(-50%);
      width: 38px;
      height: 38px;
      background-color: #000;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 18px;
      color: #fff;
      border-radius: 50%;
      box-shadow: 0 0 5px #333;
      opacity: 0;
      transition: opacity 0.5s;
      &::after {
        content: '';
        position: absolute;
        border: 15px solid #000;
        border-color: transparent;
        border-left-color: #000;
        right: -22px;
      }
      &.active {
        opacity: 1;
      }
    }
  }

  &:global(.templates-container) {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  &:global(.templates) {
    display: flex;
    flex-wrap: wrap;
    flex: 1;
    overflow-y: auto;
  }
  &:global(.templates-item:nth-child(2n) .temp) {
    margin-right: 0;
  }
  &:global(.templates-page) {
    height: 50px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
