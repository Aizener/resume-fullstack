import Driver, { Step } from 'driver.js';
import 'driver.js/dist/driver.min.css';

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.provide('driver', (steps: Array<Step>) => {
    const driver = new Driver({
      closeBtnText: '关闭',
      nextBtnText: '下一步',
      prevBtnText: '上一步',
      doneBtnText: '知道了'
    });
    driver.defineSteps(steps);
    driver.start();
  });
});