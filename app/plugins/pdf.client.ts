import * as pdfLib from 'pdfjs-dist';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('pdf', async (url: string) => {
    pdfLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.5.141/pdf.worker.min.js';
    const loadingTask = pdfLib.getDocument(url);
    const pdf = await loadingTask.promise;
    const scale = 1;
    const outputScale = window.devicePixelRatio || 1;
    const canvas = document.querySelector('.preview-box') as HTMLCanvasElement;
    canvas.innerHTML = '';
    for (let num = 1 ; num <= pdf.numPages ; num ++) {
      const page = await pdf.getPage(num);
      const viewport = page.getViewport({ scale });
      const childCanvas = document.createElement('canvas');
      const width = Math.floor(viewport.width);
      const height = Math.floor(viewport.height);
      childCanvas.style.width = width + 'px';
      childCanvas.style.height = height + 'px';
      childCanvas.width = width;
      childCanvas.height = height;
      const context = childCanvas.getContext('2d') as CanvasRenderingContext2D;
      const transform =
      outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : undefined;

      const renderContext = {
        canvasContext: context,
        transform,
        viewport,
      };
      page.render(renderContext);
      canvas.appendChild(childCanvas);
    }
  });
});
