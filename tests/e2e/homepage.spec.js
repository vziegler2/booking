/**
 * E2E Tests for Homepage
 */
const { test, expect } = require('@playwright/test');

test.describe('Homepage', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should display the main heading', async ({ page }) => {
        await expect(page.locator('h1')).toContainText('SAP-Lösungen');
    });

    test('should have working navigation', async ({ page }) => {
        // Test navigation links
        const navLinks = page.locator('.nav-links a');
        await expect(navLinks).toHaveCount(5);

        // Click on Skills link
        await page.click('a[href="#skills"]');
        await expect(page.locator('#skills')).toBeVisible();
    });

    test('should toggle mobile menu', async ({ page }) => {
        // Set mobile viewport
        await page.setViewportSize({ width: 375, height: 667 });

        const burger = page.locator('.burger');
        const navLinks = page.locator('.nav-links');

        // Initially nav should be hidden on mobile
        await expect(burger).toBeVisible();

        // Click burger to open menu
        await burger.click();
        await expect(navLinks).toHaveClass(/active/);
    });

    test('should load GitHub repositories', async ({ page }) => {
        // Wait for GitHub API call
        await page.waitForSelector('.github-repo-card, .loading-placeholder');

        // Check if repos loaded or loading placeholder exists
        const repoCards = page.locator('.github-repo-card');
        const loading = page.locator('.loading-placeholder');

        // Either repos loaded or loading state
        const hasContent = await repoCards.count() > 0 || await loading.isVisible();
        expect(hasContent).toBeTruthy();
    });

    test('should have proper meta tags', async ({ page }) => {
        // Check title
        await expect(page).toHaveTitle(/SAP Entwickler/);

        // Check meta description
        const description = await page.locator('meta[name="description"]').getAttribute('content');
        expect(description).toContain('SAP');

        // Check OpenGraph tags
        const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
        expect(ogTitle).toBeTruthy();
    });
});

test.describe('Booking Form', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.click('a[href="#booking"]');
    });

    test('should display booking form', async ({ page }) => {
        await expect(page.locator('#booking-form')).toBeVisible();
    });

    test('should validate required fields', async ({ page }) => {
        // Try to submit empty form
        await page.click('.btn-submit');

        // Check if browser validation prevents submission
        const nameInput = page.locator('#name');
        const isInvalid = await nameInput.evaluate(el => !el.validity.valid);
        expect(isInvalid).toBeTruthy();
    });

    test('should fill and submit form', async ({ page }) => {
        // Fill form fields
        await page.fill('#name', 'Test User');
        await page.fill('#company', 'Test Company');
        await page.fill('#email', 'test@example.com');
        await page.fill('#phone', '+49 123 456 7890');
        await page.selectOption('#service', 'abap');
        await page.fill('#message', 'Test project description');
        await page.check('#privacy');

        // Submit form
        await page.click('.btn-submit');

        // Wait for status message
        await page.waitForSelector('.submit-status', { state: 'visible', timeout: 5000 });
    });

    test('should select payment method', async ({ page }) => {
        const paymentOption = page.locator('.payment-option[data-method="paypal"]');
        await paymentOption.click();

        await expect(paymentOption).toHaveClass(/selected/);
    });
});

test.describe('Accessibility', () => {
    test('should have skip link', async ({ page }) => {
        await page.goto('/');

        const skipLink = page.locator('.skip-link');
        await expect(skipLink).toHaveAttribute('href', '#main-content');
    });

    test('should have ARIA labels on interactive elements', async ({ page }) => {
        await page.goto('/');

        // Check burger menu
        const burger = page.locator('.burger');
        await expect(burger).toHaveAttribute('aria-label');

        // Check form labels
        const nameLabel = page.locator('label[for="name"]');
        await expect(nameLabel).toBeVisible();
    });

    test('should be keyboard navigable', async ({ page }) => {
        await page.goto('/');

        // Tab through page
        await page.keyboard.press('Tab');

        // First focusable element should be skip link
        const focusedElement = await page.evaluate(() => document.activeElement.className);
        expect(focusedElement).toContain('skip-link');
    });
});

test.describe('Responsive Design', () => {
    test('should adapt to mobile viewport', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto('/');

        // Burger should be visible
        await expect(page.locator('.burger')).toBeVisible();

        // Hero image should be hidden
        await expect(page.locator('.hero-image')).toBeHidden();
    });

    test('should adapt to tablet viewport', async ({ page }) => {
        await page.setViewportSize({ width: 768, height: 1024 });
        await page.goto('/');

        // Check grid layout
        const skillsGrid = page.locator('.skills-grid');
        await expect(skillsGrid).toBeVisible();
    });

    test('should adapt to desktop viewport', async ({ page }) => {
        await page.setViewportSize({ width: 1920, height: 1080 });
        await page.goto('/');

        // Full navigation should be visible
        await expect(page.locator('.nav-links')).toBeVisible();
        await expect(page.locator('.burger')).toBeHidden();
    });
});
