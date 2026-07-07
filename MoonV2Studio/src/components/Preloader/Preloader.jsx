import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import anime from 'animejs';
import styles from './Preloader.module.css';

export default function Preloader({ assets = [], onComplete }) {
  const containerRef = useRef(null);
  const counterRef = useRef(null);
  const barRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let tween;
    // Disable scroll while loading
    document.body.style.overflow = 'hidden';

    const setLoadedProgress = (value) => {
      if (cancelled) return;
      const current = Math.round(value);
      setProgress(current);
      if (barRef.current) barRef.current.style.width = `${current}%`;
    };

    const exit = () => {
      if (cancelled) return;
      gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = '';
          onComplete();
        }
      })
      .to(counterRef.current, {
        scale: 1.5,
        opacity: 0,
        duration: 0.6,
        ease: "power3.in"
      })
      .to(containerRef.current, {
        yPercent: -100,
        duration: 0.8,
        ease: "power4.inOut"
      }, "-=0.2");
    };

    const loadAsset = (src) => new Promise((resolve) => {
      const img = new Image();
      img.onload = resolve;
      img.onerror = resolve;
      img.src = src;
    });

    let loaded = 0;
    const minDelay = new Promise((resolve) => setTimeout(resolve, 700));
    const preload = Promise.all(
      assets.map((src) => loadAsset(src).then(() => {
        loaded += 1;
        setLoadedProgress((loaded / assets.length) * 100);
      }))
    );

    tween = anime({
      targets: { val: 0 },
      val: assets.length ? 85 : 100,
      duration: 700,
      easing: 'easeOutExpo',
      update: (anim) => {
        if (!assets.length) setLoadedProgress(anim.animatables[0].target.val);
      }
    });

    Promise.all([preload, minDelay]).then(() => {
      setLoadedProgress(100);
      exit();
    });

    return () => {
      cancelled = true;
      tween?.pause();
      document.body.style.overflow = '';
    };
  }, [assets, onComplete]);

  return (
    <div ref={containerRef} className={styles.preloader}>
      <div className={styles.noise} />
      <div ref={counterRef} className={styles.counter}>
        {progress}%
      </div>
      <div className={styles.loadingText}>INITIALIZING SYSTEMS</div>
      <div className={styles.progressWrap}>
        <div ref={barRef} className={styles.progressBar} />
      </div>
    </div>
  );
}
