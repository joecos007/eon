// ============================================================================
// Site Configuration
// ============================================================================

export interface SiteConfig {
  title: string;
  description: string;
  language: string;
}

export const siteConfig: SiteConfig = {
  title: "Eon | A Timeless Glow",
  description: "Eon Jewelry - Handcrafted timeless pieces by Reena Koirala and Priya Laishangbam. Zen minimalistic jewelry that tells your story.",
  language: "en",
};

// ============================================================================
// Navigation Configuration
// ============================================================================

export interface NavItem {
  label: string;
  href: string;
}

export interface NavigationConfig {
  logo: string;
  items: NavItem[];
}

export const navigationConfig: NavigationConfig = {
  logo: "EON",
  items: [
    { label: "Collections", href: "#works" },
    { label: "Our Story", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Journal", href: "#blog" },
    { label: "Connect", href: "#contact" },
  ],
};

// ============================================================================
// Hero Section Configuration
// ============================================================================

export interface HeroConfig {
  title: string;
  subtitle: string;
  backgroundImage: string;
  servicesLabel: string;
  copyright: string;
}

export const heroConfig: HeroConfig = {
  title: "EON",
  subtitle: "A timeless glow. R&P.",
  backgroundImage: "/hero-section.png",
  servicesLabel: "Handcrafted | Timeless | Story",
  copyright: "© 2024 Eon Jewelry",
};

// ============================================================================
// About Section Configuration
// ============================================================================

export interface AboutConfig {
  titleLine1: string;
  titleLine2: string;
  description: string;
  image1: string;
  image1Alt: string;
  image2: string;
  image2Alt: string;
  authorImage: string;
  authorName: string;
  authorBio: string;
}

export const aboutConfig: AboutConfig = {
  titleLine1: "From different worlds, we found unity in creating",
  titleLine2: "beauty that transcends time and tells your story.",
  description: "Eon was born from the serendipitous meeting of two friends with vastly different paths. Reena Koirala spent years working in the healthcare industry, where she developed an eye for detail and a deep appreciation for the delicate moments of human connection. Priya Laishangbam soared the skies as an air hostess, collecting inspiration from cultures around the world and discovering beauty in unexpected places. Together, they found a shared passion: crafting jewelry that captures the essence of timeless elegance. Each piece reflects Reena's precision and care, blended with Priya's global perspective and artistic vision. Eon is more than jewelry—it's a celebration of friendship, courage, and the eternal glow that resides within us all.",
  image1: "/about-1.jpg",
  image1Alt: "The Eon atelier where each piece is handcrafted with precision",
  image2: "/about-2.jpg",
  image2Alt: "Delicate Eon jewelry adorning elegant hands",
  authorImage: "/photographer.jpg",
  authorName: "Reena & Priya",
  authorBio: "Two friends, two journeys, one vision. Reena brings the precision of healthcare, Priya brings the perspective of the skies—together, we craft pieces that remind you of your own timeless glow.",
};

// ============================================================================
// Works Section Configuration
// ============================================================================

export interface WorkItem {
  id: number;
  title: string;
  category: string;
  image: string;
}

export interface WorksConfig {
  title: string;
  subtitle: string;
  projects: WorkItem[];
}

export const worksConfig: WorksConfig = {
  title: "Collections",
  subtitle: "Each piece handcrafted with intention, designed to become part of your story.",
  projects: [
    {
      id: 1,
      title: "Lumina Drops",
      category: "Pearl Collection",
      image: "/work-1.jpg"
    },
    {
      id: 2,
      title: "Jade Whisper",
      category: "Heritage Line",
      image: "/work-2.jpg"
    },
    {
      id: 3,
      title: "Golden Hour",
      category: "Stackables",
      image: "/work-3.jpg"
    },
    {
      id: 4,
      title: "Eternity Band",
      category: "Bridal",
      image: "/work-4.jpg"
    },
  ],
};

// ============================================================================
// Services Section Configuration
// ============================================================================

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  image: string;
}

export interface ServicesConfig {
  title: string;
  subtitle: string;
  services: ServiceItem[];
}

export const servicesConfig: ServicesConfig = {
  title: "Our Craft",
  subtitle: "Every piece is an opportunity to create something that lasts forever.",
  services: [
    {
      id: "01",
      title: "Bespoke Design",
      description: "Collaborate with us to create a one-of-a-kind piece that tells your unique story. From initial sketch to final polish, we guide you through every step.",
      image: "/service-1.jpg"
    },
    {
      id: "02",
      title: "Artisan Crafting",
      description: "Each Eon piece is meticulously handcrafted in our studio using traditional techniques passed down through generations of master jewelers.",
      image: "/service-2.jpg"
    },
    {
      id: "03",
      title: "Heirloom Restoration",
      description: "Breathe new life into cherished family pieces. We carefully restore and reimagine heirlooms while honoring their original spirit.",
      image: "/service-3.jpg"
    },
    {
      id: "04",
      title: "Bridal Consultation",
      description: "Create the perfect symbols of your love story. From engagement rings to wedding bands, we craft pieces as unique as your journey together.",
      image: "/service-4.jpg"
    },
  ],
};

// ============================================================================
// Testimonials Section Configuration
// ============================================================================

export interface TestimonialItem {
  id: number;
  name: string;
  title: string;
  quote: string;
  image: string;
}

export interface TestimonialsConfig {
  title: string;
  testimonials: TestimonialItem[];
}

export const testimonialsConfig: TestimonialsConfig = {
  title: "Client Voices",
  testimonials: [
    {
      id: 1,
      name: "Margaret Wong",
      title: "Art Collector",
      quote: "Eon doesn't just create jewelry—they capture moments in metal and stone. My custom piece tells my grandmother's story, and I wear it close to my heart every day.",
      image: "/testimonial-1.jpg"
    },
    {
      id: 2,
      name: "Lily Tanaka",
      title: "Bride",
      quote: "Reena and Priya understood exactly what I wanted for my wedding day. My earrings weren't just accessories—they were the finishing touch that made me feel like myself.",
      image: "/testimonial-2.jpg"
    },
    {
      id: 3,
      name: "Sarah Lim",
      title: "Interior Designer",
      quote: "As someone who appreciates fine craftsmanship, I deeply value the precision and artistry that goes into every Eon piece. Their attention to detail mirrors the dedication I bring to my own work.",
      image: "/testimonial-3.jpg"
    },
  ],
};

// ============================================================================
// Pricing Section Configuration
// ============================================================================

export interface PricingPlan {
  id: number;
  name: string;
  price: number;
  unit: string;
  featured: boolean;
  features: string[];
}

export interface PricingConfig {
  title: string;
  subtitle: string;
  ctaButtonText: string;
  plans: PricingPlan[];
}

export const pricingConfig: PricingConfig = {
  title: "Investment",
  subtitle: "Thoughtfully priced collections for every chapter of your journey.",
  ctaButtonText: "Explore Collection",
  plans: [
    {
      id: 1,
      name: "Essence",
      price: 280,
      unit: "starting",
      featured: false,
      features: [
        "Delicate everyday pieces",
        "Sterling silver with gold vermeil",
        "Hand-selected freshwater pearls",
        "Gift packaging included",
        "Complimentary resizing"
      ]
    },
    {
      id: 2,
      name: "Luminary",
      price: 680,
      unit: "starting",
      featured: true,
      features: [
        "Signature collection pieces",
        "Solid 14k gold craftsmanship",
        "Premium gemstones & pearls",
        "Custom engraving available",
        "Lifetime care & maintenance",
        "Private consultation included"
      ]
    },
    {
      id: 3,
      name: "Eternity",
      price: 1800,
      unit: "starting",
      featured: false,
      features: [
        "Bespoke commissioned pieces",
        "18k gold & platinum options",
        "Rare & heirloom-quality stones",
        "Complete design collaboration",
        "Certificate of authenticity",
        "Annual complimentary cleaning"
      ]
    },
  ],
};

// ============================================================================
// FAQ Section Configuration
// ============================================================================

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQConfig {
  title: string;
  faqs: FAQItem[];
}

export const faqConfig: FAQConfig = {
  title: "FAQ",
  faqs: [
    {
      question: "How long does a custom piece take to create?",
      answer: "Our bespoke pieces typically take 4-6 weeks from initial consultation to completion. This allows us time to source the perfect materials and craft your piece with the attention it deserves. Rush orders may be accommodated for an additional fee."
    },
    {
      question: "Do you offer virtual consultations?",
      answer: "Yes! We offer virtual consultations for clients worldwide. Through video calls, we can discuss your vision, review design options, and guide you through the entire process from the comfort of your home."
    },
    {
      question: "What materials do you work with?",
      answer: "We primarily work with 14k and 18k gold, platinum, sterling silver, and carefully sourced gemstones including diamonds, pearls, jade, and sapphires. All our materials are ethically sourced and conflict-free."
    },
    {
      question: "Can you restore my grandmother's jewelry?",
      answer: "Absolutely. Heirloom restoration is one of our specialties. We approach each piece with reverence, preserving its original character while ensuring it's wearable for generations to come."
    },
    {
      question: "Do you ship internationally?",
      answer: "Yes, we ship worldwide via insured courier. All pieces are carefully packaged in our signature gift boxes and include a certificate of authenticity."
    },
  ],
};

// ============================================================================
// Blog Section Configuration
// ============================================================================

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  readTime: string;
  date: string;
  image: string;
  category: string;
}

export interface BlogConfig {
  title: string;
  subtitle: string;
  allPostsLabel: string;
  readMoreLabel: string;
  readTimePrefix: string;
  posts: BlogPost[];
}

export const blogConfig: BlogConfig = {
  title: "The Atelier Journal",
  subtitle: "Stories from our journey of creating timeless beauty.",
  allPostsLabel: "All Entries",
  readMoreLabel: "Read More",
  readTimePrefix: "Read ",
  posts: [
    {
      id: 1,
      title: "From Sky to Studio: Our Journey",
      excerpt: "How two friends from different worlds—healthcare and aviation—discovered a shared passion for creating timeless beauty. Reena's precision meets Priya's global perspective in every piece we craft.",
      readTime: "6 min",
      date: "Feb 28, 2024",
      image: "/blog-1.jpg",
      category: "Our Story"
    },
    {
      id: 2,
      title: "The Language of Pearls",
      excerpt: "Pearls have been treasured for millennia, each one a unique creation of nature. Discover how we select and pair these ocean gems to create pieces that whisper elegance.",
      readTime: "4 min",
      date: "Feb 15, 2024",
      image: "/blog-2.jpg",
      category: "Gemology"
    },
  ],
};

// ============================================================================
// Contact Section Configuration
// ============================================================================

export interface ContactFormOption {
  value: string;
  label: string;
}

export interface ContactConfig {
  title: string;
  subtitle: string;
  nameLabel: string;
  emailLabel: string;
  projectTypeLabel: string;
  projectTypePlaceholder: string;
  projectTypeOptions: ContactFormOption[];
  messageLabel: string;
  submitButtonText: string;
  image: string;
}

export const contactConfig: ContactConfig = {
  title: "Let's Create Together",
  subtitle: "Your vision deserves to be eternal. Begin your journey with us.",
  nameLabel: "Name *",
  emailLabel: "Email *",
  projectTypeLabel: "Inquiry Type",
  projectTypePlaceholder: "Select...",
  projectTypeOptions: [
    { value: "bespoke", label: "Bespoke Design" },
    { value: "bridal", label: "Bridal Consultation" },
    { value: "restoration", label: "Heirloom Restoration" },
    { value: "collection", label: "Collection Inquiry" },
    { value: "other", label: "Other" },
  ],
  messageLabel: "Tell us your story",
  submitButtonText: "Send Message",
  image: "/contact.jpg",
};

// ============================================================================
// Footer Configuration
// ============================================================================

export interface FooterLink {
  label: string;
  href: string;
  icon?: string;
}

export interface FooterConfig {
  marqueeText: string;
  marqueeHighlightChars: string[];
  navLinks1: FooterLink[];
  navLinks2: FooterLink[];
  ctaText: string;
  ctaHref: string;
  copyright: string;
  tagline: string;
}

export const footerConfig: FooterConfig = {
  marqueeText: "A Timeless Glow Lives Within You",
  marqueeHighlightChars: ["T", "G", "Y"],
  navLinks1: [
    { label: "Home", href: "#hero" },
    { label: "Collections", href: "#works" },
    { label: "Our Story", href: "#about" },
    { label: "Services", href: "#services" },
  ],
  navLinks2: [
    { label: "Instagram", href: "#", icon: "Instagram" },
    { label: "Pinterest", href: "#", icon: "Dribbble" },
  ],
  ctaText: "Begin Your Journey",
  ctaHref: "#contact",
  copyright: "© 2024 Eon Jewelry. All rights reserved.",
  tagline: "Crafted with precision, worn with love.",
};
