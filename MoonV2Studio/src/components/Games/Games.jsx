import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import styles from './Games.module.css';

const GAMES = [
  { id: 'emberfall',  img: '/images/game_emberfall.png',  title: 'CINDER',  genre: 'DARK FANTASY · ACTION RPG',    year: '2024', status: 'IN DEVELOPMENT' },
  { id: 'aeondrive',  img: '/images/game_aeondrive.png',  title: 'OVERRIDE', genre: 'CYBERPUNK · PLATFORMER',        year: '2025', status: 'PROTOTYPE'      },
  { id: 'lunaris',    img: '/images/game_lunaris.png',    title: 'SOMNIUM',    genre: 'ADVENTURE · PUZZLE',            year: '2025', status: 'ALPHA'          },
  { id: 'fracture',   img: '/images/game_fracture.png',   title: 'BREACH',   genre: 'TACTICAL · STRATEGY',           year: '2026', status: 'CONCEPT'        }
];

export default function Games({ isActive, suppressIntro = false }) {
  const sectionRef    = useRef(null);
  const headerRef     = useRef(null);
  const bgRef         = useRef(null);
  const bgImgRefs     = useRef([]);
  const listRef       = useRef(null);
  const itemRefs      = useRef([]);
  const infoRef       = useRef(null);
  const managedIntroRef = useRef(false);
  const [activeIdx, setActiveIdx] = useState(0);

  /* ── GSAP entrance ── */
  useLayoutEffect(() => {
    const titleLines = headerRef.current.querySelectorAll('.line');
    const items      = itemRefs.current;

    const setHidden = () => {
      gsap.set(titleLines, { y: '110%', skewY: 6 });
      gsap.set(bgRef.current, { opacity: 0, scale: 1.05 });
      gsap.set(items, { opacity: 0, x: 40 });
      gsap.set(infoRef.current, { opacity: 0, y: 16 });
    };
    const setContentShown = () => {
      gsap.set(titleLines, { y: '0%', skewY: 0 });
      gsap.set(items, { opacity: 1, x: 0 });
      gsap.set(infoRef.current, { opacity: 1, y: 0 });
    };

    if (!isActive) {
      managedIntroRef.current = false;
      setHidden();
      return;
    }

    if (suppressIntro) {
      managedIntroRef.current = true;
      gsap.set(bgRef.current, { opacity: 0, scale: 1 });
      gsap.set(headerRef.current, { opacity: 0, x: 120, filter: 'blur(10px)' });
      gsap.set(listRef.current, { opacity: 0, x: 120, filter: 'blur(10px)' });
      setContentShown();
      return;
    }

    if (managedIntroRef.current) {
      managedIntroRef.current = false;
      setContentShown();
      gsap.set(bgRef.current, { opacity: 1, scale: 1 });
      gsap.set([headerRef.current, listRef.current], { opacity: 1, x: 0, filter: 'none' });
      return;
    }

    setHidden();
    const ctx = gsap.context(() => {
      const baseDelay = window.navJumpDelay ? 0.06 : 0.2;
      const tl = gsap.timeline({ delay: baseDelay });
      tl.to(bgRef.current, { opacity: 1, scale: 1, duration: 1.4, ease: 'power3.out' }, 0)
        .to(titleLines, { y: '0%', skewY: 0, duration: 1.0, ease: 'power4.out', stagger: 0.1 }, 0.2)
        .to(items, { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out', stagger: 0.08 }, 0.4)
        .to(infoRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0.7);
    }, sectionRef);
    return () => ctx.revert();
  }, [isActive, suppressIntro]);

  /* ── Switch game ── */
  const switchGame = (i) => {
    if (i === activeIdx) return;

    // Wipe out old bg, wipe in new
    const oldBg = bgImgRefs.current[activeIdx];
    const newBg = bgImgRefs.current[i];
    if (oldBg && newBg) {
      gsap.to(oldBg, { opacity: 0, scale: 1.04, duration: 0.5, ease: 'power2.inOut' });
      gsap.fromTo(newBg,
        { opacity: 0, scale: 1.06, clipPath: 'inset(0 100% 0 0)' },
        { opacity: 1, scale: 1,    clipPath: 'inset(0 0% 0 0)', duration: 0.7, ease: 'power3.inOut' }
      );
    }
    // Flash info
    gsap.fromTo(infoRef.current, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });

    setActiveIdx(i);
  };

  const active = GAMES[activeIdx];

  return (
    <section ref={sectionRef} className={styles.games} id="games">

      {/* Full-bleed bg stack */}
      <div ref={bgRef} className={styles.bgStack} data-games-bg>
        {GAMES.map(({ id, img }, i) => (
          <div
            key={id}
            ref={(el) => (bgImgRefs.current[i] = el)}
            className={styles.bgSlide}
            style={{ opacity: i === 0 ? 1 : 0, clipPath: i === 0 ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)' }}
          >
            {img
              ? <img src={img} alt={id} className={styles.bgImg} />
              : <div className={styles.bgPlaceholder}><span>{GAMES[i].title}</span></div>
            }
          </div>
        ))}
        {/* Gradient vignette over bg */}
        <div className={styles.bgVignette} />
      </div>

      {/* Left — section label + big title */}
      <div ref={headerRef} className={styles.labelCol} data-games-content>
        <div className={styles.sideTag}>
          <span className={styles.tagNum}>03</span>
          <span className={styles.tagBar} />
          <span className={styles.tagLabel}>GAMES</span>
        </div>
        <h2 className={`section-title ${styles.bigTitle}`}>
          <span className="line white">WORLDS</span>
          <span className="line red">IN PROGRESS</span>
        </h2>
        {/* Active game info */}
        <div ref={infoRef} className={styles.activeInfo}>
          <span className={styles.activeGenre}>{active.genre}</span>
          <span className={styles.activeStatus} data-status={active.status}>{active.status}</span>
          <span className={styles.activeYear}>{active.year}</span>
        </div>
      </div>

      {/* Right — numbered selector list */}
      <nav ref={listRef} className={styles.selector} data-games-content>
        {GAMES.map(({ id, title }, i) => (
          <button
            key={id}
            ref={(el) => (itemRefs.current[i] = el)}
            className={`${styles.selectorItem} ${activeIdx === i ? styles.selectorActive : ''}`}
            onMouseEnter={() => switchGame(i)}
            onClick={() => switchGame(i)}
          >
            <span className={styles.selectorNum}>{String(i + 1).padStart(2, '0')}</span>
            <span className={styles.selectorDash} />
            <span className={styles.selectorTitle}>{title}</span>
          </button>
        ))}
      </nav>

    </section>
  );
}
