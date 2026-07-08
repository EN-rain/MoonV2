import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { POSTS } from './posts';
import styles from './ProcessDetail.module.css';

export default function DevlogDetail({ postId }) {
  const pageRef = useRef(null);
  const heroRef = useRef(null);
  const imageRef = useRef(null);
  const blackoutRef = useRef(null);
  const exitRef = useRef(null);
  const contentRef = useRef(null);
  const titleRef = useRef(null);
  const bodyRef = useRef(null);
  const post = POSTS.find((item) => item.id === postId) ?? POSTS[0];

  // React 18 Strict Mode double-invokes effects. We must cache fromProcess so the second pass doesn't lose it.
  const fromProcessRef = useRef(sessionStorage.getItem('moonv2:process-enter') === post.id);
  const titleRectsRef = useRef(sessionStorage.getItem('moonv2:process-title-rects'));

  useLayoutEffect(() => {
    const fromProcess = fromProcessRef.current;
    // Clear it so refreshing the page doesn't replay the Process entry animation
    sessionStorage.removeItem('moonv2:process-enter');

    const ctx = gsap.context(() => {
      // 1. Initial setup
      gsap.set(heroRef.current, { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' });
      gsap.set(imageRef.current, { scale: fromProcess ? 1.08 : 1.02, filter: fromProcess ? 'blur(8px)' : 'blur(0px)' });
      
      const contentSiblings = Array.from(contentRef.current.children).filter(el => el !== titleRef.current);
      gsap.set(contentSiblings, { opacity: 0, y: 28, filter: 'blur(10px)' });
      gsap.set(bodyRef.current.children, { opacity: 0, y: 24 });

      // 2. Seamless Title FLIP setup
      if (fromProcess && titleRef.current) {
        // Blackout stays solid to hide the image instantly
        gsap.set(blackoutRef.current, { autoAlpha: 1 });
        
        try {
          const oldRectsStr = titleRectsRef.current;
          if (oldRectsStr) {
            const oldRects = JSON.parse(oldRectsStr);
            const newWordEls = Array.from(titleRef.current.children);
            
            newWordEls.forEach((el, i) => {
              if (oldRects[i]) {
                const oldRect = oldRects[i];
                const newRect = el.getBoundingClientRect();
                
                // Calculate center-to-center delta for each word
                const oldCenterX = oldRect.left + oldRect.width / 2;
                const oldCenterY = oldRect.top + oldRect.height / 2;
                const newCenterX = newRect.left + newRect.width / 2;
                const newCenterY = newRect.top + newRect.height / 2;
                
                const dx = oldCenterX - newCenterX;
                const dy = oldCenterY - newCenterY;
                const scale = oldRect.width / newRect.width;
                
                // Offset the real word so it starts perfectly matching the source word
                gsap.set(el, { x: dx, y: dy, opacity: 1, scale: scale, transformOrigin: '50% 50%' });
              }
            });
          }
        } catch (e) {
          console.error('Failed to parse title rects', e);
        }
        
        sessionStorage.removeItem('moonv2:process-title-rects');
      } else {
        gsap.set(blackoutRef.current, { autoAlpha: 0 });
        gsap.set(titleRef.current.children, { opacity: 0, y: 28, filter: 'blur(10px)' });
      }

      if (fromProcess) {
        window.dispatchEvent(new CustomEvent('moonv2:process-ready'));
      }

      // 3. Animation Sequence
      const tl = gsap.timeline({ delay: fromProcess ? 0 : 0.05 });
      
      if (fromProcess && titleRef.current) {
        // Words float from center down to their natural left-aligned positions
        tl.to(titleRef.current.children, {
          x: 0,
          y: 0,
          scale: 1,
          duration: 0.68,
          ease: 'power4.inOut',
          stagger: 0.02, // slight stagger for cinematic effect
        }, 0);
        
        // Blackout fades out, revealing the blurred image underneath
        tl.to(blackoutRef.current, {
          autoAlpha: 0,
          duration: 0.42,
          ease: 'power2.inOut',
        }, 0);
      } else {
        // Standard fade in if navigating directly
        tl.to(titleRef.current.children, {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.72,
          ease: 'power3.out',
          stagger: 0.05,
        }, 0.16);
      }

      // Rest of the page contents fade in
      tl.to(imageRef.current, {
        scale: 1,
        filter: 'blur(0px)',
        duration: fromProcess ? 0.62 : 0.45,
        ease: 'power3.out',
      }, 0)
        .to(contentSiblings, {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.52,
          stagger: 0.055,
          ease: 'power3.out',
        }, fromProcess ? 0.35 : 0.12)
        .to(bodyRef.current.children, {
          opacity: 1,
          y: 0,
          duration: 0.42,
          stagger: 0.055,
          ease: 'power3.out',
        }, fromProcess ? 0.34 : 0.42);
    }, pageRef);

    return () => ctx.revert();
  }, [post.id]);

  const goBack = () => {
    const exit = exitRef.current;
    gsap.killTweensOf([exit, contentRef.current.children, bodyRef.current.children, imageRef.current]);

    gsap.timeline({
      defaults: { ease: 'power4.inOut' },
      onComplete: () => {
        sessionStorage.setItem('moonv2:return-section', '3');
        window.history.pushState({}, '', '/');
        window.dispatchEvent(new PopStateEvent('popstate'));
      },
    })
      .to(bodyRef.current.children, {
        opacity: 0,
        y: 18,
        duration: 0.24,
        stagger: 0.03,
        ease: 'power2.in',
      }, 0)
      .to(contentRef.current.children, {
        opacity: 0,
        y: -20,
        filter: 'blur(8px)',
        duration: 0.34,
        stagger: 0.035,
        ease: 'power2.in',
      }, 0.04)
      .to(imageRef.current, {
        scale: 1.06,
        filter: 'blur(8px)',
        duration: 0.55,
      }, 0)
      .set(exit, { autoAlpha: 1, clipPath: 'inset(0 100% 0 0)' }, 0.08)
      .to(exit, {
        clipPath: 'inset(0 0% 0 0)',
        duration: 0.58,
      }, 0.08);
  };

  return (
    <main ref={pageRef} className={styles.page}>
      <button type="button" className={styles.back} onClick={goBack}>
        BACK
      </button>

      <section ref={heroRef} className={styles.hero}>
        <img ref={imageRef} src={post.img} alt={post.title} className={styles.image} />
        {/* Solid black div to cover the image during the transition */}
        <div ref={blackoutRef} style={{ position: 'absolute', inset: 0, background: '#0a0a0a', zIndex: 1, visibility: 'hidden' }} />
        <div ref={exitRef} className={styles.exitWipe} />
        <div className={styles.overlay} />

        <div ref={contentRef} className={styles.content}>
          <div className={styles.meta}>
            <span>{post.tag}</span>
            <span>{post.date}</span>
            <span>{post.year}</span>
          </div>
          <h1 ref={titleRef}>
            {post.title.split(' ').map((word, i, arr) => (
              <span key={i} className={styles.detailWord} style={{ display: 'inline-block' }}>
                {word}{i < arr.length - 1 ? '\u00A0' : ''}
              </span>
            ))}
          </h1>
          <p>{post.dek}</p>
          <div className={styles.points}>
            {post.points.map((point) => (
              <span key={point}>{point}</span>
            ))}
          </div>
        </div>
      </section>

      <section ref={bodyRef} className={styles.body}>
        {post.body.map((block, idx) => {
          switch (block.type) {
            case 'heading':
              return <h2 key={idx}>{block.content}</h2>;
            case 'paragraph':
              return <p key={idx}>{block.content}</p>;
            case 'image':
              return (
                <figure key={idx} className={styles.inlineImage}>
                  <img src={block.url} alt={block.caption || 'Process image'} />
                  {block.caption && <figcaption>{block.caption}</figcaption>}
                </figure>
              );
            case 'quote':
              return (
                <blockquote key={idx} className={styles.pullQuote}>
                  <p>"{block.content}"</p>
                  {block.author && <footer>— {block.author}</footer>}
                </blockquote>
              );
            case 'list':
              return (
                <ul key={idx} className={styles.bulletList}>
                  {block.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              );
            case 'code':
              return (
                <div key={idx} className={styles.codeBlock}>
                  <div className={styles.codeHeader}>{block.language || 'Code'}</div>
                  <pre><code>{block.content}</code></pre>
                </div>
              );
            case 'video':
              return (
                <figure key={idx} className={styles.videoBlock}>
                  <div className={styles.videoWrapper}>
                    <img src={block.thumbnail} alt="Video thumbnail" />
                    <div className={styles.playButton}>▶</div>
                  </div>
                  {block.caption && <figcaption>{block.caption}</figcaption>}
                </figure>
              );
            default:
              return null;
          }
        })}
      </section>
    </main>
  );
}
