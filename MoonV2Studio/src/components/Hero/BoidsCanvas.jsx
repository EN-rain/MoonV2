import { useEffect, useRef } from 'react';
import styles from './Hero.module.css';

class Boid {
  constructor(x, y, canvasWidth, canvasHeight) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 2;
    this.vy = (Math.random() - 0.5) * 2;
    this.radius = Math.random() * 1.5 + 0.5;
    this.maxSpeed = 2.5;
    this.maxForce = 0.05;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
  }

  applyForce(fx, fy) {
    this.vx += fx;
    this.vy += fy;
  }

  update() {
    // Limit speed
    const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    if (speed > this.maxSpeed) {
      this.vx = (this.vx / speed) * this.maxSpeed;
      this.vy = (this.vy / speed) * this.maxSpeed;
    }
    
    this.x += this.vx;
    this.y += this.vy;
    
    // Wrap around edges
    if (this.x < 0) this.x = this.canvasWidth;
    if (this.x > this.canvasWidth) this.x = 0;
    if (this.y < 0) this.y = this.canvasHeight;
    if (this.y > this.canvasHeight) this.y = 0;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(170, 59, 255, 0.6)'; // var(--red) with opacity
    ctx.fill();
  }
}

export default function BoidsCanvas({ mouseX, mouseY, isClicked }) {
  const canvasRef = useRef(null);
  const boidsRef = useRef([]);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialize boids
    const numBoids = 150;
    boidsRef.current = Array.from({ length: numBoids }).map(
      () => new Boid(Math.random() * canvas.width, Math.random() * canvas.height, canvas.width, canvas.height)
    );

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const boids = boidsRef.current;
      const mX = mouseX.current;
      const mY = mouseY.current;
      
      for (let i = 0; i < boids.length; i++) {
        const b = boids[i];
        
        // Mouse interaction
        const dx = mX - b.x;
        const dy = mY - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 200) {
          if (isClicked.current) {
            // Scatter
            b.applyForce(-dx * 0.05, -dy * 0.05);
          } else {
            // Seek mouse gently
            b.applyForce(dx * 0.001, dy * 0.001);
          }
        }
        
        // Basic flocking (cohesion & separation simulation via wandering)
        // For performance, we skip full O(N^2) flocking and use localized wander + mouse seek
        b.applyForce((Math.random() - 0.5) * 0.2, (Math.random() - 0.5) * 0.2);
        
        b.update();
        b.draw(ctx);
      }
      
      rafRef.current = requestAnimationFrame(animate);
    };
    
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [mouseX, mouseY, isClicked]);

  return <canvas ref={canvasRef} className={styles.canvas} />;
}
