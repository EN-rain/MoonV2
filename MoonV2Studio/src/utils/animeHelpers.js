import anime from 'animejs';

/**
 * Stagger-reveal elements with Anime.js
 * @param {string|Element|NodeList} targets
 * @param {object} overrides
 */
export function staggerReveal(targets, overrides = {}) {
  return anime({
    targets,
    opacity:   [0, 1],
    translateY: [40, 0],
    duration: 700,
    delay: anime.stagger(100),
    easing: 'easeOutExpo',
    ...overrides,
  });
}

/**
 * Letter-by-letter reveal for a heading element
 * @param {Element} el
 */
export function letterReveal(el) {
  if (!el) return;
  const text = el.textContent;
  el.innerHTML = text
    .split('')
    .map((c) => `<span class="char" style="display:inline-block;overflow:hidden">${c === ' ' ? '&nbsp;' : c}</span>`)
    .join('');

  return anime({
    targets: el.querySelectorAll('.char'),
    translateY: ['110%', '0%'],
    opacity: [0, 1],
    duration: 900,
    delay: anime.stagger(35, { easing: 'easeOutQuad' }),
    easing: 'easeOutExpo',
  });
}

/**
 * Animate a number counter
 * @param {Element} el
 * @param {number} to
 * @param {string} suffix
 */
export function countUp(el, to, suffix = '') {
  if (!el) return;
  const obj = { val: 0 };
  return anime({
    targets: obj,
    val: to,
    duration: 1400,
    easing: 'easeOutExpo',
    update: () => { el.textContent = Math.round(obj.val) + suffix; },
  });
}

/**
 * Hover shimmer animation on a link/button
 * @param {Element} el
 */
export function hoverShimmer(el) {
  anime({
    targets: el,
    translateX: ['-100%', '100%'],
    opacity: [0, 0.3, 0],
    duration: 600,
    easing: 'easeInOutSine',
  });
}

/**
 * Ripple effect on a button
 * @param {MouseEvent} e
 */
export function buttonRipple(e) {
  const btn = e.currentTarget;
  const rect = btn.getBoundingClientRect();
  const ripple = document.createElement('span');
  ripple.style.cssText = `
    position:absolute;pointer-events:none;border-radius:50%;
    width:10px;height:10px;background:rgba(255,255,255,0.35);
    left:${e.clientX - rect.left - 5}px;top:${e.clientY - rect.top - 5}px;
    transform:scale(1);opacity:1;
  `;
  btn.style.position = 'relative';
  btn.style.overflow = 'hidden';
  btn.appendChild(ripple);
  anime({
    targets: ripple,
    scale: 18,
    opacity: 0,
    duration: 700,
    easing: 'easeOutExpo',
    complete: () => ripple.remove(),
  });
}
