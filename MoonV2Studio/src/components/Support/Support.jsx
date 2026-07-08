import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import anime from 'animejs';
import styles from './Support.module.css';

gsap.registerPlugin(ScrollTrigger);

const SOCIALS = [
  {
    id: 'twitter',
    label: 'X / TWITTER',
    href: '#',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    id: 'itchio',
    label: 'ITCH.IO',
    href: '#',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M3.13 1.338C2.08 1.96.02 4.328 0 6.702v1.43c0 1.812.935 3.403 2.367 3.403 1.345 0 2.476-1.16 2.476-2.586 0 1.427 1.095 2.586 2.44 2.586 1.344 0 2.403-1.16 2.403-2.586 0 1.427 1.12 2.586 2.464 2.586h.048c1.344 0 2.464-1.16 2.464-2.586 0 1.427 1.06 2.586 2.404 2.586 1.344 0 2.44-1.16 2.44-2.586 0 1.427 1.13 2.586 2.475 2.586C22.065 11.535 23 9.944 23 8.132V6.702c-.02-2.374-2.082-4.74-3.13-5.365C17.89.55 13.99.09 11.75.06 9.51.03 5.19.548 3.13 1.338zm8.28 9.789c-.48-.01-.94-.113-1.37-.3-.43.187-.9.29-1.38.3-1.21-.02-2.27-.75-2.83-1.83-.56 1.08-1.62 1.81-2.83 1.83h-.1v6.817c0 .602 2.272 2.223 9.35 2.223s9.35-1.62 9.35-2.223V11.13h-.1c-1.21-.02-2.27-.75-2.83-1.83-.56 1.08-1.62 1.81-2.83 1.83z"/>
      </svg>
    ),
  },
  {
    id: 'discord',
    label: 'DISCORD',
    href: '#',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
      </svg>
    ),
  },
  {
    id: 'youtube',
    label: 'YOUTUBE',
    href: '#',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
  {
    id: 'patreon',
    label: 'PATREON',
    href: '#',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.957 7.21c-.004-3.064-2.391-5.576-5.445-5.996-3.877-.536-7.887-.501-11.75.093C3.775 1.769 2.05 3.513 1.05 5.48c-.898 1.783-1.05 3.745-1.05 5.718 0 3.779.701 10.75 5.765 10.784 3.598.025 4.199-4.098 5.815-6.103 1.061-1.33 2.44-1.712 4.128-2.084 2.927-.638 7.255-1.053 7.249-6.585z"/>
      </svg>
    ),
  },
  {
    id: 'kofi',
    label: 'KO-FI',
    href: '#',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.881 8.948c-.773-4.085-4.859-4.593-4.859-4.593H.723c-.604 0-.679.798-.679.798s-.082 7.324-.022 11.822c.164 2.424 2.586 2.672 2.586 2.672s8.267-.023 11.966-.049c2.438-.426 2.683-2.349 2.658-3.226-.025-.61.772-.836 1.327-.836l.66.005c1.786.001 3.02-1.56 3.02-1.56.844-.797.893-1.954.64-3.033zm-3.776 2.915c-.232.469-.742.841-1.268.976l-.469.112c-.469.116-.737-.162-.737-.162V9.028a.532.532 0 0 1 .573-.557c.447-.007.896-.007 1.119.022.68.111 1.163.571 1.163 1.33 0 .495-.151.872-.381 1.04z"/>
      </svg>
    ),
  },
];

export default function Support({ isActive }) {
  const sectionRef  = useRef(null);
  const progressRef = useRef(null);
  const leftRef     = useRef(null);
  const connectLinksRef = useRef([]);

  useLayoutEffect(() => {
    const titleLines = leftRef.current.querySelectorAll('.line');
    const siblings   = [...leftRef.current.children].filter(el => !el.classList.contains('section-title'));
    const centerOrb  = sectionRef.current.querySelector('[class*="center"]');
    const links      = connectLinksRef.current;

    const setHidden = () => {
      gsap.set(titleLines, { y: '110%', skewY: 6 });
      gsap.set(siblings, { opacity: 0, y: 20, filter: 'blur(8px)' });
      if (centerOrb) gsap.set(centerOrb, { opacity: 0, scale: 0.85, filter: 'blur(20px)' });
      gsap.set(links, { opacity: 0, x: 20, filter: 'blur(10px)' });
    };

    if (!isActive) {
      setHidden();
      return;
    }

    setHidden();
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: window.navJumpDelay ? 0.06 : 0.1 });

      tl.to(titleLines, {
        y: '0%', skewY: 0,
        duration: 1.0, ease: 'power4.out', stagger: 0.09,
      }, 0)
      .to(siblings, {
        opacity: 1, y: 0, filter: 'blur(0px)',
        duration: 0.8, ease: 'power3.out', stagger: 0.1,
      }, 0.3)
      .to(centerOrb, {
        opacity: 1, scale: 1, filter: 'blur(0px)',
        duration: 1.2, ease: 'power3.out',
      }, 0.2)
      .to(links, {
        opacity: 1, x: 0, filter: 'blur(0px)',
        duration: 0.6, ease: 'power3.out', stagger: 0.06,
      }, 0.4);

      // Progress bar fill
      gsap.delayedCall(0.8, () => {
        anime({
          targets: progressRef.current,
          width: '62%',
          duration: 1600,
          easing: 'easeOutExpo',
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [isActive]);

  const handleLinkHover = (el) => {
    anime({
      targets: el.querySelector(`.${styles.connectIcon}`),
      translateX: [0, 3, 0],
      duration: 400,
      easing: 'easeOutElastic(1, 0.5)',
    });
  };

  return (
    <section ref={sectionRef} className={styles.support} id="support">
      <div className={styles.sideTag}>
        <span className={styles.tagNum}>05</span>
        <span className={styles.tagLabel}>SUPPORT</span>
      </div>

      <div className={styles.inner}>
        {/* Left */}
        <div ref={leftRef}>
          <h2 className="section-title">
            <span className="line white">THANK YOU</span>
            <span className="line white">FOR BEING PART</span>
            <span className="line white">OF THE JOURNEY.</span>
          </h2>
          <p className={styles.italic}>Let's build worlds together.</p>
          <p className={styles.desc}>
            YOUR SUPPORT KEEPS THE MOON GLOWING AND THE DREAM ALIVE.
          </p>
          <div className={styles.progressBlock}>
            <div className={styles.progressLabels}>
              <span>0%</span><span>50%</span><span>100%</span>
            </div>
            <div className={styles.progressTrack}>
              <div ref={progressRef} className={styles.progressFill} />
            </div>
          </div>
        </div>

        {/* Center orb */}
        <div className={styles.center}>
          <div className={styles.orb}>
            <img src="/images/hero_sphere.png" alt="Support orb" className={styles.orbImg} />
            <div className={styles.orbGlow} />
          </div>
        </div>

        {/* Right connect panel */}
        <div className={styles.connectPanel}>
          <h3 className={styles.connectTitle}>CONNECT</h3>
          <div className={styles.connectLinks}>
            {SOCIALS.map(({ id, label, href, icon }, i) => (
              <a
                key={id}
                ref={(el) => (connectLinksRef.current[i] = el)}
                href={href}
                id={`social-${id}`}
                className={styles.connectLink}
                onMouseEnter={(e) => handleLinkHover(e.currentTarget)}
                aria-label={label}
              >
                <span className={styles.connectIcon}>{icon}</span>
                <span>{label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
