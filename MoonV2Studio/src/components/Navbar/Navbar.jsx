import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Navbar.module.css';

gsap.registerPlugin(ScrollTrigger);

const links = [
  { id: 0, label: 'HERO' },
  { id: 1, label: 'ABOUT' },
  { id: 2, label: 'GAMES' },
  { id: 3, label: 'DEVLOG' },
  { id: 4, label: 'SUPPORT' },
  { id: 5, label: 'CONTACT' },
];

const CHAPTER_SCROLL = window.innerHeight * 1.5;

const BladeLinks = () => (
  <div className={styles.bladeInner}>
    {links.map((link) => (
      <div key={link.id} className={styles.bladeLinkWrap}>
        <span className={styles.bladeLinkNum}>0{link.id + 1}</span>
        <span className={styles.bladeBigLink}>{link.label}</span>
      </div>
    ))}
  </div>
);

// Content rendered inside each blade — static, always fully visible
// We pass refs so we can synchronously force hover styles without React render delays
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const overlayRef  = useRef(null);
  const overlayBgRef = useRef(null);
  const overlayInnerRef = useRef(null);
  const linksRef    = useRef([]);
  const numsRef     = useRef([]);
  const btnRef      = useRef(null);
  const logoV2Ref   = useRef(null);
  const slashRef    = useRef(null);
  const topBladeRef = useRef(null);
  const botBladeRef = useRef(null);
  const isClosing   = useRef(false);

  // Park blades off-screen on mount via GSAP
  useEffect(() => {
    gsap.set(slashRef.current, { autoAlpha: 0, visibility: 'hidden' });
    gsap.set(topBladeRef.current, { yPercent: 0 });
    gsap.set(botBladeRef.current, { yPercent: 0 });
  }, []);

  const getBtnOrigin = () => {
    const rect = btnRef.current?.getBoundingClientRect();
    if (!rect) return { cx: '96%', cy: '4%' };
    return {
      cx: `${rect.left + rect.width / 2}px`,
      cy: `${rect.top + rect.height / 2}px`,
    };
  };

  const getLogoHitDelay = () => {
    const btnRect = btnRef.current?.getBoundingClientRect();
    const logoRect = logoV2Ref.current?.getBoundingClientRect();
    if (!btnRect || !logoRect) return 0.35;

    const originX = btnRect.left + btnRect.width / 2;
    const originY = btnRect.top + btnRect.height / 2;
    const logoX = logoRect.left + logoRect.width / 2;
    const logoY = logoRect.top + logoRect.height / 2;
    const distance = Math.hypot(logoX - originX, logoY - originY);
    const finalRadius = (Math.hypot(window.innerWidth, window.innerHeight) / Math.SQRT2) * 1.6;

    return Math.min(Math.max(distance / finalRadius, 0.1), 0.9);
  };

  useEffect(() => {
    if (!overlayRef.current) return;
    const { cx, cy } = getBtnOrigin();

    if (menuOpen) {
      isClosing.current = false;
      gsap.killTweensOf(logoV2Ref.current);
      gsap.set(logoV2Ref.current, { color: '#aa3bff' });
      gsap.set(overlayRef.current, { autoAlpha: 1 });
      gsap.set(overlayBgRef.current, { autoAlpha: 1 });
      gsap.set(overlayInnerRef.current, { autoAlpha: 1 });
      
      // Park blades off-screen
      gsap.set(slashRef.current, { autoAlpha: 0, visibility: 'hidden' });
      gsap.set(topBladeRef.current, { yPercent: 0 });
      gsap.set(botBladeRef.current, { yPercent: 0 });

      // Circle grows from button
      gsap.fromTo(overlayRef.current,
        { clipPath: `circle(0% at ${cx} ${cy})` },
        { clipPath: `circle(160% at ${cx} ${cy})`, duration: 1.0, ease: 'power4.inOut' }
      );
      gsap.to(logoV2Ref.current, {
        color: '#000000',
        duration: 0.12,
        delay: getLogoHitDelay(),
        ease: 'none',
      });
      // Interactive links stagger in
      gsap.fromTo(linksRef.current,
        { y: 80, opacity: 0, skewY: 8 },
        { y: 0, opacity: 1, skewY: 0, duration: 0.7, stagger: 0.07, ease: 'power3.out', delay: 0.45 }
      );
      gsap.fromTo(numsRef.current,
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, stagger: 0.07, ease: 'power3.out', delay: 0.5 }
      );
    }
  }, [menuOpen]);

  // X button: normal circle shrink
  const circleClose = () => {
    if (isClosing.current) return;
    isClosing.current = true;
    const { cx, cy } = getBtnOrigin();
    gsap.killTweensOf(logoV2Ref.current);
    gsap.to(logoV2Ref.current, { color: '#aa3bff', duration: 0.12, ease: 'none' });
    gsap.to(overlayBgRef.current, { autoAlpha: 1, duration: 0.1, ease: 'none' });
    gsap.to([...linksRef.current, ...numsRef.current], { opacity: 0, duration: 0.15 });
    gsap.to(overlayRef.current, {
      clipPath: `circle(0% at ${cx} ${cy})`,
      duration: 0.7,
      ease: 'power3.inOut',
      onComplete: () => setMenuOpen(false),
    });
  };

  // Nav link: diagonal slash
  const slashClose = (index, callback) => {
    if (isClosing.current) return;
    isClosing.current = true;

    const { cx, cy } = getBtnOrigin();
    gsap.killTweensOf([slashRef.current, topBladeRef.current, botBladeRef.current, overlayRef.current, overlayBgRef.current, overlayInnerRef.current, logoV2Ref.current]);

    const tl = gsap.timeline({
      defaults: { ease: 'power3.inOut' },
      onComplete: () => {
        gsap.set(logoV2Ref.current, { color: '#aa3bff' });
        gsap.set(slashRef.current, { autoAlpha: 0, visibility: 'hidden' });
        gsap.set(topBladeRef.current, { yPercent: 0 });
        gsap.set(botBladeRef.current, { yPercent: 0 });
        gsap.set(overlayBgRef.current, { autoAlpha: 1 });
        gsap.set(overlayInnerRef.current, { autoAlpha: 1 });
        gsap.set(overlayRef.current, { autoAlpha: 1, clipPath: `circle(0% at ${cx} ${cy})` });
        window.dispatchEvent(new CustomEvent('moonv2:nav-transition-complete', { detail: { index } }));
        setMenuOpen(false);
        callback?.();
      },
    });

    tl
      .set(slashRef.current, { autoAlpha: 1, visibility: 'visible' })
      .set(topBladeRef.current, { yPercent: 0 })
      .set(botBladeRef.current, { yPercent: 0 })
      .set(overlayInnerRef.current, { autoAlpha: 0 }, 0)
      .to(overlayBgRef.current, { autoAlpha: 0, duration: 0.08, ease: 'none' }, 0.02)
      .call(() => {
        if (index !== undefined && index !== null) {
          window.navJumpDelay = true;
          window.scrollTo({ top: index * CHAPTER_SCROLL, behavior: 'auto' });
          ScrollTrigger.update();
          setTimeout(() => { window.navJumpDelay = false; }, 1200);
        }
      }, null, 0.08)
      .to(logoV2Ref.current, { color: '#aa3bff', duration: 0.12, ease: 'none' }, 0.1)
      .to(topBladeRef.current, { yPercent: -100, duration: 0.85 }, 0.16)
      .to(botBladeRef.current, { yPercent: 100, duration: 0.85 }, 0.16);
  };

  const jumpTo = (index) => {
    slashClose(index);
  };

  const handleToggle = () => {
    if (menuOpen) circleClose();
    else setMenuOpen(true);
  };

  return (
    <>
      <div className={styles.cornerLogo}>
        <span className={styles.logoMoon}>MOON</span>
        <span ref={logoV2Ref} className={styles.logoV2}>V2</span>
        <span className={styles.logoSub}>STUDIO</span>
      </div>

      <button
        ref={btnRef}
        className={`${styles.menuBtn} ${menuOpen ? styles.open : ''}`}
        onClick={handleToggle}
        aria-label="Toggle Menu"
      >
        <div className={styles.burger}>
          <span /><span />
        </div>
      </button>

      {/* Main interactive overlay */}
      <div ref={overlayRef} className={styles.overlay}>
        <div ref={overlayBgRef} className={styles.overlayBg} />
        <div ref={overlayInnerRef} className={styles.overlayInner}>
          {links.map((link, i) => (
            <div key={link.id} className={styles.linkWrap}>
              <span ref={el => numsRef.current[i] = el} className={styles.linkNum}>
                0{link.id + 1}
              </span>
              <button
                ref={el => linksRef.current[i] = el}
                onClick={() => jumpTo(link.id)}
                className={styles.bigLink}
              >
                {link.label}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div ref={slashRef} className={styles.slashTransition} aria-hidden="true">
        <div ref={topBladeRef} className={styles.topBlade}>
          <BladeLinks />
        </div>
        <div ref={botBladeRef} className={styles.botBlade}>
          <BladeLinks />
        </div>
      </div>
    </>
  );
}
