import gsap from 'gsap';
import scrollTrigger from 'gsap/scrollTrigger';

export default defineNuxtPlugin(nuxtApp => {
  gsap.registerPlugin(scrollTrigger);
  nuxtApp.provide('indexScroll', () => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.index',
        pin: true, // pin the trigger element while active
        start: '0', // when the top of the trigger hits the top of the viewport
        // end: '+=3000', // end after scrolling 500px beyond the start
        end: '3800',
        scrub: 1, // smooth scrubbing, takes 1 second to "catch up" to the scrollbar
      },
    });
    tl.addLabel('start')
      .to('.btns', { opacity: 0, y: -50 })
      .to('.content', { top: 80 })
      .to('.title-box', { opacity: 0, y: 10 })
      .addLabel('top')
      .to('.cover', { y: -150 })
      .addLabel('right')
      .to('.cover', { x: 300 })
      .to('.intro-title', { x: -260, opacity: 1 })
      .addLabel('example')
      .to('.intro', { top: 100 })
      .to('.content', {
        top: -350,
        background: `linear-gradient(
          -135deg,
          rgb(185, 239, 248),
          rgb(194, 190, 251),
          rgb(247, 234, 185)
        )`,
      })
      .to('.example', { top: 500, opacity: 1 })
      .addLabel('example-list')
      .to('.list', { x: '-50%' })
      .addLabel('end');
  });
});