import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { worksConfig } from '../config';

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
  const triggersRef = useRef<ScrollTrigger[]>([]);

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

        // Cards 3D flip
        cardsRef.current.forEach((card, i) => {
          if (card) {
            tl.fromTo(
              card,
              { rotateY: i % 2 === 0 ? -180 : 180, opacity: 0 },
              {
                rotateY: 0,
                opacity: 1,
                duration: 1,
                ease: 'expo.out',
              },
              `-=${0.85 - i * 0.15}`
            );
          }
        });
      },
      once: true,
    });
    triggersRef.current.push(trigger);

    // Scroll depth effect
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
    triggersRef.current.push(scrollTrigger);

    return () => {
      triggersRef.current.forEach((t) => t.kill());
      triggersRef.current = [];
    };
  }, []);

  const handleMouseMove = (
    e: React.MouseEvent<HTMLDivElement>,
    index: number
  ) => {
    if (isTouchDevice) return;

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
    if (isTouchDevice) return;

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
        style={{ perspective: '1200px' }}
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
                style={{
                  transformStyle: 'preserve-3d',
                }}
                onMouseMove={(e) => handleMouseMove(e, index)}
                onMouseEnter={() => handleMouseMove}
                onMouseLeave={() => handleMouseLeave(index)}
                onClick={() => setExpandedId(project.id)}
              >
                {/* Card content */}
                <div className="relative aspect-[3/4] overflow-hidden bg-dark-gray border border-white/5 group-hover:gold-border-glow transition-all duration-300">
                  <img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8 bg-gradient-to-t from-black via-black/80 to-transparent translate-y-8 group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
                    <p className="text-body-sm text-gold/60 mb-2 group-hover:text-gold transition-colors duration-300 transform -translate-y-4 group-hover:-translate-y-0 opacity-0 group-hover:opacity-100 transition-all">
                      {project.category}
                    </p>
                    <h3 className="text-h4 lg:text-h3 text-white font-medium mb-3 transform -translate-y-2 group-hover:-translate-y-0 transition-transform duration-500">
                      {project.title}
                    </h3>
                    <p className="text-body-sm text-white/50 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100 line-clamp-3">
                      {project.description}
                    </p>
                  </div>

                  {/* Arrow icon */}
                  <div className="absolute top-6 right-6">
                    <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-gold group-hover:text-black group-hover:scale-110 transition-all duration-300">
                      <ArrowUpRight className="w-5 h-5 text-white group-hover:text-black group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 lg:p-12 overflow-y-auto"
            onClick={() => setExpandedId(null)}
          >
            {(() => {
              const project = worksConfig.projects.find((p) => p.id === expandedId);
              if (!project) return null;
              return (
                <motion.div
                  initial={{ y: 50, scale: 0.9, opacity: 0 }}
                  animate={{ y: 0, scale: 1, opacity: 1 }}
                  exit={{ y: 20, scale: 0.95, opacity: 0 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  onClick={(e) => e.stopPropagation()}
                  className="relative w-full max-w-5xl bg-[#0a0806] border border-gold/20 rounded-xl overflow-hidden flex flex-col md:flex-row shadow-2xl"
                >
                  <button
                    onClick={() => setExpandedId(null)}
                    className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-gold hover:text-black rounded-full flex items-center justify-center text-white transition-colors backdrop-blur-md"
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
                    <h3 className="text-h3 lg:text-h2 text-white font-medium mb-6">
                      {project.title}
                    </h3>
                    <p className="text-body-lg text-white/70 leading-relaxed mb-8">
                      {project.description}
                    </p>
                    <button
                      onClick={() => setExpandedId(null)}
                      className="px-8 py-3 bg-white/10 hover:bg-gold hover:text-black hover:font-medium text-white tracking-widest rounded-sm border border-white/20 transition-all duration-300 w-fit uppercase text-sm"
                    >
                      Close
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
