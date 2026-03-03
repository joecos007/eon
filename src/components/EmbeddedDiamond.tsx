import { useEffect, useRef, useId } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'motion/react';

gsap.registerPlugin(ScrollTrigger);

interface EmbeddedDiamondProps {
  className?: string;
}

export function EmbeddedDiamond({ className = '' }: EmbeddedDiamondProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const id = useId();
  const gradId = `solid-gold-grad-${id}`;
  const glowId = `inner-glow-${id}`;

  useEffect(() => {
    if (!containerRef.current) return;

    // The diamond appears when its container enters the viewport
    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top 85%',
      onEnter: () => {
        gsap.fromTo(
          containerRef.current,
          { opacity: 0, y: 30, scale: 0.8 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.2,
            ease: 'expo.out',
            overwrite: 'auto',
          }
        );
      },
      onLeaveBack: () => {
        // Fade out slightly when scrolling back up past it
        gsap.to(containerRef.current, {
          opacity: 0,
          y: 10,
          scale: 0.95,
          duration: 0.8,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ opacity: 0 }} // Start hidden for GSAP
    >
      {/* 
        The primary breathing pulse animation using Framer Motion.
        This provides a slow, luxurious glow without GSAP velocity distortion.
      */}
      <motion.div
        animate={{
          filter: [
            'drop-shadow(0 0 10px rgba(201,165,90,0.3))',
            'drop-shadow(0 0 25px rgba(201,165,90,0.7))',
            'drop-shadow(0 0 10px rgba(201,165,90,0.3))',
          ],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="relative w-8 h-8 md:w-12 md:h-12 flex items-center justify-center text-gold"
      >
        {/* Solid, High-Contrast Diamond SVG */}
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f3e5c0" />
              <stop offset="30%" stopColor="#e8d5a3" />
              <stop offset="70%" stopColor="#c9a55a" />
              <stop offset="100%" stopColor="#8a6914" />
            </linearGradient>
            {/* Soft inner glow to give it a 3D gem feel */}
            <filter id={glowId}>
              <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" result="blur" />
              <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="shadowDiff" />
              <feFlood floodColor="#ffffff" floodOpacity="0.4" />
              <feComposite in2="shadowDiff" operator="in" />
              <feComposite in2="SourceGraphic" operator="over" />
            </filter>
          </defs>

          {/* Solid Body */}
          <path
            d="M16 28L3 12L8 4H24L29 12L16 28Z"
            fill={`url(#${gradId})`}
            filter={`url(#${glowId})`}
          />

          {/* Facet Lines for Depth (Darker Gold for contrast against the solid fill) */}
          <path
            d="M3 12H29M16 28L10 12M16 28L22 12M10 12L8 4M10 12L16 4M22 12L16 4M22 12L24 4"
            stroke="#5c4509"
            strokeWidth="1.2"
            strokeLinejoin="round"
            opacity="0.7"
          />

          {/* Top Sparkle (Bright White/Light Gold) */}
          <path
            d="M16 1L16.8 2.5L18.5 2.5L17.2 3.5L17.6 5L16 4L14.4 5L14.8 3.5L13.5 2.5L15.2 2.5L16 1Z"
            fill="#ffffff"
            opacity="0.9"
          />
        </svg>

        {/* Ambient background glow behind the SVG to enhance the luxury feel */}
        <div className="absolute inset-0 bg-gold rounded-full mix-blend-screen opacity-20 blur-xl w-[150%] h-[150%] left-[-25%] top-[-25%] -z-10 pointer-events-none" />
      </motion.div>
    </div>
  );
}
