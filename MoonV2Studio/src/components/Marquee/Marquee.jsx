import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './Marquee.module.css';

const ITEMS = [
  { text: 'SOLO INDIE DEV' },
  { text: 'MOONV2 STUDIO' },
  { text: 'DARK FANTASY' },
  { text: 'CYBERPUNK' },
  { text: 'WORLD BUILDER' },
  { text: 'ADVENTURE' },
  { text: 'GAME DESIGNER' },
  { text: 'PUZZLE LOVER' },
];

export default function Marquee({ reverse = false }) {
  const trackRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    const totalW = track.scrollWidth / 2; // half because we duplicate

    // Infinite GSAP marquee
    const tween = gsap.fromTo(
      track,
      { x: reverse ? -totalW : 0 },
      {
        x: reverse ? 0 : -totalW,
        duration: 28,
        ease: 'none',
        repeat: -1,
      }
    );

    return () => tween.kill();
  }, [reverse]);

  // Duplicate items for seamless loop
  const allItems = [...ITEMS, ...ITEMS];

  return (
    <div className={styles.marquee} aria-hidden="true">
      <div ref={trackRef} className={styles.track}>
        {allItems.map(({ text }, i) => (
          <span key={i} className={styles.item}>
            <span className={styles.dot} />
            {i % 3 === 0 ? <strong>{text}</strong> : text}
          </span>
        ))}
      </div>
    </div>
  );
}
