// import gsap from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import { TextPlugin } from 'gsap/TextPlugin';
// import 'particles.js';

// export function initEffects() {
//   if (typeof window === 'undefined') return;

//   // Ativa os plugins do GSAP
//   gsap.registerPlugin(ScrollTrigger, TextPlugin);

//   // Inicializa particles.js
//   if (window.particlesJS) {
//     window.particlesJS('counter-particles', {
//       particles: {
//         number: { value: 80, density: { enable: true, value_area: 800 } },
//         color: { value: '#c9a874' },
//         shape: { type: 'circle' },
//         opacity: { value: 0.1, random: true },
//         size: { value: 5, random: true },
//         line_linked: {
//           enable: true,
//           distance: 150,
//           color: '#c9a874',
//           opacity: 0.05,
//           width: 1,
//         },
//         move: {
//           enable: true,
//           speed: 2,
//           direction: 'none',
//           random: true,
//           straight: false,
//           out_mode: 'out',
//           bounce: false,
//         },
//       },
//       interactivity: {
//         detect_on: 'canvas',
//         events: {
//           onhover: { enable: true, mode: 'grab' },
//           onclick: { enable: true, mode: 'push' },
//           resize: true,
//         },
//       },
//       retina_detect: true,
//     });
//   }

//   // GSAP animations
//   gsap.to('header', {
//     scrollTrigger: {
//       trigger: 'body',
//       start: 'top -50',
//       toggleClass: { className: 'scrolled', targets: 'header' },
//     },
//   });

//   document.querySelectorAll('.reveal-effect').forEach((el) => {
//     gsap.fromTo(
//       el,
//       { y: 50, opacity: 0 },
//       {
//         y: 0,
//         opacity: 1,
//         duration: 1,
//         ease: 'power3.out',
//         scrollTrigger: {
//           trigger: el,
//           start: 'top 85%',
//           toggleActions: 'play none none none',
//         },
//       }
//     );
//   });

//   // Hero animations
//   gsap.from('.hero-subtitle', { opacity: 0, y: 20, duration: 0.8, delay: 0.2 });
//   gsap.from('.hero-title', { opacity: 0, y: 30, duration: 0.8, delay: 0.4 });
//   gsap.from('.hero-description', { opacity: 0, y: 30, duration: 0.8, delay: 0.6 });
//   gsap.from('.hero-buttons', { opacity: 0, y: 30, duration: 0.8, delay: 0.8 });

//   // Contadores
//   document.querySelectorAll('.counter-value').forEach((counter) => {
//     const target = parseInt(counter.textContent || '0');
//     gsap.to(counter, {
//       innerText: target,
//       duration: 2,
//       snap: { innerText: 1 },
//       scrollTrigger: {
//         trigger: '.counter-section',
//         start: 'top 80%',
//       },
//     });
//   });

//   // Menu mobile
//   const navToggle = document.querySelector('.nav-toggle') as HTMLElement | null;
//   const nav = document.querySelector('nav ul') as HTMLElement | null;
//   if (navToggle && nav) {
//     navToggle.addEventListener('click', () => {
//       nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
//       const spans = navToggle.querySelectorAll('span');
//       if (nav.style.display === 'flex') {
//         spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
//         spans[1].style.opacity = '0';
//         spans[2].style.transform = 'rotate(-45deg) translate(7px, -8px)';
//       } else {
//         spans[0].style.transform = 'none';
//         spans[1].style.opacity = '1';
//         spans[2].style.transform = 'none';
//       }
//     });
//   }

//   // Smooth scroll
//   document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
//     anchor.addEventListener('click', function (e) {
//       e.preventDefault();
//       const targetId = (this as HTMLAnchorElement).getAttribute('href');
//       if (!targetId || targetId === '#') return;

//       const targetElement = document.querySelector(targetId);
//       if (targetElement) {
//         window.scrollTo({
//           top: targetElement.getBoundingClientRect().top + window.scrollY - 80,
//           behavior: 'smooth',
//         });

//         if (window.innerWidth < 992 && nav?.style.display === 'flex') {
//           navToggle?.click();
//         }
//       }
//     });
//   });
// }
