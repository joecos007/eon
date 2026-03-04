import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { navigationConfig } from '../config';

gsap.registerPlugin(ScrollTrigger);

export function Navigation() {
  const navRef = useRef<HTMLElement>(null);
  const logoIconRef = useRef<SVGSVGElement>(null);
  const logoTextRef = useRef<HTMLSpanElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const buttonBoundsRef = useRef<DOMRect | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isTouchDevice = typeof window !== 'undefined'
    && (window.innerWidth < 768 || window.matchMedia('(hover: none)').matches);
  const prefersReducedMotion = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (!navigationConfig.logo) return;

    const trigger = ScrollTrigger.create({
      start: '100px top',
      end: 'max',
      onUpdate: (self) => {
        setIsScrolled(self.progress > 0);
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  // GSAP glow pulse on the SVG diamond — skip if reduced motion
  useEffect(() => {
    if (!logoIconRef.current || prefersReducedMotion) return;

    const sparkle = logoIconRef.current.querySelector('.diamond-sparkle');
    const body = logoIconRef.current.querySelector('.diamond-body');
    const facets = logoIconRef.current.querySelector('.diamond-facets');

    // Continuous sparkle rotation
    if (sparkle) {
      gsap.to(sparkle, {
        rotation: 360,
        transformOrigin: '50% 50%',
        duration: 6,
        repeat: -1,
        ease: 'none',
      });
    }

    // Subtle breathing pulse on the diamond body
    if (body) {
      gsap.to(body, {
        filter: 'drop-shadow(0 0 8px rgba(201,165,90,0.7))',
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }

    // Facets shimmer
    if (facets) {
      gsap.to(facets, {
        opacity: 1,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }
  }, [prefersReducedMotion]);

  // GSAP letter-by-letter shimmer on "Lumora" text
  useEffect(() => {
    if (!logoTextRef.current || prefersReducedMotion) return;

    const chars = logoTextRef.current.querySelectorAll('.logo-char');
    if (chars.length === 0) return;

    // Create a staggered shimmer effect
    gsap.fromTo(
      chars,
      { backgroundPosition: '-200% center' },
      {
        backgroundPosition: '200% center',
        duration: 3,
        stagger: { each: 0.15, repeat: -1, repeatDelay: 2 },
        ease: 'sine.inOut',
      }
    );
  }, [prefersReducedMotion]);

  if (!navigationConfig.logo) return null;

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  const handleButtonMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (prefersReducedMotion) return;
    if (!buttonRef.current) return;
    if (!buttonBoundsRef.current) {
      buttonBoundsRef.current = buttonRef.current.getBoundingClientRect();
    }
    const bounds = buttonBoundsRef.current;

    // Calculate distance from center (-1 to 1)
    const x = ((e.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const y = ((e.clientY - bounds.top) / bounds.height - 0.5) * 2;

    gsap.to(buttonRef.current, {
      x: x * 15,
      y: y * 15,
      duration: 0.3,
      ease: 'power2.out'
    });
  };

  const handleButtonMouseLeave = () => {
    buttonBoundsRef.current = null;
    if (prefersReducedMotion || !buttonRef.current) return;
    gsap.to(buttonRef.current, {
      x: 0,
      y: 0,
      duration: 0.7,
      ease: 'elastic.out(1, 0.3)'
    });
  };

  const logoText = 'Lumora';

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
          ? 'bg-black/80 backdrop-blur-xl border-b border-gold/10 py-4 shadow-xl'
          : 'bg-transparent pt-6 pb-8 bg-gradient-to-b from-black/80 via-black/40 to-transparent'
          }`}
      >
        <div className="max-w-7xl mx-auto px-8 lg:px-16 flex items-center justify-between">
          {/* Logo — Glowing Diamond + Shimmer Text */}
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, '#hero')}
            className="flex items-center gap-2.5 group transition-all duration-500"
          >
            {/* Animated Diamond Icon */}
            <motion.div
              className="relative"
              whileHover={prefersReducedMotion ? undefined : { scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
              {/* Glow halo behind diamond — only show when scrolled or on hover */}
              <motion.div
                className="absolute inset-0 -m-2"
                animate={{
                  opacity: (isScrolled && !isTouchDevice && !prefersReducedMotion) ? [0.3, 0.7, 0.3] : 0,
                  scale: (isScrolled && !isTouchDevice && !prefersReducedMotion) ? [0.95, 1.05, 0.95] : 1,
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                style={{
                  background: 'radial-gradient(circle, rgba(201,165,90,0.4) 0%, transparent 70%)',
                  borderRadius: '50%',
                  filter: 'blur(6px)',
                }}
              />

              <svg
                ref={logoIconRef}
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`w-9 h-9 relative z-10 transition-all duration-500`}
                style={{
                  filter: isScrolled
                    ? 'drop-shadow(0 0 6px rgba(201,165,90,0.6))'
                    : 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
                }}
              >
                <defs>
                  <linearGradient id="diamond-gradient-gold" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#e8d5a3" />
                    <stop offset="50%" stopColor="#c9a55a" />
                    <stop offset="100%" stopColor="#8a6914" />
                  </linearGradient>
                  {/* High contrast gradient for unscrolled state */}
                  <linearGradient id="diamond-gradient-dark" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1a1a1a" />
                    <stop offset="100%" stopColor="#000000" />
                  </linearGradient>
                  <filter id="diamond-glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="1.5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Diamond body */}
                <path
                  className="diamond-body transition-all duration-500"
                  d="M16 28L3 12L8 4H24L29 12L16 28Z"
                  stroke={isScrolled ? 'url(#diamond-gradient-gold)' : 'rgba(255,255,255,0.8)'}
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                  fill="none"
                />
                {/* Diamond facets */}
                <path
                  className="diamond-facets transition-all duration-500"
                  d="M3 12H29M16 28L10 12M16 28L22 12M10 12L8 4M10 12L16 4M22 12L16 4M22 12L24 4"
                  stroke={isScrolled ? 'url(#diamond-gradient-gold)' : 'rgba(255,255,255,0.8)'}
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                  opacity={isScrolled ? "0.5" : "0.3"}
                />
                {/* Sparkle accent */}
                <path
                  className="diamond-sparkle transition-all duration-500"
                  d="M16 1L16.8 2.5L18.5 2.5L17.2 3.5L17.6 5L16 4L14.4 5L14.8 3.5L13.5 2.5L15.2 2.5L16 1Z"
                  fill={isScrolled ? "#e8d5a3" : "#ffffff"}
                  opacity="0.9"
                  filter={isScrolled ? "url(#diamond-glow)" : "none"}
                />
              </svg>
            </motion.div>

            {/* Logo Text "Lumora" */}
            <motion.span
              ref={logoTextRef}
              className={`text-h5 font-semibold tracking-[0.15em] transition-all duration-500 flex text-white`}
              whileHover={prefersReducedMotion ? undefined : { letterSpacing: '0.2em' }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              style={{
                filter: isScrolled
                  ? 'drop-shadow(0 0 8px rgba(201,165,90,0.4))'
                  : 'drop-shadow(0 2px 4px rgba(0,0,0,0.6))',
              }}
            >
              {logoText.split('').map((char, i) => (
                <span
                  key={i}
                  className="logo-char inline-block"
                  style={{
                    background: isScrolled
                      ? 'linear-gradient(90deg, #c9a55a 0%, #e8d5a3 25%, #fff 50%, #e8d5a3 75%, #c9a55a 100%)'
                      : 'none',
                    backgroundSize: isScrolled ? '200% auto' : 'auto',
                    WebkitBackgroundClip: isScrolled ? 'text' : 'none',
                    WebkitTextFillColor: isScrolled ? 'transparent' : 'inherit',
                    backgroundClip: isScrolled ? 'text' : 'none',
                    animationDelay: `${i * 0.1}s`,
                  }}
                >
                  {char}
                </span>
              ))}
            </motion.span>
          </a>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-10">
            {navigationConfig.items.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`text-body font-semibold tracking-wide transition-all duration-500 relative group text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] hover:text-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-none px-1`}
              >
                {item.label}
                <span className="absolute -bottom-1.5 left-0 w-0 h-0.5 bg-gold group-hover:w-full transition-all duration-300 motion-reduce:transition-none motion-reduce:w-full" />
              </a>
            ))}

            <a
              href="#contact"
              ref={buttonRef}
              onMouseMove={handleButtonMouseMove}
              onMouseLeave={handleButtonMouseLeave}
              onClick={(e) => handleNavClick(e, '#contact')}
              className="px-6 py-2.5 rounded-none border border-gold/50 text-gold text-body-sm tracking-widest uppercase hover:bg-gold hover:text-black transition-colors duration-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] cursor-pointer"
            >
              Book Appointment
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center pr-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`text-white hover:text-gold transition-colors p-3 -m-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]`}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="w-7 h-7" />
              ) : (
                <Menu className="w-7 h-7" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-black lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex flex-col items-center justify-center h-full gap-8">
              {navigationConfig.items.map((item, i) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="text-h3 text-white hover:text-gold transition-colors duration-300"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  transition={{
                    delay: i * 0.08,
                    duration: 0.4,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {item.label}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
