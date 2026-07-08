import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './About.module.css';

gsap.registerPlugin(ScrollTrigger);

const process = [
  { num: '01', title: 'IDEA',    sub: 'IT ALL STARTS WITH A SPARK.' },
  { num: '02', title: 'CREATE',  sub: 'DESIGN, CODE, PUBLISH.'       },
  { num: '03', title: 'DELIVER', sub: 'GAMES THAT LEAVE A MARK.'     },
];

export default function About({ isActive }) {
  const sectionRef = useRef(null);
  const leftRef    = useRef(null);
  const imgRef     = useRef(null);
  const cardsRef   = useRef([]);

  useLayoutEffect(() => {
    const setHidden = () => {
      gsap.set(leftRef.current.children, { y: 30, opacity: 0, filter: 'blur(10px)' });
      gsap.set(imgRef.current, { clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)' });
      const imgEl = imgRef.current.querySelector('img');
      gsap.set(imgEl, { scale: 1.4 });
      gsap.set(cardsRef.current, { x: 30, opacity: 0, filter: 'blur(15px)' });
    };

    if (!isActive) {
      setHidden();
      return;
    }

    setHidden();
    let introTl;
    let introCall;

    const ctx = gsap.context(() => {
      const imgEl = imgRef.current.querySelector('img');
      const playIntro = () => {
        introTl?.kill();
        introTl = gsap.timeline();

        // Left text stagger reveal with blur
        introTl.to(leftRef.current.children, {
          opacity: 1, y: 0, filter: 'blur(0px)',
          duration: 0.8, ease: 'power3.out',
          stagger: 0.1
        }, 0)
        
        // Image cinematic mask reveal & scale down
        .to(imgRef.current, {
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          duration: 1.2, ease: 'power4.inOut',
        }, 0.1)
        .to(imgEl, {
          scale: 1,
          duration: 1.4, ease: 'power3.out',
        }, 0.1)

        // Process cards stagger blur reveal
        .to(cardsRef.current, {
          opacity: 1, x: 0, filter: 'blur(0px)',
          duration: 0.8, ease: 'power3.out',
          stagger: 0.1
        }, 0.3);
      };

      introCall = gsap.delayedCall(window.navJumpDelay ? 0.06 : 0.1, playIntro);

    }, sectionRef);

    return () => {
      introCall?.kill();
      introTl?.kill();
      ctx.revert();
    };
  }, [isActive]);

  return (
    <section ref={sectionRef} className={styles.about} id="about">
      <div className={styles.sideTag}>
        <span className={styles.tagNum}>02</span>
        <span className={styles.tagLabel}>ABOUT</span>
      </div>

      <div className={styles.inner}>
        {/* Left */}
        <div ref={leftRef} className={styles.left} data-about-content>
          <h2 className="section-title">
            <span className="line white">BUILT BY</span>
            <span className="line white">ONE MIND.</span>
            <span className="line red">FUELED BY</span>
            <span className="line red">STORIES.</span>
          </h2>
          <p className={styles.desc}>
            A SOLO INDIE DEVELOPER CRAFTING ORIGINAL GAMES ACROSS GENRES AND
            PLATFORMS. EVERY GAME, EVERY LINE OF CODE, EVERY DREAM REALIZED.
          </p>
          <p className={styles.descSm}>Just me, a dream, and a moon.</p>
          <p className={styles.signature}>— MOONV2</p>
        </div>

        {/* Center image */}
        <div ref={imgRef} className={styles.imgWrap} data-about-content>
          <img
            src="/images/about_character.png"
            alt="Developer character art"
            className={styles.img}
          />
          <div className={styles.imgOverlay} />
          <div className={styles.imgBorder} />
          <div className={styles.imgAccent} />
          <div className={styles.imgAccentBR} />
        </div>

        {/* Right process cards */}
        <div className={styles.right} data-about-content>
          {process.map(({ num, title, sub }, i) => (
            <div
              key={num}
              ref={(el) => (cardsRef.current[i] = el)}
              className={styles.card}
            >
              <span className={styles.cardNum}>{num}</span>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{title}</h3>
                <p className={styles.cardSub}>{sub}</p>
              </div>
              <span className={styles.cardArrow}>→</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
