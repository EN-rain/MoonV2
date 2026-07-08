import { useLayoutEffect, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Canvas } from '@react-three/fiber';
import BoidsCanvas from './BoidsCanvas';
import HeroSphere from './HeroSphere';
import styles from './Hero.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function Hero({ isActive }) {
  const heroRef    = useRef(null);
  const sphereWrapRef = useRef(null);
  const tagRef    = useRef(null);
  const subRef    = useRef(null);
  const scrollRef = useRef(null);
  const badgeRef  = useRef(null);
  const words     = useRef([]);
  
  // Shared interactive state
  const mouseX = useRef(typeof window !== 'undefined' ? window.innerWidth / 2 : 0);
  const mouseY = useRef(typeof window !== 'undefined' ? window.innerHeight / 2 : 0);
  const isClicked = useRef(false);

  /* ── GSAP entrance timeline ── */
  useLayoutEffect(() => {
    const setHidden = () => {
      gsap.set(tagRef.current, { opacity: 0, x: -10 });
      gsap.set(words.current, { y: '110%', skewY: 8, opacity: 0 });
      gsap.set(subRef.current, { opacity: 0, y: 16, filter: 'blur(8px)' });
    };

    if (!isActive) {
      setHidden();
      return;
    }

    // Force hidden state before animating (vital for first render)
    setHidden();
    
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: window.navJumpDelay ? 0.06 : 0.2 });

    // Tag fade up
    tl.to(tagRef.current, { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out' }, 0);

    // Rolling mask reveal for each word with skew
    words.current.forEach((w, i) => {
      if (w) tl.fromTo(w,
        { y: '110%', skewY: 8, opacity: 0 },
        { y: '0%',   skewY: 0,  opacity: 1, duration: 1.1, ease: 'power4.out' },
        0.15 + i * 0.12
      );
    });

    // Subtitle blur-in
    tl.fromTo(subRef.current,
      { opacity: 0, y: 16, filter: 'blur(8px)' },
      { opacity: 1, y: 0,  filter: 'blur(0px)', duration: 0.9, ease: 'power3.out' },
      0.7
    );

    // Sphere orb fade-in
    tl.to(sphereWrapRef.current,
      { opacity: 1, duration: 1.8, ease: 'power2.out' },
      0.4
    );

    });
    return () => ctx.revert();
  }, [isActive]);

  /* ── Sphere parallax on scroll ── */
  useEffect(() => {
    // Removed heavy downward parallax based on user feedback
  }, []);
  
  /* ── Mouse events for WebGL/Canvas ── */
  useEffect(() => {
    const onMouseMove = (e) => {
      mouseX.current = e.clientX;
      mouseY.current = e.clientY;
    };
    const onMouseDown = () => (isClicked.current = true);
    const onMouseUp = () => (isClicked.current = false);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  const titleLines = [
    { text: 'ONE MOON.',      cls: styles.white },
    { text: 'ONE DEVELOPER.', cls: styles.white },
    { text: 'MANY WORLDS.',   cls: styles.red   },
  ];

  return (
    <section ref={heroRef} className={`${styles.hero} hero-section`} id="hero">
      <div ref={tagRef} className={styles.sideTag} style={{ opacity: 0 }}>
        <span className={styles.tagNum}>01</span>
        <span className={styles.tagLabel}>HERO</span>
      </div>

      {/* Background */}
      <div className={styles.bg}>
        <div ref={sphereWrapRef} className={styles.orbContainer} style={{ opacity: 0 }}>
          {/* React Three Fiber Canvas replacing static image */}
          <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
            <HeroSphere mouseX={mouseX} mouseY={mouseY} />
          </Canvas>
          <div className={styles.orbGlow} />
        </div>
        
        {/* Boids Canvas replacing old static canvas */}
        <div className={styles.canvasWrap}>
          <BoidsCanvas mouseX={mouseX} mouseY={mouseY} isClicked={isClicked} />
        </div>
        
        <div className={styles.scanlines} />
        <div className={styles.fade} />
      </div>

      {/* Content */}
      <div className={styles.content}>
        <h1 className={styles.title}>
          {titleLines.map(({ text, cls }, i) => (
            <span key={i} className={styles.titleLine}>
              <span
                className={`${styles.titleWord} ${cls}`}
                ref={(el) => (words.current[i] = el)}
                style={{ transform: 'translateY(110%)' }}
              >
                {text}
              </span>
            </span>
          ))}
        </h1>

        <p
          ref={subRef}
          className={styles.sub}
          style={{ opacity: 0, transform: 'translateY(16px)' }}
        >
          INDIE GAMES FOR PC, CONSOLE &amp; MOBILE
        </p>
      </div>
    </section>
  );
}
