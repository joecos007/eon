import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus } from 'lucide-react';
import { servicesConfig } from '../config';
import { EmbeddedDiamond } from '../components/EmbeddedDiamond';

gsap.registerPlugin(ScrollTrigger);

export function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);

  useEffect(() => {
    if (!servicesConfig.title || servicesConfig.services.length === 0) return;

    const section = sectionRef.current;
    if (!section) return;

    // Entry animation
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top 80%',
      onEnter: () => {
        const tl = gsap.timeline();

        // Title slide in
        tl.fromTo(
          titleRef.current,
          { y: 60, opacity: 0, letterSpacing: '20px' },
          {
            y: 0,
            opacity: 1,
            letterSpacing: '0px',
            duration: 0.8,
            ease: 'expo.out',
          }
        );

        // Subtitle blur
        tl.fromTo(
          subtitleRef.current,
          { filter: 'blur(15px)', opacity: 0 },
          { filter: 'blur(0)', opacity: 1, duration: 0.6, ease: 'power2.out' },
          '-=0.4'
        );

        // Service items stagger
        itemsRef.current.forEach((item, i) => {
          if (item) {
            const line = item.querySelector('.service-line');
            const number = item.querySelector('.service-number');

            if (line) {
              tl.fromTo(
                line,
                { width: 0 },
                { width: '100%', duration: 1, ease: 'expo.inOut' },
                `-=${0.8 - i * 0.2}`
              );
            }

            if (number) {
              tl.fromTo(
                number,
                { scale: 0.5, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.8, ease: 'elastic.out(1, 0.5)' },
                `-=0.7`
              );
            }

            // Animate the whole item as fallback
            tl.fromTo(
              item,
              { y: 30, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
              `-=${0.5 - i * 0.1}`
            );
          }
        });
      },
      once: true,
    });
    triggersRef.current.push(trigger);

    return () => {
      triggersRef.current.forEach((t) => { t.kill(); });
      triggersRef.current = [];
    };
  }, []);

  if (!servicesConfig.title || servicesConfig.services.length === 0) return null;

  const handleItemEnter = (index: number) => setHoveredIndex(index);
  const handleItemLeave = () => setHoveredIndex(null);
  const toggleAccordion = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative py-20 px-6 md:px-8 lg:px-16 bg-black overflow-hidden"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-20 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div>
            <h2
              ref={titleRef}
              className="text-h2 md:text-h1 lg:text-display-xl text-white font-medium mb-6"
            >
              {servicesConfig.title}
            </h2>
            <p
              ref={subtitleRef}
              className="text-body-lg text-white/60 max-w-2xl"
            >
              {servicesConfig.subtitle}
            </p>
          </div>
          <div className="hidden md:block">
            <EmbeddedDiamond className="w-16 h-16" />
          </div>
        </div>

        {/* Services accordion list */}
        <div className="space-y-0">
          {servicesConfig.services.map((service, index) => (
            <div
              key={service.id}
              ref={(el) => { itemsRef.current[index] = el; }}
              className="service-item group relative border-b border-gold/20"
              onMouseEnter={() => handleItemEnter(index)}
              onMouseLeave={handleItemLeave}
            >
              <button
                type="button"
                id={`service-button-${service.id}`}
                className="w-full py-10 flex flex-col md:flex-row md:items-center justify-between text-left cursor-pointer"
                onClick={() => toggleAccordion(index)}
                aria-expanded={expandedIndex === index}
                aria-controls={`service-panel-${service.id}`}
              >
                <div className="flex items-center gap-8 md:gap-16 z-10 w-full md:w-auto">
                  <span className="text-body text-gold/50 font-mono group-hover:text-gold transition-all duration-300">
                    {String(index + 1).padStart(2, '0')}.
                  </span>
                  <h3
                    className={`text-h4 md:text-h3 lg:text-h2 text-white font-normal transition-all duration-400 ${hoveredIndex !== null && hoveredIndex !== index
                      ? 'opacity-30'
                      : 'opacity-100'
                      } ${hoveredIndex === index
                        ? 'text-shadow-glow'
                        : ''
                      }`}
                    style={{
                      textShadow:
                        hoveredIndex === index
                          ? '0 0 30px rgba(201,165,90,0.5)'
                          : 'none',
                    }}
                  >
                    {service.title}
                  </h3>
                </div>
                <div className="text-gold/50 transition-colors duration-300 group-hover:text-gold hidden md:block">
                  {expandedIndex === index ? <Minus className="w-8 h-8" /> : <Plus className="w-8 h-8" />}
                </div>
              </button>

              {/* Accordion body expand */}
              <AnimatePresence>
                {expandedIndex === index && (
                  <motion.div
                    id={`service-panel-${service.id}`}
                    role="region"
                    aria-labelledby={`service-button-${service.id}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="overflow-hidden"
                  >
                    <div className="pb-12 pt-4 flex flex-col md:flex-row gap-8 lg:gap-16 items-start justify-between">
                      <p className="text-body-lg text-white/70 leading-relaxed md:w-1/2">
                        {service.description}
                      </p>

                      {service.image && (
                        <div className="w-full md:w-1/2 aspect-[4/3] overflow-hidden rounded-none border border-gold/20">
                          <img src={service.image} alt={service.title} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div >
    </section >
  );
}
