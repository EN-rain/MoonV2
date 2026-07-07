import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import styles from './Devlog.module.css';

const POSTS = [
  {
    id: 'overhaul',
    img: '/images/game_emberfall.png',
    date: 'MAY 20',
    year: '2025',
    title: 'SYSTEM OVERHAUL',
    excerpt: 'Refactored core systems for better performance and flexibility across all active projects.',
    tag: 'ENGINEERING',
    num: '01',
  },
  {
    id: 'combat',
    img: '/images/game_aeondrive.png',
    date: 'MAY 10',
    year: '2025',
    title: 'NEW COMBAT TEST',
    excerpt: 'Testing new enemy AI behaviours, combat flow and hit-feel dynamics in the field.',
    tag: 'GAMEPLAY',
    num: '02',
  },
  {
    id: 'blockout',
    img: '/images/game_lunaris.png',
    date: 'MAY 03',
    year: '2025',
    title: 'ENV. BLOCKOUT',
    excerpt: 'Early layout passes for world building in Project Lunaris open environments.',
    tag: 'LEVEL DESIGN',
    num: '03',
  },
  {
    id: 'tooling',
    img: '/images/game_fracture.png',
    date: 'APR 28',
    year: '2025',
    title: 'TOOLING & PIPELINE',
    excerpt: 'Improving workflows with better tooling and fully automated build pipelines.',
    tag: 'DEVOPS',
    num: '04',
  },
];

export default function Devlog({ isActive }) {
  const sectionRef = useRef(null);
  const tagRef     = useRef(null);
  const sliceRefs  = useRef([]);
  const [hovered, setHovered] = useState(0);
  const setActivePost = useCallback((index) => {
    setHovered((current) => (current === index ? current : index));
  }, []);

  /* ── GSAP entrance ── */
  useLayoutEffect(() => {
    const slices = sliceRefs.current.filter(Boolean);

    const setHidden = () => {
      gsap.set(tagRef.current, { opacity: 0, x: -10 });
      gsap.set(slices, { opacity: 0, y: 40 });
    };

    if (!isActive) { setHidden(); return; }

    setHidden();
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.15 });
      tl.to(tagRef.current, { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out' }, 0)
        .to(slices, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.1 }, 0.2);
    }, sectionRef);
    return () => ctx.revert();
  }, [isActive]);

  return (
    <section ref={sectionRef} className={styles.devlog} id="work">

      {/* Standard side tag */}
      <div ref={tagRef} className={styles.sideTag} style={{ opacity: 0 }}>
        <span className={styles.tagNum}>04</span>
        <span className={styles.tagLabel}>DEVLOG</span>
      </div>

      {/* Horizontal accordion */}
      <div className={styles.accordion}>
        {POSTS.map(({ id, img, date, year, title, excerpt, tag, num }, i) => {
          const active = hovered === i;
          return (
            <div
              key={id}
              ref={(el) => (sliceRefs.current[i] = el)}
              className={`${styles.slice} ${active ? styles.sliceActive : ''}`}
              onMouseEnter={() => setActivePost(i)}
              onClick={() => setActivePost(i)}
            >
              {/* Full-bleed image */}
              {img && (
                <img
                  src={img}
                  alt={title}
                  className={styles.sliceImg}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                />
              )}
              <div className={styles.sliceOverlay} />

              {/* Collapsed state — vertical text */}
              <div className={styles.sliceCollapsed}>
                <span className={styles.sliceNum}>{num}</span>
                <span className={styles.sliceVertTitle}>{title}</span>
                <span className={styles.sliceVertDate}>{date}</span>
              </div>

              {/* Expanded content */}
              <div className={styles.sliceExpanded}>
                <div className={styles.sliceTop}>
                  <span className={styles.sliceTag}>{tag}</span>
                  <span className={styles.sliceTagNum}>{num}</span>
                </div>
                <div className={styles.sliceBottom}>
                  <div className={styles.sliceMeta}>
                    <span className={styles.sliceDate}>{date}</span>
                    <span className={styles.sliceYear}>{year}</span>
                  </div>
                  <h3 className={styles.sliceTitle}>{title}</h3>
                  <p className={styles.sliceExcerpt}>{excerpt}</p>
                  <a href="#work" className={styles.sliceCta}>READ →</a>
                </div>
              </div>

              {/* Active bottom bar */}
              <div className={styles.sliceBar} />
            </div>
          );
        })}
      </div>

    </section>
  );
}
