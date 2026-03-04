import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Quote, Star } from 'lucide-react';
import { testimonialsConfig } from '../config';

gsap.registerPlugin(ScrollTrigger);

export function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const triggersRef = useRef<ScrollTrigger[]>([]);
  const isTouchDevice = typeof window !== 'undefined'
    && (window.innerWidth < 768 || window.matchMedia('(hover: none)').matches);
  const prefersReducedMotion = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (!testimonialsConfig.title || testimonialsConfig.testimonials.length === 0) return;

    const section = sectionRef.current;
    if (!section) return;

    // Entry animation
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top 80%',
      onEnter: () => {
        const tl = gsap.timeline();

        // Title letter expand
        tl.fromTo(
          titleRef.current,
          { letterSpacing: '10px', opacity: 0 },
          { letterSpacing: '0px', opacity: 1, duration: 0.8, ease: 'expo.out' }
        );

        // Cards entry — simple fade-up on mobile, 3D rise on desktop
        cardsRef.current.forEach((card, i) => {
          if (card) {
            tl.fromTo(
              card,
              (isTouchDevice || prefersReducedMotion)
                ? { y: 40, opacity: 0 }
                : { y: 100, z: -50, rotateX: 15, opacity: 0 },
              (isTouchDevice || prefersReducedMotion)
                ? { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }
                : { y: 0, z: 0, rotateX: 0, opacity: 1, duration: 1, ease: 'expo.out' },
              `-=${0.8 - i * 0.2}`
            );

            // Avatar pop — skip elastic on reduced-motion
            const avatar = card.querySelector('.avatar');
            if (avatar) {
              tl.fromTo(
                avatar,
                { scale: 0 },
                prefersReducedMotion
                  ? { scale: 1, duration: 0.01 }
                  : { scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.5)' },
                '-=0.7'
              );
            }

            // Quote mark fade — instant on reduced-motion
            const quoteMark = card.querySelector('.quote-mark');
            if (quoteMark) {
              tl.fromTo(
                quoteMark,
                { scale: 0.5, opacity: 0 },
                prefersReducedMotion
                  ? { scale: 1, opacity: 0.3, duration: 0.01 }
                  : { scale: 1, opacity: 0.3, duration: 0.4, ease: 'power2.out' },
                '-=0.4'
              );
            }
          }
        });
      },
      once: true,
    });
    triggersRef.current.push(trigger);

    // Sticky card stacking scroll effect — skip on mobile/reduced-motion
    if (!isTouchDevice && !prefersReducedMotion) {
      const scrollTrigger = ScrollTrigger.create({
        trigger: section,
        start: 'top 20%',
        end: 'bottom bottom',
        scrub: 1,
        onUpdate: (self) => {
          cardsRef.current.forEach((card, i) => {
            if (card) {
              const progress = Math.min(1, Math.max(0, self.progress * 3 - i * 0.3));
              const shadow = 10 + progress * 20;
              const scale = 1 + progress * 0.02;

              gsap.set(card, {
                boxShadow: `0 ${shadow}px ${shadow * 2}px rgba(0,0,0,${0.2 + progress * 0.2})`,
                scale: scale,
              });
            }
          });
        },
      });
      triggersRef.current.push(scrollTrigger);
    }

    return () => {
      triggersRef.current.forEach((t) => { t.kill(); });
      triggersRef.current = [];
    };
  }, [isTouchDevice, prefersReducedMotion]);

  if (!testimonialsConfig.title || testimonialsConfig.testimonials.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="relative py-20 md:py-32 px-6 md:px-8 lg:px-16 bg-gradient-to-b from-dark-gray to-black overflow-hidden"
      style={(isTouchDevice || prefersReducedMotion) ? undefined : { perspective: '1200px' }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section title */}
        <h2
          ref={titleRef}
          className="text-h2 md:text-h1 lg:text-display-xl text-white font-medium text-center mb-12 md:mb-20"
        >
          {testimonialsConfig.title}
        </h2>

        {/* Testimonial cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {testimonialsConfig.testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              className="testimonial-card relative w-full min-h-[400px] h-auto mb-8 lg:mb-12 luxury-glass rounded-none p-8 lg:p-12 flex flex-col justify-between hover-lift group border border-gold/10 hover:border-gold/20 hover:shadow-[0_0_30px_rgba(201,165,90,0.1)] transition-all duration-500 motion-reduce:transition-none motion-reduce:transform-none"
              style={{
                top: `${index * 40}px`,
                zIndex: index,
              }}
            >
              {/* Quote Icon */}
              <div className="absolute top-8 right-8 lg:top-12 lg:right-12 text-gold/20">
                <Quote className="w-16 h-16 lg:w-24 lg:h-24 opacity-50 drop-shadow-[0_0_10px_rgba(201,165,90,0.5)]" />
              </div>

              {/* Content */}
              <div className="relative z-10 flex flex-col justify-between h-full">
                {/* 5 Stars */}
                <div>
                  <div className="flex gap-1 mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-gold text-gold" />
                    ))}
                  </div>
                  <p className="text-body lg:text-body-lg font-light text-white/80 leading-relaxed max-w-3xl italic">
                    "{testimonial.quote}"
                  </p>
                </div>

                {/* Author */}
                <div className="flex items-center gap-6 mt-12">
                  <div className="avatar-wrapper relative w-16 h-16 rounded-none overflow-hidden border border-gold/40 shadow-[0_0_15px_rgba(201,165,90,0.2)] flex-shrink-0">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div>
                    <h4 className="text-body text-white font-medium">
                      {testimonial.name}
                    </h4>
                    <p className="text-body-sm text-white/50">
                      {testimonial.title}
                    </p>
                  </div>
                </div>
              </div>

              {/* Hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-none overflow-hidden motion-reduce:transition-none">
                <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
