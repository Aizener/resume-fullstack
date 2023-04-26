const createResumeByDialog = (templateId: number) => {
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
        const res = await createResume({ templateId, title: inputValue }).catch(
          (err) => err
        );
        instance.confirmButtonLoading = false;
        instance.confirmButtonText = '提交';
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
  }).catch(err => err);
}

export const useResume = () => {
  return {
    createResumeByDialog
  }
}