import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './Preloader.module.css';

export default function Preloader({ assets = [], onComplete }) {
  const containerRef = useRef(null);
  const numRef       = useRef(null);
  const barRef       = useRef(null);
  const fillRef      = useRef(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    let cancelled = false;
    let currentNum = 0;

    // Write directly to DOM — zero React re-renders
    const setDisplay = (value) => {
      if (cancelled) return;
      const v = Math.min(100, Math.round(value));
      if (numRef.current)  numRef.current.textContent  = v;
      if (fillRef.current) fillRef.current.style.transform = `scaleX(${v / 100})`;
    };

    const exit = () => {
      if (cancelled) return;
      // Make sure counter shows 100 before leaving
      setDisplay(100);

      const tl = gsap.timeline({
        onComplete: () => {
          if (!cancelled) {
            document.body.style.overflow = '';
            onComplete();
          }
        }
      });

      // Slam bar to full, then slide everything out upward
      tl
        .to(fillRef.current, {
          scaleX: 1,
          duration: 0.25,
          ease: 'power2.out'
        })
        .to([numRef.current?.parentElement, barRef.current], {
          opacity: 0,
          y: -12,
          duration: 0.35,
          ease: 'power2.in',
          stagger: 0.06,
        }, '+=0.12')
        .to(containerRef.current, {
          yPercent: -100,
          duration: 0.7,
          ease: 'expo.inOut',
        }, '-=0.1');
    };

    const loadAsset = (src) => new Promise((resolve) => {
      const img = new Image();
      img.onload = resolve;
      img.onerror = resolve;
      img.src = src;
    });

    // Animate count smoothly with gsap — no React state involved
    const countProxy = { val: 0 };
    const countTween = gsap.to(countProxy, {
      val: 85,
      duration: 0.9,
      ease: 'power2.out',
      onUpdate: () => setDisplay(countProxy.val),
    });

    let loaded = 0;
    const minDelay = new Promise((r) => setTimeout(r, 700));
    const preload  = assets.length
      ? Promise.all(assets.map((src) =>
          loadAsset(src).then(() => {
            loaded++;
            const natural = (loaded / assets.length) * 100;
            // Only advance if natural > current animated value
            if (natural > countProxy.val) {
              gsap.to(countProxy, {
                val: natural,
                duration: 0.4,
                ease: 'power2.out',
                overwrite: true,
                onUpdate: () => setDisplay(countProxy.val),
              });
            }
          })
        ))
      : Promise.resolve();

    Promise.all([preload, minDelay]).then(() => {
      countTween.kill();
      // Smoothly finish to 100
      gsap.to(countProxy, {
        val: 100,
        duration: 0.3,
        ease: 'power2.out',
        onUpdate: () => setDisplay(countProxy.val),
        onComplete: exit,
      });
    });

    // Entrance: fade in
    gsap.fromTo(containerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: 'power2.out' }
    );

    return () => {
      cancelled = true;
      countTween.kill();
      document.body.style.overflow = '';
    };
  }, [assets, onComplete]);

  return (
    <div ref={containerRef} className={styles.preloader}>
      <div className={styles.noise} />

      <div className={styles.counterWrap}>
        <span ref={numRef} className={styles.counter}>0</span>
        <span className={styles.pct}>%</span>
      </div>

      <div className={styles.loadingText}>INITIALIZING SYSTEMS</div>

      <div ref={barRef} className={styles.progressWrap}>
        <div ref={fillRef} className={styles.progressBar} />
      </div>
    </div>
  );
}
