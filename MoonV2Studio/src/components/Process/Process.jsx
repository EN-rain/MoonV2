import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { POSTS } from './posts';
import styles from './Process.module.css';

export default function Devlog({ isActive }) {
  const sectionRef     = useRef(null);
  const tagRef         = useRef(null);
  const sliceRefs      = useRef([]);
  const portalRef      = useRef(null);
  const portalKickerRef = useRef(null);
  const portalTitleRef = useRef(null);
  const openingRef     = useRef(false);
  const [hovered, setHovered] = useState(0);

  const setActivePost = useCallback((index) => {
    setHovered((current) => (current === index ? current : index));
  }, []);

  const openPost = useCallback((id, index) => {
    if (openingRef.current) return;

    const post   = POSTS.find((item) => item.id === id);
    const portal = portalRef.current;
    if (!post || !portal) return;

    openingRef.current = true;
    const slice = sliceRefs.current[index];
    const sourceTitle = slice?.querySelector(`.${styles.sliceTitle}`);
    const others = sliceRefs.current.filter(Boolean).filter((_, i) => i !== index);
    const portalTitle = portalTitleRef.current;
    const titleWords = post.title.split(' ').map((word, i, arr) => {
      const span = document.createElement('span');
      span.className = styles.portalWord;
      span.style.display = 'inline-block';
      span.textContent = `${word}${i < arr.length - 1 ? '\u00A0' : ''}`;
      return span;
    });
    portalTitle.replaceChildren(...titleWords);

    // Make portal visible but fully clipped (no visible pixels yet)
    gsap.set(portal, { autoAlpha: 1, clipPath: 'inset(0 100% 0 0)' });
    gsap.set(portalKickerRef.current, { opacity: 0 });

    const sourceRect = sourceTitle?.getBoundingClientRect();
    const targetRect = portalTitle.getBoundingClientRect();
    const start = sourceRect && targetRect.width
      ? {
          x: sourceRect.left + sourceRect.width / 2 - (targetRect.left + targetRect.width / 2),
          y: sourceRect.top + sourceRect.height / 2 - (targetRect.top + targetRect.height / 2),
          scale: Math.max(0.32, Math.min(sourceRect.width / targetRect.width, 1)),
        }
      : { x: 0, y: 24, scale: 0.92 };
    gsap.set(portalTitle, {
      opacity: 1,
      x: start.x,
      y: start.y,
      scale: start.scale,
      transformOrigin: '50% 50%',
    });

    const tl = gsap.timeline({
      defaults: { ease: 'expo.inOut' },
    });

    tl
      // Dim & blur non-clicked slices
      .to(others, {
        opacity: 0.08,
        filter: 'blur(12px)',
        scale: 0.97,
        duration: 0.42,
        stagger: 0.03,
        ease: 'power2.inOut',
      }, 0)

      // Smooth horizontal wipe: dark overlay sweeps left → right covering the screen
      .to(portal, {
        clipPath: 'inset(0 0% 0 0)',
        duration: 0.56,
        ease: 'expo.inOut',
      }, 0)

      // Kicker fades in as overlay fully covers
      .to(portalKickerRef.current, {
        opacity: 1,
        duration: 0.35,
        ease: 'power2.out',
      }, 0.48)

      // Title travels from the clicked card title into the portal title slot.
      .to(portalTitle, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.58,
        ease: 'expo.out',
      }, 0.12)

      .to(portalTitle, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.12,
        ease: 'none',
      }, 0.76)

      // Short hold so user reads the title, then trigger the route
      // Portal stays UP — covers the React page swap so there's no flash
      .call(() => {
        const wordRects = Array.from(portalTitleRef.current.children).map(el => {
          const rect = el.getBoundingClientRect();
          return { top: rect.top, left: rect.left, width: rect.width, height: rect.height };
        });
        sessionStorage.setItem('moonv2:process-title-rects', JSON.stringify(wordRects));
        sessionStorage.setItem('moonv2:process-enter', id);
        
        window.history.pushState({}, '', `/process/${id}`);
        window.dispatchEvent(new PopStateEvent('popstate'));
        window.scrollTo({ top: 0, behavior: 'auto' });

        // Wait for ProcessDetail to signal it's mounted & rendered
        // Instantly hide the portal — ProcessDetail will handle the seamless title morph
        const dropPortal = () => {
          gsap.set(portal, { clipPath: 'inset(0 100% 0 0)', autoAlpha: 0 });
          openingRef.current = false;
        };

        const onReady = () => {
          window.removeEventListener('moonv2:process-ready', onReady);
          clearTimeout(fallback);
          dropPortal();
        };

        // Safety fallback
        const fallback = setTimeout(() => {
          window.removeEventListener('moonv2:process-ready', onReady);
          dropPortal();
        }, 2000);

        window.addEventListener('moonv2:process-ready', onReady);
      }, [], 1.08);
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
      const tl = gsap.timeline({ delay: window.navJumpDelay ? 0.06 : 0.15 });
      tl.to(tagRef.current, { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out' }, 0)
        .to(slices, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.1 }, 0.2);
    }, sectionRef);
    return () => ctx.revert();
  }, [isActive]);

  return (
    <section ref={sectionRef} className={styles.process} id="work">

      {/* Standard side tag */}
      <div ref={tagRef} className={styles.sideTag} style={{ opacity: 0 }}>
        <span className={styles.tagNum}>04</span>
        <span className={styles.tagLabel}>PROCESS</span>
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
              onClick={() => openPost(id, i)}
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
                  <button type="button" className={styles.sliceCta}>EXPLORE →</button>
                </div>
              </div>

              {/* Active bottom bar */}
              <div className={styles.sliceBar} />
            </div>
          );
        })}
      </div>

      {/* Route transition portal */}
      <div ref={portalRef} className={styles.routePortal} aria-hidden="true">
        <div className={styles.portalCore}>
          <div ref={portalKickerRef} className={styles.portalKicker}>ENTERING PHASE</div>
          <div ref={portalTitleRef} className={styles.portalTitle}>
            {(POSTS[hovered]?.title || '').split(' ').map((word, i, arr) => (
              <span key={i} className={styles.portalWord} style={{ display: 'inline-block' }}>
                {word}{i < arr.length - 1 ? '\u00A0' : ''}
              </span>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}
