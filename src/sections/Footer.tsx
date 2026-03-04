import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Instagram, Dribbble, ArrowUpRight } from 'lucide-react';
import { footerConfig } from '../config';
import { EmbeddedDiamond } from '../components/EmbeddedDiamond';

gsap.registerPlugin(ScrollTrigger);

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Instagram,
  Dribbble,
};

export function Footer() {
  const sectionRef = useRef<HTMLElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const marqueeContentRef = useRef<HTMLDivElement>(null);
  const linksCol1Ref = useRef<(HTMLAnchorElement | null)[]>([]);
  const linksCol2Ref = useRef<(HTMLAnchorElement | null)[]>([]);
  const copyrightRef = useRef<HTMLDivElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);
  const marqueeTweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (!footerConfig.copyright) return;

    const section = sectionRef.current;
    if (!section) return;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top 90%',
      onEnter: () => {
        const tl = gsap.timeline();

        // Infinite Marquee Scroll
        if (marqueeContentRef.current) {
          const contentWidth = marqueeContentRef.current.scrollWidth / 2;

          marqueeTweenRef.current = gsap.to(marqueeContentRef.current, {
            x: -contentWidth,
            duration: 20,
            ease: "none",
            repeat: -1,
          });
        }

        // Top border draw
        tl.fromTo(
          borderRef.current,
          { width: 0 },
          { width: '100%', duration: 0.8, ease: 'expo.inOut' },
          '-=0.5'
        );

        // Links column 1 stagger
        linksCol1Ref.current.forEach((link, i) => {
          if (link) {
            tl.fromTo(
              link,
              { x: -30, opacity: 0 },
              { x: 0, opacity: 1, duration: 0.4, ease: 'power2.out' },
              `-=${0.35 - i * 0.1}`
            );
          }
        });

        // Links column 2 stagger
        linksCol2Ref.current.forEach((link, i) => {
          if (link) {
            tl.fromTo(
              link,
              { x: 30, opacity: 0 },
              { x: 0, opacity: 1, duration: 0.4, ease: 'power2.out' },
              `-=${0.35 - i * 0.1}`
            );
          }
        });

        // Copyright fade up
        tl.fromTo(
          copyrightRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
          '-=0.2'
        );
      },
      once: true,
    });
    triggersRef.current.push(trigger);

    return () => {
      marqueeTweenRef.current?.kill();
      triggersRef.current.forEach((t) => t.kill());
      triggersRef.current = [];
    };
  }, []);

  if (!footerConfig.copyright) return null;

  const marqueeText = footerConfig.marqueeText;
  const highlightChars = footerConfig.marqueeHighlightChars;

  return (
    <footer
      ref={sectionRef}
      className="relative pt-16 md:pt-20 pb-8 md:pb-12 px-6 md:px-8 lg:px-16 bg-black overflow-hidden"
    >
      {/* Marquee section */}
      <div
        ref={marqueeRef}
        className="relative mb-20 overflow-hidden"
      >
        {/* Gradient masks */}
        <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-black to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-black to-transparent z-10" />

        {/* Marquee content */}
        <div className="flex w-full overflow-hidden">
          <div
            ref={marqueeContentRef}
            className="flex items-center text-[36px] md:text-[56px] lg:text-[112px] font-medium whitespace-nowrap will-change-transform flex-nowrap w-max"
          >
            {/* We render exactly 4 sets to ensure the seam is never visible on any screen size */}
            {[...Array(4)].map((_, i) => (
              <span key={i} className="flex items-center gap-4 md:gap-8 px-4 md:px-8 whitespace-nowrap shrink-0">
                {marqueeText.split('').map((char, j) => (
                  <span
                    key={j}
                    className={
                      highlightChars.includes(char)
                        ? 'text-gold animate-pulse-glow'
                        : 'text-white'
                    }
                    style={
                      highlightChars.includes(char)
                        ? { textShadow: '0 0 20px var(--gold)' }
                        : undefined
                    }
                  >
                    {char}
                  </span>
                ))}
                <span className="text-white/30">&bull;</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Top border */}
      <div
        ref={borderRef}
        className="h-px bg-gold/20 mb-16"
      />

      {/* Footer content */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Column 1 - Nav links */}
          <div className="space-y-4">
            {footerConfig.navLinks1.map((link, i) => (
              <a
                key={link.label}
                ref={(el) => {
                  linksCol1Ref.current[i] = el;
                }}
                href={link.href}
                className="block text-body text-white/60 hover:text-gold transition-colors duration-300 group relative overflow-hidden"
              >
                <span className="block group-hover:-translate-y-full transition-transform duration-400">
                  {link.label}
                </span>
                <span className="absolute top-full left-0 block group-hover:-translate-y-full transition-transform duration-400 text-gold">
                  {link.label}
                </span>
              </a>
            ))}
          </div>

          {/* Column 2 - More links */}
          <div className="space-y-4">
            {footerConfig.navLinks2.map((link, i) => {
              const IconComponent = link.icon ? iconMap[link.icon] : null;
              return (
                <a
                  key={link.label}
                  ref={(el) => {
                    linksCol2Ref.current[i] = el;
                  }}
                  href={link.href}
                  className="flex items-center gap-2 text-body text-white/60 hover:text-gold transition-colors duration-300 group"
                >
                  {IconComponent && (
                    <IconComponent className="w-4 h-4 group-hover:drop-shadow-[0_0_10px_currentColor] transition-all duration-200" />
                  )}
                  <span className="relative overflow-hidden">
                    <span className="block group-hover:-translate-y-full transition-transform duration-400">
                      {link.label}
                    </span>
                    <span className="absolute top-full left-0 block group-hover:-translate-y-full transition-transform duration-400 text-gold">
                      {link.label}
                    </span>
                  </span>
                </a>
              );
            })}
          </div>

          {/* Column 3-4 - CTA */}
          <div className="col-span-2 lg:text-right">
            <a
              href={footerConfig.ctaHref}
              className="inline-flex items-center gap-3 text-h5 lg:text-h4 text-white font-medium group hover:text-gold transition-colors duration-300"
            >
              {footerConfig.ctaText}
              <span className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center group-hover:border-gold group-hover:shadow-[0_0_15px_var(--gold)] transition-all duration-300">
                <ArrowUpRight className="w-5 h-5 group-hover:text-gold" />
              </span>
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div
          ref={copyrightRef}
          className="mt-20 pt-8 border-t border-white/10 flex flex-col items-center gap-6"
        >
          <EmbeddedDiamond className="w-8 h-8 opacity-80" />
          <div className="flex flex-col lg:flex-row w-full justify-between items-center gap-4">
            <p className="text-body-sm text-white/40">
              {footerConfig.copyright}
            </p>
            <p className="text-body-sm text-white/30">
              {footerConfig.tagline}
            </p>
          </div>
        </div>
        <div className="mt-4 text-center">
          <p className="text-body-sm text-white/25 tracking-wide">
            {footerConfig.developerCredit}
          </p>
        </div>
      </div>
    </footer>
  );
}
