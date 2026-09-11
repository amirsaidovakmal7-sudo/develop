import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let registered = false;

/** Registers ScrollTrigger once — call at the top of any component that uses it. */
export function ensureGsapReady() {
  if (registered) return;
  registered = true;
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
