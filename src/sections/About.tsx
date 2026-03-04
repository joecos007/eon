import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { aboutConfig } from '../config';
import { EmbeddedDiamond } from '../components/EmbeddedDiamond';

gsap.registerPlugin(ScrollTrigger);

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const image1Ref = useRef<HTMLDivElement>(null);

  const authorImageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const authorTextRef = useRef<HTMLDivElement>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);

  useEffect(() => {
    if (!aboutConfig.titleLine1) return;

    const section = sectionRef.current;
    if (!section) return;

    // Entry animations
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top 80%',
      onEnter: () => {
        const tl = gsap.timeline();

        // Image 1 clip reveal
        tl.fromTo(
          image1Ref.current,
          { clipPath: 'inset(100% 0 0 0)', scale: 1.1 },
          {
            clipPath: 'inset(0% 0 0 0)',
            scale: 1,
            duration: 1.2,
            ease: 'expo.out',
          }
        );

        // Title lines reveal
        if (titleRef.current) {
          const lines = titleRef.current.querySelectorAll('.title-line');
          tl.fromTo(
            lines,
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              stagger: 0.2,
              ease: 'back.out(1.7)',
            },
            '-=0.8'
          );
        }

        // Text fade up
        tl.fromTo(
          textRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' },
          '-=0.4'
        );

        // Red accent line
        tl.fromTo(
          lineRef.current,
          { width: 0 },
          { width: '120%', duration: 1, ease: 'expo.inOut' },
          '-=0.6'
        );

        // Author image
        tl.fromTo(
          authorImageRef.current,
          { scale: 0.9, rotate: -3, opacity: 0 },
          {
            scale: 1,
            rotate: 0,
            opacity: 1,
            duration: 0.9,
            ease: 'elastic.out(1, 0.5)',
          },
          '-=0.7'
        );

        // Author text words
        if (authorTextRef.current) {
          const words = authorTextRef.current.querySelectorAll('.word');
          tl.fromTo(
            words,
            { y: 15, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              stagger: 0.05,
              ease: 'power2.out',
            },
            '-=0.5'
          );
        }
      },
      once: true,
    });
    triggersRef.current.push(trigger);

    // Parallax on scroll
    const parallaxTrigger = ScrollTrigger.create({
      trigger: section,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1,
      onUpdate: (self) => {
        if (image1Ref.current) {
          gsap.set(image1Ref.current, {
            y: 50 - self.progress * 100,
          });
        }
        if (authorImageRef.current) {
          gsap.set(authorImageRef.current, {
            y: 30 - self.progress * 60,
          });
        }
        if (textRef.current) {
          gsap.set(textRef.current, {
            y: 20 - self.progress * 40,
          });
        }
      },
    });
    triggersRef.current.push(parallaxTrigger);

    return () => {
      triggersRef.current.forEach((t) => t.kill());
      triggersRef.current = [];
    };
  }, []);

  if (!aboutConfig.titleLine1) return null;

  const authorWords = aboutConfig.authorBio.split(' ');

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!sectionRef.current) return;
    const { left, top } = sectionRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    sectionRef.current.style.setProperty("--mouse-x", `${x}px`);
    sectionRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <section
      ref={sectionRef}
      id="about"
      onMouseMove={handleMouseMove}
      className="relative py-20 md:py-32 px-6 md:px-8 lg:px-16 overflow-hidden group/section"
      style={{ isolation: 'isolate' }}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0806] to-black z-0" />

      {/* Interactive flashlight layer */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-0 group-hover/section:opacity-100 transition-opacity duration-500"
        style={{
          background: "radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(201, 165, 90, 0.05), transparent 40%)"
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left column - Image */}
          <div className="lg:col-span-5 relative">
            <div
              ref={image1Ref}
              className="relative w-full h-[600px] lg:h-full min-h-[500px] overflow-hidden rounded-sm group cursor-pointer"
            >
              <img
                src={aboutConfig.image1}
                alt={aboutConfig.image1Alt}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </div>
          </div>

          {/* Right column - Content */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Section title */}
            <h2
              ref={titleRef}
              className="text-h3 lg:text-h2 text-white font-normal leading-tight mb-8"
            >
              <span className="title-line block relative">
                <span className="text-gold absolute -left-8 -top-4 opacity-40">✦</span>
                {aboutConfig.titleLine1}
              </span>
              <span className="title-line block">
                {aboutConfig.titleLine2}
              </span>
            </h2>

            {/* Custom line art and Embedded Diamond */}
            <div className="relative mb-12 flex items-center h-12">
              <div
                ref={lineRef}
                className="absolute left-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent z-0"
                style={{ top: '50%' }}
              />
              <div className="absolute right-12 z-10 transform translate-x-1/2">
                <EmbeddedDiamond className="w-10 h-10" />
              </div>
            </div>

            {/* About text */}
            <div ref={textRef} className="mb-12 space-y-6">
              {aboutConfig.description.split(/(?<=\.)\s+(?=[A-Z])/).map((paragraph, index) => (
                <p key={index} className="text-body-lg text-white/70 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Author section */}
            <div className="flex items-start gap-6">
              {/* Author image */}
              <div
                ref={authorImageRef}
                className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-full border border-gold/40 relative group cursor-pointer"
              >
                <img
                  src={aboutConfig.authorImage}
                  alt={aboutConfig.authorName}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover filter blur-[2px] opacity-90 group-hover:blur-0 group-hover:opacity-100 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gold/20 mix-blend-overlay group-hover:opacity-0 transition-opacity duration-700"></div>
              </div>

              {/* Author text */}
              <div ref={authorTextRef} className="text-body text-white/60">
                {authorWords.map((word, i) => (
                  <span key={i} className="word inline">
                    {word}{i < authorWords.length - 1 ? ' ' : ''}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
