import { test, expect } from '@playwright/test';

test.describe('Lumora - Full E2E Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the app to hydrate
    await page.waitForSelector('#root', { state: 'attached' });
  });

  // =========================================================================
  // Page Load & Meta
  // =========================================================================
  test('page loads with correct title and meta', async ({ page }) => {
    await expect(page).toHaveTitle(/Lumora/);
    const metaDesc = page.locator('meta[name="description"]');
    await expect(metaDesc).toHaveAttribute('content', /curated collection/i);
    const themeColor = page.locator('meta[name="theme-color"]');
    await expect(themeColor).toHaveAttribute('content', '#000000');
  });

  test('no console errors on load', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    // Filter out known benign warnings
    const critical = errors.filter(
      (e) => !e.includes('ResizeObserver') && !e.includes('passive')
    );
    expect(critical).toHaveLength(0);
  });

  // =========================================================================
  // Navigation
  // =========================================================================
  test('navigation bar is visible and contains all links', async ({ page }) => {
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();

    // Logo
    await expect(page.locator('nav').getByText('Lumora')).toBeVisible();

    // Desktop nav items (hidden on mobile)
    const desktopNav = page.locator('nav .hidden.lg\\:flex');
    const links = desktopNav.locator('a');
    const expectedLabels = ['Collections', 'Our Story', 'Experience', 'Journal', 'Connect', 'Book Appointment'];
    for (const label of expectedLabels) {
      await expect(links.filter({ hasText: label }).first()).toBeAttached();
    }
  });

  test('navigation scroll state changes on scroll', async ({ page }) => {
    const nav = page.locator('nav');
    // Initially transparent
    await expect(nav).toHaveClass(/bg-transparent/);

    // Scroll down past threshold
    await page.evaluate(() => window.scrollTo(0, 200));
    await page.waitForTimeout(500);

    // Should now have scrolled state
    await expect(nav).toHaveClass(/bg-black/);
  });

  test('nav link click scrolls to correct section', async ({ page }) => {
    // Click on "Collections" (href="#works")
    await page.locator('nav').getByText('Collections').first().click();
    await page.waitForTimeout(800);

    const worksSection = page.locator('#works');
    await expect(worksSection).toBeVisible();
  });

  // =========================================================================
  // Hero Section
  // =========================================================================
  test('hero section renders with correct content', async ({ page }) => {
    const hero = page.locator('#hero');
    await expect(hero).toBeVisible();

    // Badge
    await expect(page.getByText('Curated Jewelry')).toBeVisible();

    // Title
    await expect(page.locator('#hero h1')).toContainText('LUMORA');

    // Subtitle
    await expect(page.getByText('Select. Adorn. Glow.')).toBeVisible();

    // CTA button
    await expect(page.getByText('Explore Collection')).toBeVisible();

    // Hero background image
    const heroImg = page.locator('#hero img');
    await expect(heroImg).toBeAttached();
    await expect(heroImg).toHaveAttribute('src', /hero-asset/);
    await expect(heroImg).toHaveAttribute('fetchpriority', 'high');
  });

  // =========================================================================
  // About Section
  // =========================================================================
  test('about section renders with correct content', async ({ page }) => {
    const about = page.locator('#about');
    await about.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    await expect(page.getByText('We wandered the world,')).toBeVisible();
    await expect(page.getByText('so your radiance never has to wait.')).toBeVisible();

    // Author image
    const authorImg = page.locator('#about img[alt="Reena Koirala & Priya Laishangbam"]');
    await expect(authorImg).toBeAttached();
    await expect(authorImg).toHaveAttribute('loading', 'lazy');
  });

  // =========================================================================
  // Works / Collections Section
  // =========================================================================
  test('works section displays all collection cards', async ({ page }) => {
    const works = page.locator('#works');
    await works.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    // Section title
    await expect(page.locator('#works h2').first()).toContainText('Collections');

    // All 4 project cards
    const cards = works.locator('.group.cursor-pointer');
    await expect(cards).toHaveCount(4);

    // Project titles
    await expect(page.getByText('Lumina Drops')).toBeAttached();
    await expect(page.getByText('Jade Whisper')).toBeAttached();
    await expect(page.getByText('Golden Hour')).toBeAttached();
    await expect(page.getByText('Eternity Band')).toBeAttached();
  });

  test('works card click opens modal', async ({ page }) => {
    const works = page.locator('#works');
    await works.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);

    // Click first card
    const firstCard = works.locator('.group.cursor-pointer').first();
    await firstCard.click();
    await page.waitForTimeout(500);

    // Modal should appear
    const modal = page.locator('.fixed.inset-0.z-\\[100\\]');
    await expect(modal).toBeVisible();

    // Close button should be visible
    const closeBtn = modal.locator('button').first();
    await expect(closeBtn).toBeVisible();

    // Click close
    await closeBtn.click();
    await page.waitForTimeout(500);

    // Modal should disappear
    await expect(modal).not.toBeVisible();
  });

  // =========================================================================
  // Services Section
  // =========================================================================
  test('services section renders with accordion', async ({ page }) => {
    const services = page.locator('#services');
    await services.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    await expect(page.getByText('Our Devotion').first()).toBeVisible();
    await expect(page.locator('#services').getByRole('heading', { name: 'Global Curation' })).toBeVisible();
    await expect(page.locator('#services').getByRole('heading', { name: 'Personal Styling' })).toBeVisible();
    await expect(page.locator('#services').getByRole('heading', { name: 'Private Viewings' })).toBeVisible();
    await expect(page.locator('#services').getByRole('heading', { name: 'Gift Concierge' })).toBeVisible();
  });

  test('services accordion expands on click', async ({ page }) => {
    const services = page.locator('#services');
    await services.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);

    // Click first service item
    const firstItem = services.locator('.service-item').first();
    await firstItem.locator('button[class*="cursor-pointer"]').first().click();
    await page.waitForTimeout(600);

    // Description text should now be visible
    await expect(
      page.getByText(/We traverse continents/).first()
    ).toBeVisible();
  });

  // =========================================================================
  // FAQ Section
  // =========================================================================
  test('FAQ section renders and toggles answers', async ({ page }) => {
    const faq = page.locator('#faq');
    await faq.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    // Title
    await expect(page.locator('#faq h2').first()).toContainText('Questions');

    // Click first FAQ question
    const firstQuestion = faq.locator('button').first();
    await firstQuestion.click();
    await page.waitForTimeout(600);

    // Answer should be visible
    await expect(
      page.getByText(/We travel the world/).first()
    ).toBeVisible();
  });

  // =========================================================================
  // Testimonials Section
  // =========================================================================
  test('testimonials section renders with cards', async ({ page }) => {
    const testimonials = page.locator('#testimonials');
    await testimonials.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    await expect(page.locator('#testimonials h2').first()).toContainText('Whispers of Light');

    // Client names
    await expect(page.getByText('Lily Thangjam')).toBeAttached();
    await expect(page.getByText('Merina Oinam')).toBeAttached();
    await expect(page.getByText('Zerina Angom')).toBeAttached();
  });

  // =========================================================================
  // Blog Section
  // =========================================================================
  test('blog section renders with posts', async ({ page }) => {
    const blog = page.locator('#blog');
    await blog.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);

    // Wait for typewriter to complete
    await expect(page.locator('#blog h2').first()).toContainText('The Lumora Letters');

    // Posts
    await expect(page.getByText('From Sky to Selection: Our Journey')).toBeAttached();
    await expect(page.getByText('The Language of Pearls')).toBeAttached();
  });

  test('blog card click opens modal', async ({ page }) => {
    const blog = page.locator('#blog');
    await blog.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);

    // Click first blog post
    const firstPost = blog.locator('.group.cursor-pointer').first();
    await firstPost.click();
    await page.waitForTimeout(500);

    // Modal should appear
    const modal = page.locator('.fixed.inset-0.z-\\[100\\]');
    await expect(modal).toBeVisible();

    // Close it
    const closeBtn = modal.locator('button').first();
    await closeBtn.click();
    await page.waitForTimeout(500);
    await expect(modal).not.toBeVisible();
  });

  // =========================================================================
  // Contact Section
  // =========================================================================
  test('contact section renders form with all fields', async ({ page }) => {
    const contact = page.locator('#contact');
    await contact.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    // Form fields
    await expect(page.locator('input[name="name"]')).toBeAttached();
    await expect(page.locator('input[name="email"]')).toBeAttached();
    await expect(page.locator('select[name="projectType"]')).toBeAttached();
    await expect(page.locator('textarea[name="message"]')).toBeAttached();

    // Submit button
    await expect(page.getByText('Send Message')).toBeVisible();
  });

  test('contact form validates required fields', async ({ page }) => {
    const contact = page.locator('#contact');
    await contact.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    // Name and email are required - try submitting empty
    const nameInput = page.locator('input[name="name"]');
    await expect(nameInput).toHaveAttribute('required', '');

    const emailInput = page.locator('input[name="email"]');
    await expect(emailInput).toHaveAttribute('required', '');
  });

  test('contact form accepts input', async ({ page }) => {
    const contact = page.locator('#contact');
    await contact.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@lumora.com');
    await page.selectOption('select[name="projectType"]', 'styling');
    await page.fill('textarea[name="message"]', 'I would like a styling session.');

    // Verify values
    await expect(page.locator('input[name="name"]')).toHaveValue('Test User');
    await expect(page.locator('input[name="email"]')).toHaveValue('test@lumora.com');
    await expect(page.locator('select[name="projectType"]')).toHaveValue('styling');
    await expect(page.locator('textarea[name="message"]')).toHaveValue('I would like a styling session.');
  });

  // =========================================================================
  // Footer
  // =========================================================================
  test('footer renders with all content', async ({ page }) => {
    const footer = page.locator('footer');
    await footer.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    // Copyright
    await expect(page.getByText('2026 Lumora. All rights reserved.')).toBeVisible();

    // Developer credit
    await expect(page.getByText('Fueled by Caffeine & Code. Crafted by Oliver Oinam.')).toBeVisible();

    // CTA link
    await expect(page.getByText('Begin Your Journey')).toBeVisible();

    // Navigation links
    await expect(footer.getByText('Home').first()).toBeAttached();
    await expect(footer.getByText('Collections').first()).toBeAttached();
  });

  // =========================================================================
  // Performance & Rendering Checks
  // =========================================================================
  test('particle canvas is rendered with correct z-index', async ({ page }) => {
    const canvas = page.locator('canvas');
    await expect(canvas).toBeAttached();
    // Should have z-[1] - below content, not overlaying text
    await expect(canvas).toHaveClass(/z-\[1\]/);
  });

  test('noise overlay is not animated (static for performance)', async ({ page }) => {
    const noise = page.locator('.noise-overlay');
    await expect(noise).toBeAttached();
    // Verify it uses translateZ(0) for GPU compositing instead of animation
    const style = await noise.evaluate((el) => window.getComputedStyle(el).willChange);
    expect(style).toBe('transform');
  });

  test('images below fold have lazy loading', async ({ page }) => {
    // All images except the hero should have loading="lazy"
    const lazyImages = page.locator('img[loading="lazy"]');
    const count = await lazyImages.count();
    expect(count).toBeGreaterThanOrEqual(5);
  });

  test('hero image has fetchpriority high', async ({ page }) => {
    const heroImg = page.locator('#hero img');
    await expect(heroImg).toHaveAttribute('fetchpriority', 'high');
  });

  // =========================================================================
  // Mobile Responsive Checks
  // =========================================================================
  test.describe('Mobile viewport', () => {
    test.use({ viewport: { width: 375, height: 812 } });

    test('mobile menu button is visible', async ({ page }) => {
      await page.goto('/');
      const menuBtn = page.locator('nav button[aria-label]');
      await expect(menuBtn).toBeVisible();
    });

    test('mobile menu opens and closes', async ({ page }) => {
      await page.goto('/');
      const menuBtn = page.locator('nav button[aria-label="Open menu"]');
      await menuBtn.click();
      await page.waitForTimeout(500);

      // Mobile menu overlay should be visible
      const overlay = page.locator('.fixed.inset-0.z-40');
      await expect(overlay).toBeVisible();

      // Nav links should be visible in mobile menu
      await expect(overlay.getByText('Collections')).toBeVisible();

      // Close the menu
      const closeBtn = page.locator('nav button[aria-label="Close menu"]');
      await closeBtn.click();
      await page.waitForTimeout(500);
      await expect(overlay).not.toBeVisible();
    });

    test('mobile nav link navigates and closes menu', async ({ page }) => {
      await page.goto('/');
      const menuBtn = page.locator('nav button[aria-label="Open menu"]');
      await menuBtn.click();
      await page.waitForTimeout(500);

      const overlay = page.locator('.fixed.inset-0.z-40');
      await overlay.getByText('Collections').click();
      await page.waitForTimeout(800);

      // Menu should be closed
      await expect(overlay).not.toBeVisible();
    });

    test('hero section is responsive on mobile', async ({ page }) => {
      await page.goto('/');
      const hero = page.locator('#hero');
      await expect(hero).toBeVisible();
      await expect(page.locator('#hero h1')).toBeVisible();
    });

    test('works cards stack vertically on mobile', async ({ page }) => {
      await page.goto('/');
      const works = page.locator('#works');
      await works.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);

      // On mobile, grid should be single column
      const grid = works.locator('.grid.grid-cols-1');
      await expect(grid).toBeAttached();
    });

    test('mobile menu button has accessible label', async ({ page }) => {
      await page.goto('/');
      const menuBtn = page.locator('nav button[aria-label]');
      await expect(menuBtn).toHaveAttribute('aria-label', /menu/i);
    });
  });

  // =========================================================================
  // Tablet Responsive Checks
  // =========================================================================
  test.describe('Tablet viewport', () => {
    test.use({ viewport: { width: 768, height: 1024 } });

    test('page renders correctly at tablet size', async ({ page }) => {
      await page.goto('/');
      await expect(page).toHaveTitle(/Lumora/);
      await expect(page.locator('#hero')).toBeVisible();
      await expect(page.locator('#hero h1')).toBeVisible();
    });
  });

  // =========================================================================
  // Accessibility Basics
  // =========================================================================
  test('all images have alt text', async ({ page }) => {
    const images = page.locator('img:not([alt])');
    const count = await images.count();
    expect(count).toBe(0);
  });

  test('interactive elements are keyboard focusable', async ({ page }) => {
    // Tab through first few elements
    await page.keyboard.press('Tab');
    const focused = page.locator(':focus');
    await expect(focused).toBeAttached();
  });

  test('modals have dialog semantics', async ({ page }) => {
    const works = page.locator('#works');
    await works.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);

    // Click first card to open modal
    const firstCard = works.locator('[role="button"]').first();
    await firstCard.click();
    await page.waitForTimeout(500);

    // Verify dialog semantics
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();
    await expect(modal).toHaveAttribute('aria-modal', 'true');

    // Close button should have aria-label
    const closeBtn = modal.locator('button[aria-label]').first();
    await expect(closeBtn).toBeVisible();

    await closeBtn.click();
    await page.waitForTimeout(500);
    await expect(modal).not.toBeVisible();
  });
});
