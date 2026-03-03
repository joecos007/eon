import { test, expect } from '@playwright/test';

test.describe('Lumora E2E Flow', () => {
  test('homepage has expected title and core elements', async ({ page }) => {
    await page.goto('/');

    // Verify Title
    await expect(page).toHaveTitle(/Lumora/);

    // Verify Hero Section content
    await expect(page.locator('text=SELECT. ADORN. GLOW.').first()).toBeVisible();

    // Scroll to "Our Story" section and verify content
    await page.locator('text=We wandered the world,').scrollIntoViewIfNeeded();
    await expect(page.locator('text=We wandered the world,')).toBeVisible();
    await expect(page.locator('text=so your radiance never has to wait.')).toBeVisible();

    // Scroll to "Our Devotion" section
    await page.locator('text=Our Devotion').scrollIntoViewIfNeeded();
    await expect(page.locator('text=Our Devotion')).toBeVisible();
    await expect(page.locator('text=Global Curation')).toBeVisible();

    // Scroll to "Find Your Glow" contact section
    await page.locator('text=Your radiance is waiting.').scrollIntoViewIfNeeded();
    await expect(page.locator('text=Your radiance is waiting.')).toBeVisible();

    // Scroll to Footer and verify Marquee content is present
    await page.locator('text=Select Adorn Glow').first().scrollIntoViewIfNeeded();
    await expect(page.locator('text=Select Adorn Glow').first()).toBeVisible();
    
    // Verify Developer credit
    await expect(page.locator('text=Fueled by Caffeine & Code. Crafted by Oliver.')).toBeVisible();
  });
});
