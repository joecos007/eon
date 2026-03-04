// ============================================================================
// Site Configuration
// ============================================================================

export interface SiteConfig {
  title: string;
  description: string;
  language: string;
}

export const siteConfig: SiteConfig = {
  title: "Lumora | Curated Radiance",
  description: "Lumora is a curated collection of radiant jewelry, handpicked from the world's finest artisans by Reena Koirala and Priya Laishangbam. Select your light. Glow.",
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
  logo: "LUMORA",
  items: [
    { label: "Collections", href: "#works" },
    { label: "Our Story", href: "#about" },
    { label: "Experience", href: "#services" },
    { label: "Journal", href: "#blog" },
    { label: "Connect", href: "#contact" },
  ],
};

// ============================================================================
// Hero Section Configuration
// ============================================================================

export interface HeroConfig {
  badge: string;
  title: string;
  subtitle: string;
  backgroundImage: string;
  servicesLabel: string;
  copyright: string;
}

export const heroConfig: HeroConfig = {
  badge: "Curated Jewelry",
  title: "LUMORA",
  subtitle: "Select. Adorn. Glow.",
  backgroundImage: "/hero-asset.png",
  servicesLabel: "Curated | Radiant | Yours",
  copyright: "\u00a9 2026 Lumora",
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
  titleLine1: "We wandered the world,",
  titleLine2: "so your radiance never has to wait.",
  description: "Lumora began as a whisper between two friends. Reena's years in healthcare taught her to see beauty in the smallest, most vital details, while Priya collected wonder from every sky she traveled beneath. They did not set out to create jewelry. They set out to find it. They searched the quiet workshops, the storied ateliers, and the hidden hands of master artisans across the globe, bringing back only what made them catch their breath. Every piece in our collection has been handpicked with a single question: does it make the one who wears it feel like the most luminous person in the room? We have done the searching. You simply select, and glow.",
  image1: "/images/our-story-image.png",
  image1Alt: "A glimpse into the curated world of Lumora jewelry",
  image2: "/ghibli-bg-2.png",
  image2Alt: "Radiant Lumora jewelry adorning elegant hands",
  authorImage: "/founders-ghibli.png",
  authorName: "Reena & Priya",
  authorBio: "Two friends, two journeys, one devotion: to find the most exquisite adornments the world has to offer, so all you have to do is choose the light that speaks to you.",
};

// ============================================================================
// Works Section Configuration
// ============================================================================

export interface WorkItem {
  id: number;
  title: string;
  category: string;
  image: string;
  description: string;
}

export interface WorksConfig {
  title: string;
  subtitle: string;
  projects: WorkItem[];
}

export const worksConfig: WorksConfig = {
  title: "Collections",
  subtitle: "Handpicked from the world\u2019s finest artisans, each piece waiting to become part of your story.",
  projects: [
    {
      id: 1,
      title: "Lumina Drops",
      category: "Pearl Collection",
      image: "/collections_lumina_drops_1772579918165.png",
      description: "Ethereal pearl earrings holding the light of dawn. Meticulously sourced for their unmatched luster and perfect spherical form."
    },
    {
      id: 2,
      title: "Jade Whisper",
      category: "Heritage Line",
      image: "/collections_jade_whisper_1772579991966.png",
      description: "A translucent green jade masterpiece that carries the quiet wisdom of ancient forests and generational craftsmanship."
    },
    {
      id: 3,
      title: "Golden Hour",
      category: "Stackables",
      image: "/collections_golden_hour_1772580005861.png",
      description: "Delicate, sparkling gold rings meant to be stacked, capturing the warm, fleeting magic of the setting sun."
    },
    {
      id: 4,
      title: "Eternity Band",
      category: "Bridal",
      image: "/collections_eternity_band_1772580032724.png",
      description: "A breathtaking endless circle of diamonds, catching moonlight to symbolize devotion that outlasts time itself."
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
  title: "Our Devotion",
  subtitle: "We do not simply offer jewelry. We shepherd you toward your glow.",
  services: [
    {
      id: "01",
      title: "Global Curation",
      description: "We traverse continents and quiet ateliers to handpick only the pieces that steal our breath, so each one is worthy of stealing yours.",
      image: "/service-1.jpg"
    },
    {
      id: "02",
      title: "Personal Styling",
      description: "A private consultation to understand your light, your story, and your occasion, matching you with the piece that was always meant to find you.",
      image: "/services_styling_1772580048117.png"
    },
    {
      id: "03",
      title: "Private Viewings",
      description: "An intimate appointment to experience our collection in person. Touch the gold, feel the weight, and let the right adornment choose you.",
      image: "/service-3.jpg"
    },
    {
      id: "04",
      title: "Gift Concierge",
      description: "Tell us who holds your heart, and we will find the adornment that says what words cannot. Beautifully wrapped, personally delivered.",
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
  title: "Whispers of Light",
  testimonials: [
    {
      id: 1,
      name: "Lily Thangjam",
      title: "Art Collector",
      quote: "I did not find a piece of jewelry. I found a quiet reminder of my grandmother\u2019s love, waiting for me in gold and pearl. Lumora does not just sell jewelry. They reunite you with beauty you forgot you were missing.",
      image: "/testimonial-1.jpg"
    },
    {
      id: 2,
      name: "Merina Oinam",
      title: "Bride",
      quote: "Reena and Priya understood my story before I finished telling it. The earrings they selected for my wedding day were not just accessories. They were a love letter I got to wear.",
      image: "/testimonial-2.jpg"
    },
    {
      id: 3,
      name: "Zerina Angom",
      title: "Interior Designer",
      quote: "The curation is impeccable. Every piece feels like it was discovered in some faraway treasury and brought here just for you. That kind of devotion is rare and unmistakable.",
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
  subtitle: "Thoughtfully curated collections for every chapter of your journey.",
  ctaButtonText: "Explore Collection",
  plans: [
    {
      id: 1,
      name: "Essence",
      price: 280,
      unit: "starting",
      featured: false,
      features: [
        "Delicate everyday adornments",
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
        "Signature curated pieces",
        "Solid 14k gold selections",
        "Premium gemstones & pearls",
        "Personal styling session",
        "Lifetime care & maintenance",
        "Private viewing included"
      ]
    },
    {
      id: 3,
      name: "Eternity",
      price: 1800,
      unit: "starting",
      featured: false,
      features: [
        "Rare & heirloom-quality finds",
        "18k gold & platinum pieces",
        "One-of-a-kind artisan selections",
        "Dedicated concierge service",
        "Certificate of authenticity",
        "Annual complimentary care"
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
  title: "Questions",
  faqs: [
    {
      question: "Where do you source your pieces?",
      answer: "We travel the world, from the pearl farms of Tahiti to the gold workshops of Florence, seeking artisans whose craft moves us. Every piece in our collection has been personally discovered and handpicked by our founders, so you receive only what has passed through devoted hands and discerning eyes."
    },
    {
      question: "Do you offer virtual consultations?",
      answer: "Absolutely. Our personal styling sessions are available worldwide via video call. We will learn your story, your style, and your occasion, then guide you to the piece that feels like it was always yours."
    },
    {
      question: "How do you ensure authenticity and quality?",
      answer: "Every piece arrives with a certificate of authenticity and our personal guarantee. We work only with artisans whose materials are ethically sourced and whose craftsmanship we have witnessed firsthand. If it does not take our breath away, it never reaches your hands."
    },
    {
      question: "Can I return or exchange a piece?",
      answer: "Your glow matters most. If a piece does not feel like it belongs to you, we offer exchanges within 14 days. Our styling team is also available to help you find the adornment that does."
    },
    {
      question: "Do you ship internationally?",
      answer: "Yes, we deliver worldwide via insured courier. Every piece is nestled in our signature packaging, because even the unwrapping should feel like a moment of light."
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
  content: string[];
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
  title: "The Lumora Letters",
  subtitle: "Musings on light, adornment, and the quiet art of glowing.",
  allPostsLabel: "All Letters",
  readMoreLabel: "Read More",
  readTimePrefix: "Read ",
  posts: [
    {
      id: 1,
      title: "From Sky to Selection: Our Journey",
      excerpt: "How two friends from different worlds, healthcare and aviation, discovered a shared devotion to finding beauty that moves you. The story of Lumora is the story of learning to see light everywhere.",
      content: [
        "It started not in a jewelry store, but in the sterile, quiet halls of a hospital, and the expansive, lonely skies above the Atlantic. Reena, moving through her days in healthcare, learned quickly that life’s most profound moments are often entirely quiet. A squeezed hand. A steady heartbeat. A shared breath. She found herself noticing the small, constant things people held onto—often a worn gold band or a delicate pendant—objects that served as anchors of a life well-lived.",
        "Meanwhile, Priya was crossing time zones. As an air hostess, she inhabited the spaces in between places. Her life was defined by motion, by the transient nature of encounters. But in every city she visited—from the sun-drenched markets of Marrakech to the hidden, centuries-old gold districts of Florence—she sought out the permanent. She collected pieces of adornment not just for their beauty, but for their stillness. For the way a well-crafted piece of jewelry exists outside of time.",
        "When our paths finally crossed on solid ground, we realized we were looking for the same thing: light. The kind of light that doesn't just sit on the skin, but answers the person wearing it. And so, Lumora was born. We stopped merely looking at adornments, and started searching for them. This journal is a record of that search."
      ],
      readTime: "6 min",
      date: "Feb 28, 2024",
      image: "/blog-1.jpg",
      category: "Our Story"
    },
    {
      id: 2,
      title: "The Language of Pearls",
      excerpt: "Pearls have been treasured for millennia, each one a quiet miracle of the sea. Discover how we seek, select, and pair these ocean-born gems into pieces that whisper elegance.",
      content: [
        "When we think of pearls, we often think of them as finished objects, smooth and perfect, resting against collarbones or wrists. But to understand a pearl is to understand its origin: a defense mechanism. It is the only gem created by a living organism, a continuous, slow layering of nacre to soothe an irritation. In this way, every pearl is a testament to resilience.",
        "When we source our pearls—whether they are the luminous white South Sea varieties or the deeply bruised, iridescent peacock tones from Tahiti—we are looking for character over flawless uniformity. We look for luster, yes, but we also look for life. A slightly baroque shape or a subtle dimple isn't a flaw; it is the signature of the water that made it.",
        "Pairing these gems requires absolute patience. Stringing a necklace of matched pearls can take months of sorting, holding each sphere against the light to ensure its complexion matches its neighbor. But when they are finally brought together, they create a soft, unmistakable glow. They don't shout like diamonds; they whisper. And for those who choose them, that whisper is more than enough."
      ],
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
  title: "Find Your Glow",
  subtitle: "Your radiance is waiting. Let us help you meet it.",
  nameLabel: "Name *",
  emailLabel: "Email *",
  projectTypeLabel: "How Can We Help",
  projectTypePlaceholder: "Select...",
  projectTypeOptions: [
    { value: "styling", label: "Personal Styling" },
    { value: "viewing", label: "Private Viewing" },
    { value: "gift", label: "Gift Concierge" },
    { value: "collection", label: "Collection Inquiry" },
    { value: "other", label: "Other" },
  ],
  messageLabel: "Tell us your story",
  submitButtonText: "Send Message",
  image: "/ghibli-bg-1.png",
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
  developerCredit: string;
}

export const footerConfig: FooterConfig = {
  marqueeText: "Select Adorn Glow",
  marqueeHighlightChars: ["S", "A", "G"],
  navLinks1: [
    { label: "Home", href: "#hero" },
    { label: "Collections", href: "#works" },
    { label: "Our Story", href: "#about" },
    { label: "Experience", href: "#services" },
  ],
  navLinks2: [
    { label: "Instagram", href: "#", icon: "Instagram" },
    { label: "Pinterest", href: "#", icon: "Dribbble" },
  ],
  ctaText: "Begin Your Journey",
  ctaHref: "#contact",
  copyright: "\u00a9 2026 Lumora. All rights reserved.",
  tagline: "Curated with devotion, worn with radiance.",
  developerCredit: "Fueled by Caffeine & Code. Crafted by Oliver.",
};
