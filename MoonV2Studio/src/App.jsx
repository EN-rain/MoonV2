import { useState, useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './index.css';
import { useLenis } from './hooks/useLenis';
import Preloader from './components/Preloader/Preloader';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import About from './components/About/About';
import Games from './components/Games/Games';
import Process from './components/Process/Process';
import ProcessDetail from './components/Process/ProcessDetail';
import Support from './components/Support/Support';
import Contact from './components/Contact/Contact';

gsap.registerPlugin(ScrollTrigger);

const sharedStyles = `
  .section-title { font-family:'Outfit',sans-serif; font-size:clamp(2rem, min(4.5vw, 7vh), 4.5rem); font-weight:900; line-height:1.05; letter-spacing:-0.03em; text-transform:uppercase; }
  .section-title .line { display:block; overflow:hidden; padding-bottom:0.05em; }
  .section-title .white { color:#f5f5f5; }
  .section-title .red   { color:#aa3bff; }
  .line.white { color:#f5f5f5; }
  .line.red   { color:#aa3bff; }
  .btn-primary { display:inline-flex; align-items:center; gap:10px; padding:14px 28px; background:#aa3bff; color:#f5f5f5; font-family:'Outfit',sans-serif; font-size:12px; font-weight:700; letter-spacing:0.15em; text-transform:uppercase; border:none; cursor:pointer; transition:background 0.25s,transform 0.25s; position:relative; overflow:hidden; clip-path:polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px)); }
  .btn-primary:hover { background:#c77dff; transform:translateY(-2px); }
  .btn-outline { display:inline-flex; align-items:center; gap:8px; padding:12px 24px; background:transparent; color:#f5f5f5; font-family:'Outfit',sans-serif; font-size:11px; font-weight:700; letter-spacing:0.15em; text-transform:uppercase; border:1px solid rgba(255,255,255,0.2); cursor:pointer; transition:border-color 0.25s,color 0.25s; }
  .btn-outline:hover { border-color:#aa3bff; color:#aa3bff; }

  /* ── Stacked panels ── */
  .panels-stage {
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;
  }
  .s-panel {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    will-change: transform, opacity, clip-path;
  }

  /* ── Red curtain overlay (for T2) ── */
  .curtain {
    position: fixed;
    inset: 0;
    background: #aa3bff;
    pointer-events: none;
    z-index: 700;
    clip-path: inset(0 100% 0 0);
  }

  /* ── Progress dots ── */
  .panel-dots {
    position: fixed;
    bottom: 28px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 10px;
    z-index: 9000;
    pointer-events: none;
  }
  .panel-dot { width:6px; height:6px; border-radius:50%; background:rgba(245,245,245,0.25); transition:background 0.3s, transform 0.3s; }
  .panel-dot.active { background:#aa3bff; transform:scale(1.5); }

  /* ── Section counter ── */
  .section-counter {
    position: fixed;
    right: 32px;
    bottom: 28px;
    font-family: 'Outfit', sans-serif;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.3em;
    color: rgba(245,245,245,0.3);
    text-transform: uppercase;
    z-index: 9000;
    pointer-events: none;
  }
  /* ── Scroll hint ── */
  .scroll-hint {
    position: fixed;
    left: 32px;
    bottom: 28px;
    font-family: 'Outfit', sans-serif;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.25em;
    color: rgba(245,245,245,0.3);
    text-transform: uppercase;
    z-index: 9000;
    pointer-events: none;
  }
`;

const SECTIONS = ['HERO', 'ABOUT', 'GAMES', 'PROCESS', 'SUPPORT', 'CONTACT'];
const N = SECTIONS.length;
const CHAPTER_SCROLL = window.innerHeight * 1.5; // Balanced scroll distance
const PRELOAD_KEY = 'moonv2studio:assets-preloaded';
const PRELOAD_ASSETS = [
  '/images/about_character.png',
  '/images/game_emberfall.png',
  '/images/game_aeondrive.png',
  '/images/game_lunaris.png',
  '/images/game_fracture.png',
  '/images/hero_sphere.png',
];

// ── Hold vs Transition Math ──
const HOLD = 0.8; // Deadzone weight per section
const TRANS = 1.0; // Transition weight between sections
const TOTAL_DURATION = (N * HOLD) + ((N - 1) * TRANS);

const SNAP_POINTS = [0];
for (let i = 1; i < N - 1; i++) {
  // Snap exactly to the center of the hold phase for each middle section
  SNAP_POINTS.push((i * (HOLD + TRANS) + HOLD / 2) / TOTAL_DURATION);
}
SNAP_POINTS.push(1);

export default function App() {
  useLenis();
  const [loading, setLoading] = useState(() => sessionStorage.getItem(PRELOAD_KEY) !== 'true');
  const [activeIdx, setActiveIdx] = useState(0);
  const [visibleStr, setVisibleStr] = useState('0');
  const [path, setPath] = useState(() => window.location.pathname);
  const processMatch = path.match(/^\/process\/([^/]+)$/);
  const processPostId = processMatch?.[1] ?? null;

  const stageRef = useRef(null);
  const panelRefs = useRef([]);
  const curtainRef = useRef(null);
  const scrollRoot = useRef(null); // invisible tall div

  const handlePreloaderComplete = useCallback(() => {
    sessionStorage.setItem(PRELOAD_KEY, 'true');
    setLoading(false);
  }, []);

  useEffect(() => {
    const handleRoute = () => setPath(window.location.pathname);
    window.addEventListener('popstate', handleRoute);
    return () => window.removeEventListener('popstate', handleRoute);
  }, []);

  const applyTransition = useCallback((chapter, p) => {
    const from = panelRefs.current[chapter];
    const to = panelRefs.current[chapter + 1];
    if (!from || !to) return;

    // Reset all OTHER panels
    panelRefs.current.forEach((panel, i) => {
      if (i !== chapter && i !== chapter + 1) {
        gsap.set(panel, { opacity: 0, zIndex: 0, x: 0, y: 0, scale: 1, filter: 'none', clipPath: 'none', rotate: 0 });
        if (panel.firstElementChild) {
          gsap.set(panel.firstElementChild, { clearProps: 'backgroundColor' });
        }
      }
    });

    // Make incoming panel visible behind outgoing
    gsap.set(to, { zIndex: 5, opacity: 1 });
    gsap.set(from, { zIndex: 10 });

    switch (chapter) {
      /* ─── T0: Hero → About ─── ZOOM-THROUGH: hero scales away, about circle-reveals ─── */
      case 0: {
        const fadeEnd = 0.45;
        const revealStart = 0.25;
        const heroP = Math.min(p / fadeEnd, 1);
        const aboutP = Math.max(0, (p - revealStart) / (1 - revealStart));

        gsap.set(to, { zIndex: 15 });
        gsap.set(from, { zIndex: 10 });

        // Hero zooms forward and fades
        gsap.set(from, {
          scale: 1 + heroP * 0.25,
          opacity: 1,
        });
        // About revealed via expanding circle from center
        gsap.set(to, {
          clipPath: `circle(${aboutP * 100}% at 50% 50%)`,
          scale: 1,
        });
        break;
      }

      /* ─── T1: About → Games ─── CONTENT SLIDE ─── */
      case 1: {
        const aboutContent = from.querySelectorAll('[data-about-content]');
        const gamesContent = to.querySelectorAll('[data-games-content]');
        const gamesBg = to.querySelector('[data-games-bg]');
        const pEase = gsap.parseEase('power2.inOut')(p);
        const gamesFade = gsap.utils.clamp(0, 1, (pEase - 0.15) / 0.85);
        
        // Keep panels stacked and fixed
        gsap.set(from, {
          x: 0,
          opacity: 1,
          scale: 1,
          filter: 'none',
          clipPath: 'none',
          zIndex: 5
        });
        if (from.firstElementChild) {
          gsap.set(from.firstElementChild, {
            backgroundColor: `rgba(8,8,8,${pEase})`,
          });
        }
        
        gsap.set(to, {
          x: 0,
          opacity: pEase,
          scale: 1,
          filter: 'none',
          clipPath: 'none',
          zIndex: 10
        });

        // About content slides out to the left
        gsap.set(aboutContent, {
          x: -pEase * 150,
          opacity: 1 - pEase * 0.5,
          filter: `blur(${pEase * 5}px)`,
        });
        
        // Games content slides in from the right
        gsap.set(gamesContent, {
          x: (1 - pEase) * 150,
          opacity: gamesFade,
          filter: `blur(${(1 - gamesFade) * 10}px)`,
        });
        
        if (gamesBg) {
          gsap.set(gamesBg, {
            opacity: pEase,
            scale: 1,
            filter: 'none',
          });
        }
        break;
      }

      /* ─── T2: Games → Process ─── RED CURTAIN SLANTED WIPE ─── */
      case 2: {
        if (p < 0.5) {
          const progress = p * 2;
          const pEaseIn = gsap.parseEase("power2.in")(progress);
          
          gsap.set(from, { 
            opacity: 1, 
            zIndex: 10,
            x: pEaseIn * -30, // slide left slightly
            scale: 1 - pEaseIn * 0.04,
            filter: `blur(${pEaseIn * 8}px)`,
            clipPath: 'none'
          });
          gsap.set(to, { opacity: 0, zIndex: 5 });
          
          if (curtainRef.current) {
            // Curtain sweeps in from left with \ slant
            const topX = progress * 140;
            const botX = progress * 140 - 40;
            gsap.set(curtainRef.current, {
              clipPath: `polygon(0 0, ${topX}% 0, ${botX}% 100%, 0 100%)`,
            });
          }
        } else {
          const progress = (p - 0.5) * 2;
          const pEaseOut = gsap.parseEase("power2.out")(progress);
          
          gsap.set(from, { opacity: 0, zIndex: 5 });
          gsap.set(to, { 
            opacity: 1, 
            zIndex: 10,
            x: 30 * (1 - pEaseOut), // slide in from right slightly
            scale: 1 - 0.04 * (1 - pEaseOut),
            filter: `blur(${(1 - pEaseOut) * 8}px)`,
            clipPath: 'none'
          });
          
          if (curtainRef.current) {
            // Curtain sweeps out to right with \ slant
            const topX = progress * 140;
            const botX = progress * 140 - 40;
            gsap.set(curtainRef.current, {
              clipPath: `polygon(${topX}% 0, 100% 0, 100% 100%, ${botX}% 100%)`,
            });
          }
        }
        break;
      }

      /* ─── T3: Process → Support ─── SCALE DOWN IRIS OUT ─── */
      case 3: {
        const pEase = gsap.parseEase('power2.inOut')(p);
        
        // Support emerges from the background
        gsap.set(to, {
          zIndex: 5,
          scale: 0.95 + pEase * 0.05,
          opacity: pEase,
          filter: `blur(${(1 - pEase) * 10}px)`,
          clipPath: 'none',
        });
        // Process shrinks into a dot
        gsap.set(from, {
          zIndex: 10,
          scale: 1 + pEase * 0.15,
          opacity: 1,
          clipPath: `circle(${(1 - pEase) * 100}% at 50% 50%)`,
        });
        break;
      }

      /* ─── T4: Support → Contact ─── DIAGONAL REVEAL (top-right to bottom-left) ─── */
      case 4: {
        // Support exits via diagonal clip
        const pct = p * 200;
        gsap.set(from, {
          clipPath: `polygon(${pct}% 0, 100% 0, 100% ${Math.max(0, 100 - pct)}%, 0 ${Math.max(0, 100 - pct)}%, 0 0)`,
          opacity: 1,
        });
        // Contact comes in clean
        gsap.set(to, {
          scale: 1,
          opacity: p > 0.4 ? (p - 0.4) / 0.6 : 0,
          clipPath: 'none',
        });
        break;
      }
    }
  }, []);

  useEffect(() => {
    if (loading || processPostId) return;

    // Set initial panel states
    panelRefs.current.forEach((panel, i) => {
      gsap.set(panel, { opacity: i === 0 ? 1 : 0, zIndex: i === 0 ? 10 : 0 });
    });

    const totalScroll = (N - 1) * CHAPTER_SCROLL;

    const trigger = ScrollTrigger.create({
      trigger: scrollRoot.current,
      start: 'top top',
      end: `+=${totalScroll}`,
      pin: stageRef.current,
      pinSpacing: true,
      scrub: 1.2,
      snap: {
        snapTo: SNAP_POINTS,
        duration: { min: 0.2, max: 0.8 },
        delay: 0.1,
        ease: "power2.inOut",
        directional: false
      },
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const p = self.progress;

        const currentLoc = p * TOTAL_DURATION;
        let accumulated = 0;
        let activeChap = 0;
        let transP = 0;

        for (let i = 0; i < N; i++) {
          if (currentLoc <= accumulated + HOLD) {
            activeChap = i;
            transP = 0;
            break;
          }
          accumulated += HOLD;

          if (i < N - 1) {
            if (currentLoc <= accumulated + TRANS) {
              activeChap = i;
              transP = (currentLoc - accumulated) / TRANS;
              break;
            }
            accumulated += TRANS;
          }
        }

        if (activeChap >= N - 1) {
          activeChap = N - 2;
          transP = 1;
        }

        setActiveIdx(activeChap + (transP > 0.5 ? 1 : 0));

        let newVisibleStr = '';
        if (transP === 0) newVisibleStr = `${activeChap}`;
        else if (transP === 1) newVisibleStr = `${activeChap + 1}`;
        else newVisibleStr = `${activeChap},${activeChap + 1}`;

        setVisibleStr(newVisibleStr);
        applyTransition(activeChap, transP);

        if (curtainRef.current) {
          if (activeChap !== 2 || transP === 0 || transP === 1) {
            gsap.set(curtainRef.current, { clipPath: 'inset(0 100% 0 0)' });
          }
        }
        if (p >= 0.99) {
          panelRefs.current.forEach((panel, i) => {
            gsap.set(panel, { opacity: i === N - 1 ? 1 : 0, zIndex: i === N - 1 ? 10 : 0 });
          });
        }
      },
    });

    const returnSection = sessionStorage.getItem('moonv2:return-section');
    if (returnSection !== null) {
      sessionStorage.removeItem('moonv2:return-section');
      const sectionIndex = Number(returnSection);
      requestAnimationFrame(() => {
        window.scrollTo({ top: sectionIndex * CHAPTER_SCROLL, behavior: 'auto' });
        trigger.update();
        ScrollTrigger.update();
      });
    }

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, [loading, applyTransition, processPostId]);

  if (processPostId) {
    return (
      <>
        <style>{sharedStyles}</style>
        {loading && <Preloader assets={PRELOAD_ASSETS} onComplete={handlePreloaderComplete} />}
        {!loading && <ProcessDetail postId={processPostId} />}
      </>
    );
  }

  return (
    <>
      <style>{sharedStyles}</style>
      {loading && <Preloader assets={PRELOAD_ASSETS} onComplete={handlePreloaderComplete} />}
      <Navbar />

      {/* Red curtain for T2 */}
      <div ref={curtainRef} className="curtain" />

      {/* Progress dots */}
      <div className="panel-dots">
        {SECTIONS.map((_, i) => (
          <div key={i} className={`panel-dot ${activeIdx === i ? 'active' : ''}`} />
        ))}
      </div>
      <div className="section-counter">
        {String(activeIdx + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}
      </div>

      {/* Tall invisible div that provides scroll distance */}
      <div ref={scrollRoot} style={{ height: `${N * 100}vh` }}>
        {/* Pinned visual stage */}
        <div ref={stageRef} className="panels-stage">
          {[Hero, About, Games, Process, Support, Contact].map((Section, i) => (
            <div
              key={i}
              ref={(el) => (panelRefs.current[i] = el)}
              className="s-panel"
              id={`panel-${SECTIONS[i].toLowerCase()}`}
              style={{ opacity: i === 0 ? 1 : 0, zIndex: i === 0 ? 10 : 0 }}
            >
              <Section
                isActive={!loading && visibleStr.split(',').includes(String(i))}
                suppressIntro={i === 2 && visibleStr === '1,2'}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
