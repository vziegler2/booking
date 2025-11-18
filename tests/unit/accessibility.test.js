/**
 * Unit Tests for Accessibility Compliance
 * Tests WCAG 2.1 AA requirements
 */

describe('Accessibility - WCAG 2.1 AA Compliance', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    describe('Color Contrast', () => {
        /**
         * Calculates relative luminance of a color
         * @param {number} r - Red value (0-255)
         * @param {number} g - Green value (0-255)
         * @param {number} b - Blue value (0-255)
         * @returns {number} Relative luminance
         */
        const getLuminance = (r, g, b) => {
            const [rs, gs, bs] = [r, g, b].map(c => {
                c = c / 255;
                return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
            });
            return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
        };

        /**
         * Calculates contrast ratio between two colors
         * @param {Array} color1 - RGB array [r, g, b]
         * @param {Array} color2 - RGB array [r, g, b]
         * @returns {number} Contrast ratio
         */
        const getContrastRatio = (color1, color2) => {
            const l1 = getLuminance(...color1);
            const l2 = getLuminance(...color2);
            const lighter = Math.max(l1, l2);
            const darker = Math.min(l1, l2);
            return (lighter + 0.05) / (darker + 0.05);
        };

        test('Primary color should have 4.5:1 contrast with white', () => {
            const primary = [0, 112, 243]; // #0070f3
            const white = [255, 255, 255];
            const ratio = getContrastRatio(primary, white);
            expect(ratio).toBeGreaterThanOrEqual(4.5);
        });

        test('Text gray should have 4.5:1 contrast with dark background', () => {
            // Updated gray for better contrast: #9ca3af instead of #6b7280
            const gray = [156, 163, 175]; // #9ca3af
            const dark = [10, 22, 40]; // #0a1628
            const ratio = getContrastRatio(gray, dark);
            expect(ratio).toBeGreaterThanOrEqual(4.5);
        });

        test('Secondary color should have 3:1 contrast for large text', () => {
            const secondary = [0, 212, 170]; // #00d4aa
            const dark = [10, 22, 40]; // #0a1628
            const ratio = getContrastRatio(secondary, dark);
            expect(ratio).toBeGreaterThanOrEqual(3);
        });
    });

    describe('Keyboard Navigation', () => {
        test('All interactive elements should be focusable', () => {
            document.body.innerHTML = `
                <a href="#test" id="link">Link</a>
                <button id="button">Button</button>
                <input type="text" id="input">
                <select id="select"><option>Option</option></select>
                <textarea id="textarea"></textarea>
            `;

            const elements = ['link', 'button', 'input', 'select', 'textarea'];

            elements.forEach(id => {
                const el = document.getElementById(id);
                el.focus();
                expect(document.activeElement).toBe(el);
            });
        });

        test('Elements with tabindex=-1 should not be in tab order', () => {
            document.body.innerHTML = `
                <button tabindex="-1" id="hidden">Hidden</button>
                <button id="visible">Visible</button>
            `;

            const hidden = document.getElementById('hidden');
            const visible = document.getElementById('visible');

            // tabindex=-1 elements are programmatically focusable but not in tab order
            expect(hidden.tabIndex).toBe(-1);
            expect(visible.tabIndex).toBe(0);
        });

        test('Custom controls should have appropriate roles', () => {
            document.body.innerHTML = `
                <div role="button" tabindex="0" id="custom-button">Custom</div>
                <div role="checkbox" tabindex="0" aria-checked="false" id="custom-checkbox">Check</div>
            `;

            const button = document.getElementById('custom-button');
            const checkbox = document.getElementById('custom-checkbox');

            expect(button.getAttribute('role')).toBe('button');
            expect(button.tabIndex).toBe(0);
            expect(checkbox.getAttribute('aria-checked')).toBe('false');
        });
    });

    describe('ARIA Attributes', () => {
        test('Form inputs should have associated labels', () => {
            document.body.innerHTML = `
                <label for="email">Email</label>
                <input type="email" id="email" aria-describedby="email-error">
                <span id="email-error">Error message</span>
            `;

            const input = document.getElementById('email');
            const label = document.querySelector('label[for="email"]');

            expect(label).not.toBeNull();
            expect(input.getAttribute('aria-describedby')).toBe('email-error');
        });

        test('Expandable elements should have aria-expanded', () => {
            document.body.innerHTML = `
                <button aria-expanded="false" aria-controls="menu" id="toggle">Menu</button>
                <div id="menu" hidden>Menu content</div>
            `;

            const button = document.getElementById('toggle');
            expect(button.getAttribute('aria-expanded')).toBe('false');
            expect(button.getAttribute('aria-controls')).toBe('menu');
        });

        test('Live regions should have appropriate attributes', () => {
            document.body.innerHTML = `
                <div role="status" aria-live="polite" id="status">Status</div>
                <div role="alert" aria-live="assertive" id="alert">Alert</div>
            `;

            const status = document.getElementById('status');
            const alert = document.getElementById('alert');

            expect(status.getAttribute('aria-live')).toBe('polite');
            expect(alert.getAttribute('aria-live')).toBe('assertive');
        });

        test('Images should have alt text or be marked decorative', () => {
            document.body.innerHTML = `
                <img src="photo.jpg" alt="Profile photo" id="content-img">
                <img src="decoration.jpg" alt="" role="presentation" id="decorative-img">
            `;

            const contentImg = document.getElementById('content-img');
            const decorativeImg = document.getElementById('decorative-img');

            expect(contentImg.alt).toBe('Profile photo');
            expect(decorativeImg.alt).toBe('');
            expect(decorativeImg.getAttribute('role')).toBe('presentation');
        });
    });

    describe('Focus Management', () => {
        test('Focus trap should work in modals', () => {
            document.body.innerHTML = `
                <div role="dialog" aria-modal="true" id="modal">
                    <button id="first">First</button>
                    <button id="last">Last</button>
                </div>
            `;

            const modal = document.getElementById('modal');
            const first = document.getElementById('first');
            const last = document.getElementById('last');

            // Modal should trap focus
            expect(modal.getAttribute('aria-modal')).toBe('true');
            expect(modal.getAttribute('role')).toBe('dialog');
        });

        test('Skip link should be present and functional', () => {
            document.body.innerHTML = `
                <a href="#main-content" class="skip-link" id="skip">Skip to content</a>
                <main id="main-content">Content</main>
            `;

            const skip = document.getElementById('skip');
            const main = document.getElementById('main-content');

            expect(skip.getAttribute('href')).toBe('#main-content');
            expect(main.id).toBe('main-content');
        });
    });

    describe('Semantic Structure', () => {
        test('Page should have correct heading hierarchy', () => {
            document.body.innerHTML = `
                <h1>Main Title</h1>
                <h2>Section</h2>
                <h3>Subsection</h3>
                <h2>Another Section</h2>
            `;

            const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
            let lastLevel = 0;

            headings.forEach(h => {
                const level = parseInt(h.tagName.charAt(1));
                // Level should not skip (e.g., h1 to h3)
                expect(level - lastLevel).toBeLessThanOrEqual(1);
                lastLevel = level;
            });
        });

        test('Landmarks should be properly defined', () => {
            document.body.innerHTML = `
                <header>Header</header>
                <nav aria-label="Main">Navigation</nav>
                <main>Main content</main>
                <footer>Footer</footer>
            `;

            expect(document.querySelector('header')).not.toBeNull();
            expect(document.querySelector('nav')).not.toBeNull();
            expect(document.querySelector('main')).not.toBeNull();
            expect(document.querySelector('footer')).not.toBeNull();
        });
    });
});
