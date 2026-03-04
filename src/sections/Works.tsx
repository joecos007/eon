import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { worksConfig } from '../config';
import { lockScroll, unlockScroll } from '../lib/scrollLock';

gsap.registerPlugin(ScrollTrigger);

export function Works() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const isTouchDevice = (() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768 || window.matchMedia('(hover: none)').matches;
    }
    return false;
  })();
  const prefersReducedMotion = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const triggersRef = useRef<ScrollTrigger[]>([]);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    if (!worksConfig.title || worksConfig.projects.length === 0) return;

    const section = sectionRef.current;
    if (!section) return;

    // Entry animation
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top 80%',
      onEnter: () => {
        const tl = gsap.timeline();

        // Title letter animation
        if (titleRef.current) {
          const chars = titleRef.current.querySelectorAll('.char');
          tl.fromTo(
            chars,
            { scale: 0, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.6,
              stagger: 0.08,
              ease: 'elastic.out(1, 0.5)',
            }
          );
        }

        // Subtitle
        tl.fromTo(
          subtitleRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
          '-=0.3'
        );

        // Cards — simple fade-up on mobile, 3D flip on desktop
        cardsRef.current.forEach((card, i) => {
          if (card) {
            if (isTouchDevice || prefersReducedMotion) {
              tl.fromTo(
                card,
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
                `-=${0.4}`
              );
            } else {
              tl.fromTo(
                card,
                { rotateY: i % 2 === 0 ? -180 : 180, opacity: 0 },
                { rotateY: 0, opacity: 1, duration: 1, ease: 'expo.out' },
                `-=${0.85 - i * 0.15}`
              );
            }
          }
        });
      },
      once: true,
    });
    triggersRef.current.push(trigger);

    // Scroll depth effect — desktop only (skip on mobile/reduced-motion)
    if (!isTouchDevice && !prefersReducedMotion) {
      const scrollTrigger = ScrollTrigger.create({
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
        onUpdate: (self) => {
          cardsRef.current.forEach((card, i) => {
            if (card) {
              const depth = -50 + self.progress * 100;
              gsap.set(card, {
                z: depth * (i % 2 === 0 ? 1 : -1) * 0.5,
              });
            }
          });
        },
      });
      scrollTriggerRef.current = scrollTrigger;
      triggersRef.current.push(scrollTrigger);
    }

    return () => {
      triggersRef.current.forEach((t) => { t.kill(); });
      triggersRef.current = [];
    };
  }, [isTouchDevice, prefersReducedMotion]);

  // Pause scroll depth effect when modal is open; lock body scroll
  useEffect(() => {
    if (expandedId !== null) {
      scrollTriggerRef.current?.disable();
      lockScroll();
      return () => {
        scrollTriggerRef.current?.enable();
        unlockScroll();
      };
    }
  }, [expandedId]);

  const handleMouseMove = (
    e: React.MouseEvent<HTMLDivElement>,
    index: number
  ) => {
    if (isTouchDevice || prefersReducedMotion || expandedId !== null) return;

    const card = cardsRef.current[index];
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(card, {
      rotateX: -y * 10,
      rotateY: x * 16,
      duration: 0.1,
      ease: 'none',
    });
  };

  const handleMouseLeave = (index: number) => {
    if (isTouchDevice || prefersReducedMotion || expandedId !== null) return;

    const card = cardsRef.current[index];
    if (!card) return;

    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.4,
      ease: 'expo.out',
    });
  };

  if (!worksConfig.title || worksConfig.projects.length === 0) return null;

  const titleChars = worksConfig.title.split('');

  return (
    <>
      <section
        ref={sectionRef}
        id="works"
        className="relative py-20 md:py-32 px-6 md:px-8 lg:px-16 bg-[#0d0b08] overflow-hidden"
        style={(isTouchDevice || prefersReducedMotion) ? undefined : { perspective: '1200px' }}
      >
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-16 relative">
          <h2
            ref={titleRef}
            className="text-h2 md:text-h1 lg:text-display-xl text-white font-medium mb-6 relative z-10"
          >
            {titleChars.map((char, i) => (
              <span key={i} className="char inline-block">
                {char}
              </span>
            ))}
          </h2>
          <p
            ref={subtitleRef}
            className="text-body-lg text-white/60 max-w-2xl relative z-10"
          >
            {worksConfig.subtitle}
          </p>
          <div className="absolute -bottom-8 left-0 w-24 h-px bg-gold/40 z-10" />
        </div>

        {/* Projects Grid - Scattered mosaic */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {worksConfig.projects.map((project, index) => (
              <div
                key={project.id}
                ref={(el) => {
                  cardsRef.current[index] = el;
                }}
                className={`relative group cursor-pointer ${index === 0 ? 'md:col-span-1 md:row-span-1' : ''
                  } ${index % 2 === 0 ? 'md:-translate-y-8' : 'md:translate-y-8'}`}
                style={(isTouchDevice || prefersReducedMotion) ? undefined : { transformStyle: 'preserve-3d' }}
                onMouseMove={(e) => handleMouseMove(e, index)}
                onMouseLeave={() => handleMouseLeave(index)}
                onClick={() => setExpandedId(project.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setExpandedId(project.id);
                  }
                }}
              >
                {/* Card content */}
                <div className="relative aspect-[3/4] overflow-hidden bg-dark-gray border border-white/5 group-hover:gold-border-glow transition-[border-color,box-shadow] duration-300 motion-reduce:transition-none">
                  <img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-[transform,filter] duration-500 group-hover:scale-110 group-hover:brightness-110 motion-reduce:transition-none motion-reduce:transform-none"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300 motion-reduce:transition-none" />

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8 bg-gradient-to-t from-black via-black/80 to-transparent translate-y-8 group-hover:translate-y-0 transition-transform duration-500 motion-reduce:transition-none motion-reduce:translate-y-0" style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}>
                    <p className="text-body-sm text-gold/60 mb-2 group-hover:text-gold transition-[color,opacity,transform] duration-300 transform -translate-y-4 group-hover:-translate-y-0 opacity-0 group-hover:opacity-100 motion-reduce:transition-none motion-reduce:translate-y-0 motion-reduce:opacity-100">
                      {project.category}
                    </p>
                    <h3 className="text-h4 lg:text-h3 text-white font-medium mb-3 transform -translate-y-2 group-hover:-translate-y-0 transition-transform duration-500 motion-reduce:transition-none motion-reduce:translate-y-0">
                      {project.title}
                    </h3>
                    <p className="text-body-sm text-white/50 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-[opacity,transform] duration-500 delay-100 line-clamp-3 motion-reduce:transition-none motion-reduce:translate-y-0 motion-reduce:opacity-100">
                      {project.description}
                    </p>
                  </div>

                  {/* Arrow icon */}
                  <div className="absolute top-6 right-6">
                    <div className="w-12 h-12 rounded-none bg-white/10 flex items-center justify-center group-hover:bg-gold group-hover:text-black group-hover:scale-110 transition-[background-color,color,transform] duration-300 motion-reduce:transition-none motion-reduce:transform-none">
                      <ArrowUpRight className="w-5 h-5 text-white group-hover:text-black group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300 motion-reduce:transition-none motion-reduce:transform-none" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-0 w-32 h-32 bg-gold/5 -translate-x-1/2 blur-2xl" />
        <div className="absolute bottom-20 right-0 w-48 h-48 bg-gold/5 translate-x-1/3 blur-3xl opacity-50" />
      </section>

      {/* Expanded Project Modal */}
      <AnimatePresence>
        {expandedId !== null && (
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2, ease: 'easeOut' }}
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center p-4 lg:p-12 overflow-y-auto"
            onClick={() => setExpandedId(null)}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`work-modal-title-${expandedId}`}
          >
            {(() => {
              const project = worksConfig.projects.find((p) => p.id === expandedId);
              if (!project) return null;
              return (
                <motion.div
                  initial={prefersReducedMotion ? false : { y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={prefersReducedMotion ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                  transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3, ease: 'easeOut', delay: 0.15 }}
                  onClick={(e) => e.stopPropagation()}
                  className="relative w-full max-w-5xl bg-[#0a0806] border border-gold/20 rounded-none overflow-hidden flex flex-col md:flex-row shadow-2xl"
                >
                  <button
                    onClick={() => setExpandedId(null)}
                    aria-label={worksConfig.closeProjectLabel}
                    className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/70 hover:bg-gold hover:text-black rounded-none flex items-center justify-center text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <div className="w-full md:w-1/2 h-[40vh] md:h-auto relative">
                    <img
                      src={project.image}
                      alt={project.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0a0806] to-transparent pointer-events-none" />
                  </div>
                  <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                    <span className="text-gold tracking-widest uppercase text-sm mb-4">
                      {project.category}
                    </span>
                    <h3 id={`work-modal-title-${project.id}`} className="text-h3 lg:text-h2 text-white font-medium mb-6">
                      {project.title}
                    </h3>
                    <p className="text-body-lg text-white/70 leading-relaxed mb-8">
                      {project.description}
                    </p>
                    <button
                      onClick={() => setExpandedId(null)}
                      className="px-8 py-3 bg-white/10 hover:bg-gold hover:text-black hover:font-medium text-white tracking-widest rounded-none border border-white/20 transition-[background-color,color,border-color] duration-300 w-fit uppercase text-sm"
                    >
                      {worksConfig.closeProjectLabel}
                    </button>
                  </div>
                </motion.div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
