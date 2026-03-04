import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Plus } from 'lucide-react';
import { faqConfig } from '../config';

gsap.registerPlugin(ScrollTrigger);

export function FAQ() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);

  useEffect(() => {
    if (!faqConfig.title || faqConfig.faqs.length === 0) return;
    const section = sectionRef.current;
    if (!section) return;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top 80%',
      onEnter: () => {
        const tl = gsap.timeline();

        // Title scale in
        tl.fromTo(
          titleRef.current,
          { scale: 0.9, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.7, ease: 'expo.out' }
        );

        // FAQ items stagger from alternating sides
        itemsRef.current.forEach((item, i) => {
          if (item) {
            const fromX = i % 2 === 0 ? -60 : 60;
            tl.fromTo(
              item,
              { x: fromX, opacity: 0 },
              { x: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
              `-=0.5`
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

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (!faqConfig.title || faqConfig.faqs.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      id="faq"
      className="relative py-20 md:py-32 px-6 md:px-8 lg:px-16 bg-black overflow-hidden"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section title */}
        <h2
          ref={titleRef}
          className="text-h2 md:text-h1 lg:text-display-xl text-white font-medium text-center mb-12 md:mb-20"
        >
          {faqConfig.title}
        </h2>

        {/* FAQ items */}
        <div className="space-y-0">
          {faqConfig.faqs.map((faq, index) => (
            <div
              key={index}
              ref={(el) => {
                itemsRef.current[index] = el;
              }}
              className={`relative ${index % 2 === 0 ? 'lg:-translate-x-8' : 'lg:translate-x-8'
                }`}
            >
              <button
                className="w-full py-8 flex items-center justify-between text-left focus:outline-none"
                onClick={() => toggleItem(index)}
              >
                <div className="flex items-center gap-6 pr-8">
                  <span className="text-gold/40 font-mono text-sm hidden md:inline-block">
                    {String(index + 1).padStart(2, '0')}.
                  </span>
                  <span className={`text-h5 md:text-h4 font-light transition-colors duration-300 ${openIndex === index ? 'text-gold' : 'text-white group-hover:text-gold/80'
                    }`}>
                    {faq.question}
                  </span>
                </div>

                {/* Plus/Minus Icon */}
                <div
                  className={`w-12 h-12 rounded-none border flex-shrink-0 flex items-center justify-center transition-all duration-300 ${openIndex === index
                    ? 'bg-gold border-gold text-black rotate-45'
                    : 'border-white/20 text-white group-hover:border-gold/50'
                    }`}
                >
                  <Plus className="w-5 h-5 text-white" />
                </div>
              </button>

              {/* Answer */}
              <div
                className={`overflow-hidden transition-all duration-500 motion-reduce:transition-none ${openIndex === index
                  ? 'max-h-[500px] opacity-100'
                  : 'max-h-0 opacity-0'
                  }`}
                style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
              >
                <div className="pb-8 pr-12 md:pr-24 text-body-lg text-white/70 font-light leading-relaxed border-l-2 border-gold/40 pl-6 ml-6 md:ml-12">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
