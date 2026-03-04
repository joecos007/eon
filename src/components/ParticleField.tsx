import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  baseOpacity: number;
  twinklePhase: number;
  twinkleSpeed: number;
  isGold: boolean;
}

export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000, targetX: -1000, targetY: -1000 });
  const rafRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Detect capabilities
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    // Rich starfield
    const particleCount = isTouchDevice ? 50 : 120;

    let width = 0;
    let height = 0;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;

      // Safely resize physical pixels
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      
      // Set absolute transform rather than exponential scale()
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      
      // Set CSS logical pixels
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      // Prevent wild parallax snap on load/resize
      mouseRef.current.targetX = width / 2;
      mouseRef.current.targetY = height / 2;
      if (mouseRef.current.x === -1000) {
        mouseRef.current.x = width / 2;
        mouseRef.current.y = height / 2;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles (stars)
    particlesRef.current = Array.from({ length: particleCount }, () => {
      const size = Math.random() * 2 + 0.5; // 0.5px to 2.5px
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        size: size,
        baseOpacity: Math.random() * 0.4 + 0.1, // 0.1 to 0.5 base
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.02 + 0.005, // Slow twinkle
        isGold: Math.random() > 0.7, // 30% of stars are gold, rest are white
      };
    });

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const animate = () => {
      // Smoothly interpolate actual mouse pos towards target (easing)
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      const mX = mouseRef.current.x;
      const mY = mouseRef.current.y;

      ctx.clearRect(0, 0, width, height);

      particlesRef.current.forEach((p) => {
        // 1. Move particle (slow drift)
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around bounds seamlessly
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        // 2. Calculate Parallax Shift
        // Larger particles move more (they are "closer" to the viewer)
        const parallaxOffsetX = ((mX - width / 2) * p.size) * 0.015;
        const parallaxOffsetY = ((mY - height / 2) * p.size) * 0.015;

        const drawX = p.x - parallaxOffsetX;
        const drawY = p.y - parallaxOffsetY;

        // 3. Calculate Distance to Mouse for Interaction
        const dx = drawX - mX;
        const dy = drawY - mY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const mouseRadius = 150;
        let interactionOpacity = 0;
        let interactionSize = 0;

        // Crucial bugfix: ensure dist > 0 to prevent 0/0 resulting in NaN
        if (dist > 0 && dist < mouseRadius && !isTouchDevice) {
          // Normalize distance (0 at edge, 1 at center)
          const intensity = (mouseRadius - dist) / mouseRadius;
          
          // Glow brighter when mouse is near
          interactionOpacity = intensity * 0.6;
          // Swell slightly when mouse is near
          interactionSize = intensity * 1.5;

          // Gentle Repulsion (they drift away from cursor slowly)
          p.x += (dx / dist) * intensity * 0.4;
          p.y += (dy / dist) * intensity * 0.4;
        }

        // 4. Calculate Twinkle
        p.twinklePhase += p.twinkleSpeed;
        const twinkleOscillation = Math.sin(p.twinklePhase) * 0.3; // -0.3 to +0.3
        
        let finalOpacity = p.baseOpacity + twinkleOscillation + interactionOpacity;
        finalOpacity = Math.max(0, Math.min(1, finalOpacity)); // Clamp 0-1

        // Safeguard final size
        const finalSize = Math.max(0.1, p.size + interactionSize);

        // Safety check to ensure valid rendering parameters (No NaN)
        if (isNaN(drawX) || isNaN(drawY) || isNaN(finalSize)) {
          return; 
        }

        // 5. Draw Particle
        ctx.beginPath();
        ctx.arc(drawX, drawY, finalSize, 0, Math.PI * 2);

        // Colors: Brand Gold is rgba(201, 165, 90), White is rgba(255, 255, 255)
        const colorBase = p.isGold ? '201, 165, 90' : '255, 255, 255';
        ctx.fillStyle = `rgba(${colorBase}, ${finalOpacity})`;

        // Shadow blur (glow) — disabled on mobile for GPU performance
        if (!isTouchDevice && (finalSize > 1.5 || interactionOpacity > 0.2)) {
          ctx.shadowBlur = finalSize * 3;
          ctx.shadowColor = `rgba(${colorBase}, ${finalOpacity})`;
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.fill();
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    // Start animation loop
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[1]"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
