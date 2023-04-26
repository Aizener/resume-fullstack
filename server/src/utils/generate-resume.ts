import puppeteer, { Browser } from 'puppeteer';
import { jsPDF } from 'jspdf';

let instance: null | ResumeHelper;
const width = 595,
  height = 845;
export class ResumeHelper {
  private browser: null | Browser;
  private width: number;
  private height: number;
  private lineHeight: number;
  private scale: number;
  constructor() {
    this.width = width;
    this.height = height;
    this.lineHeight = 1;
    this.scale = 2;
    this.browser = null;
  }

  static newInstance() {
    if (!instance) {
      instance = new ResumeHelper();
    }
    return instance;
  }

  async initBrowser() {
    if (!this.browser) {
      this.browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    }
    return this;
  }

  async shotPDF(path: string, params: string) {
    const page = await this.browser.newPage();

    // 定义自定义字体路径和@font-face规则
    const fontPath = 'htpp://localhost:5555/public/MSYH_Bold.ttf';
    await page.addStyleTag({
      content: `
        @font-face {
          font-family: 'Microsoft YaHei';
          src: url(${fontPath}) format('truetype');
          font-weight: normal;
          font-style: normal;
        }
      `,
    });
    await page.goto(`${path}?${params}`);

    // 设置网页样式
    await page.addStyleTag({
      content: `
        body {
          font-family: 'Microsoft YaHei', sans-serif;
        }
      `,
    });
    await page.waitForSelector('#loaded');
    await new Promise((resolve) => setTimeout(() => resolve(true), 3000));
    const pdfData = await page.pdf({
      format: 'a4',
    });
    await page.close();
    return pdfData;
  }

  async shot(path: string, params: string) {
    const data = [];
    const page = await this.browser.newPage();
    await page.goto(`${path}?${params}`);
    const containerSelector = await page.waitForSelector('#resume');
    await page.waitForSelector('#loaded');
    await page.waitForSelector('svg');
    // await new Promise((resolve) => setTimeout(() => resolve(true), 3000));
    const box = await containerSelector.boundingBox();
    const pageNum = Math.ceil(box.height / this.height);
    const rows = await page.$$('.row, h1, p, li');
    const boxs = await Promise.all(rows.map((row) => row.boundingBox()));
    let computedHeight = 0;
    for (let i = 0; i < pageNum; i++) {
      // 找到跨越当前页高度的元素下标
      const idx = boxs.findIndex((item) => item.y > this.height * (i + 1));

      // 如果分页大于1但是没有超过当前页高度的元素下标，则实际为1页
      if (i === 0 && idx < 0 && pageNum > 1) {
        i = pageNum - 2;
        continue;
      }

      const findPageBoundary = (idx: number, gap = -1) => {
        const box = boxs[idx + gap];
        if (idx + gap < 0) {
          const endBox = boxs[boxs.length - 1];
          return endBox.y - computedHeight + endBox.height;
        }
        if (box.y - computedHeight + box.height > this.height) {
          return findPageBoundary(idx, --gap);
        }
        return box.y - computedHeight;
      };
      const y = i === 0 ? 0 : computedHeight;
      const height = findPageBoundary(idx);
      if (height === 0) {
        continue;
      }
      console.log(idx, height);
      computedHeight += height;
      const imgData = await containerSelector.screenshot({
        encoding: 'base64',
        clip: {
          x: box.x,
          y: y + box.y,
          width: this.width,
          height: height,
          scale: this.scale,
        },
        type: 'jpeg',
      });
      data.push({
        height,
        imgData,
      });
    }
    await page.close();
    return data;
  }

  async savePDF(data: Array<{ imgData: string; height: number }>) {
    const doc = new jsPDF({
      unit: 'pt', // 单位用pt
      format: 'a4',
    });
    let idx = 0;
    for (const d of data) {
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, width, height, 'F');
      doc.addImage(d.imgData, 'jpeg', 0, 0, width, d.height);
      idx++ < data.length - 1 && doc.addPage();
    }
    return doc.output('dataurlstring');
  }
}
