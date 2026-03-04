import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Send } from 'lucide-react';
import { contactConfig } from '../config';

gsap.registerPlugin(ScrollTrigger);

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const inputsRef = useRef<(HTMLDivElement | null)[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: '',
    message: '',
  });
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    if (!contactConfig.title) return;

    const section = sectionRef.current;
    if (!section) return;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top 80%',
      onEnter: () => {
        const tl = gsap.timeline();

        // Diagonal divider line draw
        tl.fromTo(
          dividerRef.current,
          { height: 0 },
          { height: '100%', duration: 1.2, ease: 'expo.inOut' }
        );

        // Form container slide
        tl.fromTo(
          formRef.current,
          { x: -60, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.8, ease: 'expo.out' },
          '-=0.8'
        );

        // Image reveal
        tl.fromTo(
          imageRef.current,
          {
            scale: 1.1,
            clipPath: 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)',
          },
          {
            scale: 1,
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
            duration: 1,
            ease: 'expo.out',
          },
          '-=0.6'
        );

        // Title letter cascade
        if (titleRef.current) {
          const chars = titleRef.current.querySelectorAll('.char');
          tl.fromTo(
            chars,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.03,
              ease: 'power2.out',
            },
            '-=0.7'
          );
        }

        // Subtitle
        tl.fromTo(
          subtitleRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
          '-=0.5'
        );

        // Input fields stagger
        inputsRef.current.forEach((input, i) => {
          if (input) {
            tl.fromTo(
              input,
              { y: 30, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
              `-=${0.4 - i * 0.1}`
            );
          }
        });

        // Submit button bounce
        tl.fromTo(
          buttonRef.current,
          { scale: 0 },
          { scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.5)' },
          '-=0.3'
        );
      },
      once: true,
    });
    triggersRef.current.push(trigger);

    // Image parallax
    const parallaxTrigger = ScrollTrigger.create({
      trigger: section,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1,
      onUpdate: (self) => {
        if (imageRef.current) {
          gsap.set(imageRef.current, {
            y: -30 + self.progress * 60,
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!contactConfig.title) return null;

  const titleWords = contactConfig.title.split(' ');

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative py-20 md:py-32 px-6 md:px-8 lg:px-16 bg-black overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 lg:gap-20 relative">
          {/* Diagonal divider */}
          <div
            ref={dividerRef}
            className="hidden lg:block absolute left-1/2 top-0 w-px bg-gold/20"
            style={{
              transform: 'rotate(12deg) translateX(-50%)',
              transformOrigin: 'top center',
            }}
          />

          {/* Form side */}
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="relative z-10"
          >
            {/* Title — split by words to prevent mid-word breaks */}
            <h2
              ref={titleRef}
              className="text-h2 lg:text-h1 text-white font-medium mb-4 leading-tight"
            >
              {titleWords.map((word, wi) => (
                <span key={wi} className="inline-block mr-[0.3em]">
                  {word.split('').map((char, ci) => (
                    <span key={ci} className="char inline-block">
                      {char}
                    </span>
                  ))}
                </span>
              ))}
            </h2>

            {/* Subtitle */}
            <p
              ref={subtitleRef}
              className="text-body-lg text-white/60 mb-10 max-w-md"
            >
              {contactConfig.subtitle}
            </p>

            {/* Form fields */}
            <div className="space-y-6">
              {/* Name */}
              <div
                ref={(el) => {
                  inputsRef.current[0] = el;
                }}
                className="relative"
              >
                <label
                  className={`block text-body-sm font-medium mb-2 transition-colors duration-200 ${focusedField === 'name' ? 'text-gold' : 'text-white/50'
                    }`}
                >
                  {contactConfig.nameLabel}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Your full name"
                  className={`w-full bg-white/5 border px-4 py-3 text-white placeholder:text-white/25 focus:outline-none transition-all duration-300 ${focusedField === 'name'
                    ? 'border-gold bg-white/8'
                    : 'border-white/15 hover:border-white/30'
                    }`}
                  required
                />
              </div>

              {/* Email */}
              <div
                ref={(el) => {
                  inputsRef.current[1] = el;
                }}
                className="relative"
              >
                <label
                  className={`block text-body-sm font-medium mb-2 transition-colors duration-200 ${focusedField === 'email' ? 'text-gold' : 'text-white/50'
                    }`}
                >
                  {contactConfig.emailLabel}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="your@email.com"
                  className={`w-full bg-white/5 border px-4 py-3 text-white placeholder:text-white/25 focus:outline-none transition-all duration-300 ${focusedField === 'email'
                    ? 'border-gold bg-white/8'
                    : 'border-white/15 hover:border-white/30'
                    }`}
                  required
                />
              </div>

              {/* Project Type */}
              <div
                ref={(el) => {
                  inputsRef.current[2] = el;
                }}
                className="relative"
              >
                <label
                  className={`block text-body-sm font-medium mb-2 transition-colors duration-200 ${focusedField === 'projectType' ? 'text-gold' : 'text-white/50'
                    }`}
                >
                  {contactConfig.projectTypeLabel}
                </label>
                <div className="relative">
                  <select
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('projectType')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full bg-white/5 border px-4 py-3 text-white focus:outline-none transition-all duration-300 appearance-none cursor-pointer ${focusedField === 'projectType'
                      ? 'border-gold bg-white/8'
                      : 'border-white/15 hover:border-white/30'
                      } ${!formData.projectType ? 'text-white/25' : ''}`}
                  >
                    <option value="" className="bg-black text-white/50">
                      {contactConfig.projectTypePlaceholder}
                    </option>
                    {contactConfig.projectTypeOptions.map((option) => (
                      <option key={option.value} value={option.value} className="bg-black text-white">
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {/* Custom dropdown arrow */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                      <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" className="text-white/40" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div
                ref={(el) => {
                  inputsRef.current[3] = el;
                }}
                className="relative"
              >
                <label
                  className={`block text-body-sm font-medium mb-2 transition-colors duration-200 ${focusedField === 'message' ? 'text-gold' : 'text-white/50'
                    }`}
                >
                  {contactConfig.messageLabel}
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('message')}
                  onBlur={() => setFocusedField(null)}
                  rows={4}
                  placeholder="Describe your vision..."
                  className={`w-full bg-white/5 border px-4 py-3 text-white placeholder:text-white/25 focus:outline-none transition-all duration-300 resize-none ${focusedField === 'message'
                    ? 'border-gold bg-white/8'
                    : 'border-white/15 hover:border-white/30'
                    }`}
                />
              </div>
            </div>

            {/* Submit button */}
            <button
              ref={buttonRef}
              type="submit"
              className="mt-10 px-10 py-4 bg-gold text-black text-body font-semibold flex items-center gap-3 transition-all duration-300 relative overflow-hidden group hover:shadow-[0_0_30px_rgba(201,165,90,0.3)]"
            >
              <span className="relative z-10">{contactConfig.submitButtonText}</span>
              <Send className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gold-light transform -translate-x-full group-hover:translate-x-0 transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]" />
            </button>
          </form>

          {/* Image side */}
          <div
            ref={imageRef}
            className="relative aspect-[3/4] lg:aspect-auto overflow-hidden"
          >
            <img
              src={contactConfig.image}
              alt="Contact"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />

            {/* Decorative blocks */}
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gold/20" />
            <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/5" />
          </div>
        </div>
      </div>
    </section>
  );
}
