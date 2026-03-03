import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { servicesConfig } from '../config';

gsap.registerPlugin(ScrollTrigger);

export function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const imageRef = useRef<HTMLDivElement>(null);
  const imagePreviewRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsTouchDevice(window.matchMedia('(hover: none)').matches);
    }
  }, []);
  const mousePos = useRef({ x: 0, y: 0 });
  const triggersRef = useRef<ScrollTrigger[]>([]);

  if (!servicesConfig.title || servicesConfig.services.length === 0) return null;

  useEffect(() => {
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
      triggersRef.current.forEach((t) => t.kill());
      triggersRef.current = [];
    };
  }, []);

  // Custom cursor follow for image preview
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (isTouchDevice) return;
    if (!imagePreviewRef.current) return;
    const section = sectionRef.current;
    if (!section || !imageRef.current) return;

    const rect = section.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mousePos.current = { x, y };

    gsap.to(imageRef.current, {
      x: x - 150,
      y: y - 200,
      duration: 0.15,
      ease: 'power2.out',
    });
  };

  const handleItemEnter = (index: number) => {
    if (isTouchDevice) return;
    setActiveIndex(index);
    if (imageRef.current) {
      gsap.to(imageRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: 'expo.out',
      });
    }
  };

  const handleItemLeave = () => {
    setActiveIndex(null);
    if (imageRef.current) {
      gsap.to(imageRef.current, {
        opacity: 0,
        scale: 0.9,
        duration: 0.4,
        ease: 'power2.out',
      });
    }
  };

  const services = servicesConfig.services;

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative py-20 md:py-32 px-6 md:px-8 lg:px-16 bg-black overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Floating image preview */}
      <div
        ref={imagePreviewRef}
        className="preview-container fixed top-0 left-0 w-[400px] aspect-[4/5] pointer-events-none z-50 overflow-hidden rounded-sm border border-gold/30 gold-border-glow shadow-2xl"
        style={{ opacity: 0, transform: 'scale(0.8) translate(-50%, -50%)', display: 'none' }}
      >
        {activeIndex !== null && (
          <img
            src={services[activeIndex].image}
            alt={services[activeIndex].title}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-20">
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

        {/* Services list */}
        <div className="space-y-0">
          {servicesConfig.services.map((service, index) => (
            <div
              key={index}
              ref={(el) => { itemsRef.current[index] = el; }} // Keep ref for potential future animations
              className="service-item group relative py-12 border-b border-gold/20 flex flex-col md:flex-row md:items-center justify-between cursor-pointer"
              onMouseEnter={() => handleItemEnter(index)}
              onMouseLeave={handleItemLeave}
            >
              {/* Service number & title */}
              <div className="flex items-center gap-8 md:gap-16 mb-6 md:mb-0 z-10">
                <span className="text-body text-gold/50 font-mono group-hover:text-gold group-hover:text-shadow-glow transition-all duration-300">
                  {String(index + 1).padStart(2, '0')}.
                </span>
                <h3
                  className={`text-h4 md:text-h3 lg:text-h2 text-white font-normal transition-all duration-400 ${activeIndex !== null && activeIndex !== index
                    ? 'opacity-30'
                    : 'opacity-100'
                    } ${activeIndex === index
                      ? 'text-shadow-glow'
                      : ''
                    }`}
                  style={{
                    textShadow:
                      activeIndex === index
                        ? '0 0 30px rgba(201,165,90,0.5)'
                        : 'none',
                  }}
                >
                  {service.title}
                </h3>
              </div>

              {/* Description */}
              <p
                className={`mt-4 lg:mt-0 text-body-sm md:text-body text-white/60 lg:text-white/40 lg:max-w-xs lg:text-right transition-opacity duration-300 ${activeIndex !== null && activeIndex !== index
                  ? 'lg:opacity-30'
                  : 'opacity-100'
                  }`}
              >
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div >
    </section >
  );
}
