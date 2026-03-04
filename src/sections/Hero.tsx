import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { heroConfig } from '../config';
import { EmbeddedDiamond } from '../components/EmbeddedDiamond';

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const copyrightRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const buttonBoundsRef = useRef<DOMRect | null>(null);
  const [, setLoaded] = useState(false);
  const triggersRef = useRef<ScrollTrigger[]>([]);

  useEffect(() => {
    if (!heroConfig.title) return;

    const tl = gsap.timeline({ delay: 0.2 });

    // Image scale + fade
    tl.fromTo(
      imageRef.current,
      { scale: 1.1, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.8, ease: 'expo.out' }
    );

    // Badge fade + slide down
    tl.fromTo(
      badgeRef.current,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
      '-=1.2'
    );

    // Title fade up
    tl.fromTo(
      titleRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'expo.out' },
      '-=0.8'
    );

    // Subtitle blur reveal
    tl.fromTo(
      subtitleRef.current,
      { filter: 'blur(12px)', opacity: 0 },
      { filter: 'blur(0px)', opacity: 1, duration: 0.8, ease: 'power2.out' },
      '-=0.6'
    );

    // Services slide in
    tl.fromTo(
      servicesRef.current,
      { x: -50, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.7, ease: 'expo.out' },
      '-=0.4'
    );

    // Line grow
    tl.fromTo(
      lineRef.current,
      { height: 0 },
      { height: 120, duration: 1.2, ease: 'expo.inOut' },
      '-=0.6'
    );

    // Copyright fade
    tl.fromTo(
      copyrightRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
      '-=0.8'
    );

    requestAnimationFrame(() => setLoaded(true));

    // Scroll effects — parallax on the background image
    const trigger1 = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: '50% top',
      scrub: 1,
      onUpdate: (self) => {
        if (imageRef.current) {
          gsap.set(imageRef.current, {
            y: `${self.progress * 45}%`,
            opacity: 1 - self.progress * 0.65,
          });
        }
      },
    });
    triggersRef.current.push(trigger1);

    // Scroll effect — title fades out
    const trigger2 = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: '10% top',
      end: '40% top',
      scrub: 1,
      onUpdate: (self) => {
        if (titleRef.current) {
          gsap.set(titleRef.current, {
            opacity: 1 - self.progress,
            y: -30 * self.progress,
          });
        }
        if (subtitleRef.current) {
          gsap.set(subtitleRef.current, {
            opacity: 1 - self.progress,
            y: -20 * self.progress,
          });
        }
      },
    });
    triggersRef.current.push(trigger2);

    return () => {
      tl.kill();
      triggersRef.current.forEach((t) => t.kill());
      triggersRef.current = [];
    };
  }, []);

  const handleButtonMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
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
      ease: "power2.out"
    });
  };

  const handleButtonMouseLeave = () => {
    buttonBoundsRef.current = null;
    gsap.to(buttonRef.current, {
      x: 0,
      y: 0,
      duration: 0.7,
      ease: "elastic.out(1, 0.3)"
    });
  };

  const handleScrollClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const target = document.querySelector(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!heroConfig.title) return null;

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative h-screen w-full overflow-hidden"
    >
      {/* Subtle bottom gradient for text legibility */}
      <div
        className="absolute inset-x-0 bottom-0 h-[45%] z-10 pointer-events-none"
        style={{
          background:
            'linear-gradient(to top, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.2) 40%, transparent 100%)',
        }}
      />

      {/* Main background image */}
      <div
        ref={imageRef}
        className="absolute inset-0 z-0"
      >
        <img
          src={heroConfig.backgroundImage}
          alt="Hero"
          fetchPriority="high"
          decoding="async"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Badge — top center */}
      <div className="absolute top-24 pt-safe left-1/2 -translate-x-1/2 z-20 w-max max-w-[90vw]">
        <div
          ref={badgeRef}
          className="px-5 md:px-6 py-2 rounded border border-white/20 bg-black/20 backdrop-blur-md"
        >
          <span className="text-body-sm font-medium tracking-[0.1em] md:tracking-[0.2em] uppercase shimmer-text text-center block">
            {heroConfig.badge}
          </span>
        </div>
      </div>

      {/* Title & Subtitle — bottom left, not blocking faces */}
      <div className="absolute bottom-28 pb-safe left-6 md:left-8 lg:left-16 z-20 max-w-[90vw] md:max-w-xl">
        <h1
          ref={titleRef}
          className="text-h2 md:text-h1 lg:text-display-xl font-medium text-white tracking-tight mb-4 lg:mb-3 leading-[1.1]"
          style={{
            textShadow: '0 4px 30px rgba(0, 0, 0, 0.5), 0 2px 8px rgba(0, 0, 0, 0.3)',
            wordBreak: 'keep-all',
          }}
        >
          {heroConfig.title}
        </h1>

        <p
        ref={subtitleRef}
        className="text-body md:text-body-lg lg:text-h5 font-light text-white/90 tracking-[0.1em] lg:tracking-[0.15em] uppercase bg-black/40 lg:bg-black/25 backdrop-blur-md px-4 py-2 lg:px-5 lg:py-1.5 rounded inline-block"
      >
          {heroConfig.subtitle}
        </p>

        <div className="mt-8 relative z-30">
          <a
            href="#works"
            ref={buttonRef}
            onMouseMove={handleButtonMouseMove}
            onMouseLeave={handleButtonMouseLeave}
            onClick={(e) => handleScrollClick(e, '#works')}
            className="inline-block px-8 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-gold/90 hover:border-gold hover:text-black hover:font-semibold transition-all duration-300 font-medium tracking-[0.15em] uppercase rounded-sm cursor-pointer shadow-[0_0_20px_rgba(0,0,0,0.3)]"
          >
            Explore Collection
          </a>
        </div>
      </div>

      {/* Decorative accent line — bottom center */}
      <div
        className="absolute left-1/2 bottom-28 w-px bg-gradient-to-b from-gold/0 via-gold to-gold/0 z-20"
        ref={lineRef}
        style={{
          transform: 'translateX(-50%)',
        }}
      />

      {/* Scroll down indicator & Diamond */}
      <div className="absolute left-1/2 bottom-10 z-20 transform -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce-subtle">
        <EmbeddedDiamond className="opacity-90" />
      </div>

      {/* Services label — vertical left */}
      <div
        ref={servicesRef}
        className="absolute left-8 bottom-32 z-20 hidden lg:flex flex-col items-center gap-4"
        style={{
          writingMode: 'vertical-rl',
          textOrientation: 'mixed',
          textShadow: '0 2px 8px rgba(0,0,0,0.6)',
        }}
      >
        <span className="text-body-sm text-white/80 tracking-widest">
          {heroConfig.servicesLabel}
        </span>
      </div>

      {/* Copyright — bottom right */}
      <div
        ref={copyrightRef}
        className="absolute right-8 bottom-8 z-20"
        style={{ textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}
      >
        <span className="text-body-sm text-white/70">{heroConfig.copyright}</span>
      </div>
    </section>
  );
}
