import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { buttonRipple } from '../../utils/animeHelpers';
import styles from './Contact.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function Contact({ isActive }) {
  const sectionRef = useRef(null);
  const leftRef    = useRef(null);
  const rightRef   = useRef(null);
  const titleRef   = useRef(null);

  useLayoutEffect(() => {
    const titleLines = titleRef.current?.querySelectorAll('.line');
    const sideTag    = leftRef.current?.querySelector('[class*="sideTag"]');
    const desc       = leftRef.current?.querySelector('p');
    const cta        = leftRef.current?.querySelector('a');
    
    const setHidden = () => {
      if (titleLines) gsap.set(titleLines, { y: '110%', skewY: 6 });
      if (sideTag)    gsap.set(sideTag, { opacity: 0, x: -10 });
      if (desc)       gsap.set(desc, { opacity: 0, y: 20, filter: 'blur(8px)' });
      if (cta)        gsap.set(cta, { opacity: 0, y: 16, filter: 'blur(8px)' });
      gsap.set(rightRef.current, { opacity: 0, x: 50, filter: 'blur(20px)' });
    };

    if (!isActive) {
      setHidden();
      return;
    }

    setHidden();
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: window.navJumpDelay ? 0.06 : 0.1 });

      tl
        .to(sideTag, { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out' }, 0)
        .to(titleLines, {
          y: '0%', skewY: 0,
          duration: 1.0, ease: 'power4.out', stagger: 0.1,
        }, 0.1)
        .to([desc, cta], {
          opacity: 1, y: 0, filter: 'blur(0px)',
          duration: 0.8, ease: 'power3.out', stagger: 0.12,
        }, 0.5)
        .to(rightRef.current, {
          opacity: 1, x: 0, filter: 'blur(0px)',
          duration: 1.1, ease: 'power3.out',
        }, 0.2);

    }, sectionRef);
    return () => ctx.revert();
  }, [isActive]);

  const handleScrollTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <section ref={sectionRef} className={styles.contact} id="contact">
        {/* Left */}
        <div ref={leftRef} className={styles.left}>
          <div className={styles.sideTag}>
            <span className={styles.tagNum}>06</span>
            <span className={styles.tagLabel}>CONTACT</span>
          </div>
          <h2 ref={titleRef} className="section-title">
            <span className="line white">LET'S CREATE</span>
            <span className="line white">SOMETHING</span>
            <span className="line red">UNFORGETTABLE.</span>
          </h2>
          <p className={styles.desc}>
            REACH OUT FOR COLLABS, PUBLISHING, OR JUST TO SAY HI.
          </p>
          <a
            href="mailto:hello@moonv2.studio"
            className="btn-primary"
            id="contact-cta"
            onMouseDown={buttonRipple}
          >
            GET IN TOUCH
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        {/* Right */}
        <div ref={rightRef} className={styles.right}>
          <div className={styles.footerLogo}>
            <span className={styles.logoMoon}>MOON</span>
            <span className={styles.logoV2}>V2</span>
            <span className={styles.logoSub}>STUDIO</span>
          </div>
          <p className={styles.footerTagline}>
            SOLO INDIE GAME DEVELOPER<br />
            CRAFTING GAMES ACROSS<br />
            GENRES AND PLATFORMS.
          </p>
          <img
            src="/images/hero_sphere.png"
            alt="MOONV2 orb decoration"
            className={styles.footerOrb}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <span className={styles.footerCopy}>
          © 2025 MOONV2 STUDIO. ALL RIGHTS RESERVED.
        </span>
        <a
          href="#hero"
          className={styles.backToTop}
          id="back-to-top"
          onClick={handleScrollTop}
        >
          BACK TO TOP ↑
        </a>
      </footer>
    </>
  );
}
