import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Clock, Calendar, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { blogConfig } from '../config';

gsap.registerPlugin(ScrollTrigger);

export function Blog() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const postsRef = useRef<(HTMLDivElement | null)[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const buttonBoundsRef = useRef<DOMRect | null>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const timeoutIdsRef = useRef<number[]>([]);

  useEffect(() => {
    if (!blogConfig.title || blogConfig.posts.length === 0) return;
    const section = sectionRef.current;
    if (!section) return;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top 80%',
      onEnter: () => {
        const tl = gsap.timeline();

        // Title typewriter effect
        if (titleRef.current) {
          const text = titleRef.current.textContent || '';
          titleRef.current.textContent = '';
          titleRef.current.style.opacity = '1';

          text.split('').forEach((char, i) => {
            const id = window.setTimeout(() => {
              if (titleRef.current) {
                titleRef.current.textContent += char;
              }
            }, i * 60);
            timeoutIdsRef.current.push(id);
          });
        }

        // Description fade
        if (descRef.current) {
          tl.fromTo(
            descRef.current,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
            0.8
          );
        }

        // Posts clip reveal
        postsRef.current.forEach((post, i) => {
          if (post) {
            const image = post.querySelector('.post-image');
            const content = post.querySelector('.post-content');

            if (image) {
              tl.fromTo(
                image,
                {
                  clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)',
                },
                {
                  clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
                  duration: 1,
                  ease: 'expo.out',
                },
                1 + i * 0.2
              );
            }

            if (content) {
              tl.fromTo(
                content,
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
                `-=0.6`
              );
            }
          }
        });

        // Button slide in
        if (buttonRef.current) {
          tl.fromTo(
            buttonRef.current,
            { x: 50, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' },
            '-=0.3'
          );
        }
      },
      once: true,
    });
    triggersRef.current.push(trigger);

    return () => {
      timeoutIdsRef.current.forEach((id) => clearTimeout(id));
      timeoutIdsRef.current = [];
      triggersRef.current.forEach((t) => t.kill());
      triggersRef.current = [];
    };
  }, []);

  const handleButtonMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
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

  if (!blogConfig.title || blogConfig.posts.length === 0) return null;

  return (
    <>
      <section
        ref={sectionRef}
        id="blog"
        className="relative py-20 md:py-32 px-6 md:px-8 lg:px-16 bg-black overflow-hidden"
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16">
            <div>
              <h2
                ref={titleRef}
                className="text-h2 md:text-h1 lg:text-display-xl text-white font-medium mb-4 opacity-0"
              >
                {blogConfig.title}
              </h2>
              <p
                ref={descRef}
                className="text-body-lg text-white/60 max-w-xl"
              >
                {blogConfig.subtitle}
              </p>
            </div>

            <button
              ref={buttonRef}
              onMouseMove={handleButtonMouseMove}
              onMouseLeave={handleButtonMouseLeave}
              className="hidden lg:flex items-center gap-2 text-body text-white/60 hover:text-white transition-colors duration-300 mt-8 lg:mt-0 group px-6 py-3 rounded-full border border-white/10 hover:border-gold/30 hover:bg-gold/5"
            >
              {blogConfig.allPostsLabel}
              <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
            </button>
          </div>

          {/* Blog posts grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {blogConfig.posts.map((post, index) => (
              <div
                key={post.id}
                ref={(el) => {
                  postsRef.current[index] = el;
                }}
                className="group cursor-pointer"
                onClick={() => setExpandedId(post.id)}
              >
                {/* Image */}
                <div className="post-image relative aspect-[4/3] overflow-hidden bg-dark-gray border border-gold/10 group-hover:border-gold/30 transition-colors duration-500 mb-6">
                  <img
                    src={post.image}
                    alt={post.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Category tag */}
                  <div className="absolute top-6 left-6 px-4 py-1.5 bg-black/60 backdrop-blur-md text-gold text-body-sm font-medium rounded-full border border-gold/20">
                    <span className="text-body-sm text-white">
                      {post.category}
                    </span>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-gold/0 to-gold/0 group-hover:from-gold/5 group-hover:to-gold/10 transition-colors duration-500 rounded-lg pointer-events-none" />
                </div>

                {/* Content */}
                <div className="post-content">
                  {/* Meta */}
                  <div className="flex items-center gap-6 mb-4 text-body-sm text-white/50">
                    <span className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gold/60" />
                      {blogConfig.readTimePrefix}{post.readTime}
                    </span>
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gold/60" />
                      {post.date}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-h4 lg:text-h3 text-white font-medium mb-3 group-hover:text-gold transition-colors duration-300 relative">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-body text-white/60 leading-relaxed mb-6">
                    {post.excerpt}
                  </p>

                  {/* Read more */}
                  <div className="inline-flex items-center text-body font-medium text-white group-hover:text-gold transition-colors duration-300">
                    {blogConfig.readMoreLabel}
                    <span className="ml-2 w-0 h-px bg-gold group-hover:w-8 transition-all duration-300" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Expanded Blog Modal */}
      <AnimatePresence>
        {expandedId !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-8 lg:p-16 overflow-y-auto"
            onClick={() => setExpandedId(null)}
          >
            {(() => {
              const post = blogConfig.posts.find(p => p.id === expandedId);
              if (!post) return null;
              return (
                <motion.div
                  initial={{ y: 50, scale: 0.95, opacity: 0 }}
                  animate={{ y: 0, scale: 1, opacity: 1 }}
                  exit={{ y: 20, scale: 0.95, opacity: 0 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  onClick={(e) => e.stopPropagation()}
                  className="relative w-full max-w-4xl bg-[#0a0806] border border-gold/10 rounded-2xl overflow-hidden shadow-2xl mx-auto my-auto"
                >
                  <button
                    onClick={() => setExpandedId(null)}
                    className="absolute top-4 right-4 md:top-6 md:right-6 z-10 w-12 h-12 bg-black/30 hover:bg-gold hover:text-black rounded-full flex items-center justify-center text-white transition-all backdrop-blur-md"
                  >
                    <X className="w-6 h-6" />
                  </button>

                  <div className="w-full h-[30vh] md:h-[45vh] relative block">
                    <img src={post.image} alt={post.title} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0806] via-[#0a0806]/60 to-transparent pointer-events-none" />
                    <div className="absolute bottom-6 left-6 md:bottom-12 md:left-12 flex items-center gap-6 text-body-sm text-gold/80">
                      <span className="flex items-center gap-2 bg-black/50 px-3 py-1.5 rounded-full border border-gold/20 backdrop-blur-md">
                        <Clock className="w-4 h-4" />
                        {blogConfig.readTimePrefix}{post.readTime}
                      </span>
                      <span className="flex items-center gap-2 bg-black/50 px-3 py-1.5 rounded-full border border-gold/20 backdrop-blur-md">
                        <Calendar className="w-4 h-4" />
                        {post.date}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 md:p-12">
                    <span className="text-gold tracking-widest uppercase text-sm mb-4 block">
                      {post.category}
                    </span>
                    <h3 className="text-h3 lg:text-h2 text-white font-medium mb-8 leading-tight">
                      {post.title}
                    </h3>
                    <div className="space-y-6">
                      <p className="text-body-lg text-white/80 leading-relaxed font-light first-letter:float-left first-letter:text-6xl first-letter:pr-4 first-letter:text-gold first-letter:font-medium">
                        {post.excerpt}
                      </p>
                      {post.content.map((paragraph, idx) => (
                        <p key={idx} className="text-body text-white/60 leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>

                    <div className="mt-12 pt-8 border-t border-white/10 flex justify-between items-center">
                      <button
                        onClick={() => setExpandedId(null)}
                        className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white tracking-widest rounded-sm border border-white/10 transition-all uppercase text-sm"
                      >
                        Close
                      </button>
                    </div>
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
