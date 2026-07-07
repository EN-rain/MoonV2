import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './Cursor.module.css';

export default function Cursor() {
  const dotRef = useRef(null);

  useEffect(() => {
    // We use GSAP quickTo for massive performance gains on cursor tracking
    const xTo = gsap.quickTo(dotRef.current, "x", { duration: 0.1, ease: "power3" });
    const yTo = gsap.quickTo(dotRef.current, "y", { duration: 0.1, ease: "power3" });

    const move = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    window.addEventListener('mousemove', move, { passive: true });
    return () => {
      window.removeEventListener('mousemove', move);
    };
  }, []);

  return (
    <div className={styles.cursorWrapper}>
      <div ref={dotRef} className={styles.dot} />
    </div>
  );
}
