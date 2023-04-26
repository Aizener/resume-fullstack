import { Step } from "driver.js"

const steps: Array<Step> = [
  {
    element: '#operate',
    popover: {
      className: 'step1 driver-custom-popover',
      title: '工具栏',
      description: '可以通过工具栏渲染或下载等',
      position: 'bottom-center',
    },
  },
  {
    element: '#sort',
    popover: {
      className: 'step2 driver-custom-popover',
      title: '排序按钮',
      description: '点击该按钮可对简历表单顺序进行调整',
      position: 'right',
    },
  },
  {
    element: '#title',
    popover: {
      className: 'step3 driver-custom-popover',
      title: '简历标题',
      description: '点击简历标题可对简历名称重新修改',
      position: 'bottom-center',
    },
  },
  {
    element: '#btns',
    popover: {
      className: 'step4 driver-custom-popover',
      title: '按钮栏',
      description: '这里进行简历的数据输出',
      position: 'bottom-center',
    },
  },
  {
    element: '#switch',
    popover: {
      className: 'step4.1 driver-custom-popover',
      title: '切换模板按钮',
      description: '点击该按钮可对模板进行切换',
      position: 'bottom-center',
    },
  },
  {
    element: '#save',
    popover: {
      className: 'step5 driver-custom-popover',
      title: '保存按钮',
      description: '点击该按钮可对表单信息进行保存',
      position: 'bottom-center',
    },
  },
  {
    element: '#render',
    popover: {
      className: 'step6 driver-custom-popover',
      title: '渲染按钮',
      description: '点击该按钮可以进行模板的渲染',
      position: 'bottom-center',
    },
  },
  {
    element: '#download',
    popover: {
      className: 'step7 driver-custom-popover',
      title: '下载按钮',
      description: '点击该按钮可对模板进行下载',
      position: 'left',
    },
  },
  {
    element: '#editor-form',
    popover: {
      className: 'step8 driver-custom-popover',
      title: '表单编辑区',
      description: '在此进行简历信息的表单数据填写',
      position: 'right',
    },
  },
  {
    element: '#preview-box',
    popover: {
      className: 'step9 driver-custom-popover',
      title: '简历预览区',
      description: '进行渲染操作后在此会显示模板',
      position: 'left',
    },
    onNext: () => {
      localStorage.setItem('isDriver', 'done');
    }
  },
];

export const useDriver = () => {
  const nuxtApp = useNuxtApp();
  const driver = nuxtApp.$driver as Function;
  if (localStorage.getItem('isDriver') !== 'done') {
    driver(steps);
  }
}
