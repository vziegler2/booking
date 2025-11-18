/**
 * Theme Management Module
 * Handles dark/light mode switching
 */

class ThemeManager {
    constructor() {
        this.theme = this.getInitialTheme();
        this.init();
    }

    getInitialTheme() {
        // Check localStorage first
        const saved = localStorage.getItem('theme');
        if (saved) return saved;

        // Check system preference
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }

        return 'light';
    }

    init() {
        this.applyTheme(this.theme);
        this.createSwitcher();
        this.listenToSystemChanges();
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.theme = theme;

        // Update meta theme-color
        const metaTheme = document.querySelector('meta[name="theme-color"]');
        if (metaTheme) {
            metaTheme.content = theme === 'dark' ? '#0a1628' : '#ffffff';
        }
    }

    createSwitcher() {
        const switcher = document.createElement('button');
        switcher.className = 'theme-switcher';
        switcher.setAttribute('aria-label', 'Theme wechseln');
        switcher.innerHTML = `
            <span class="theme-icon sun">☀️</span>
            <span class="theme-icon moon">🌙</span>
        `;

        // Insert in navbar
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            navbar.insertBefore(switcher, navbar.querySelector('.burger'));
        }

        // Event listener
        switcher.addEventListener('click', () => {
            const newTheme = this.theme === 'dark' ? 'light' : 'dark';
            this.applyTheme(newTheme);
            this.updateSwitcher();
        });

        this.updateSwitcher();
    }

    updateSwitcher() {
        const switcher = document.querySelector('.theme-switcher');
        if (switcher) {
            switcher.classList.toggle('dark', this.theme === 'dark');
        }
    }

    listenToSystemChanges() {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            // Only auto-switch if user hasn't manually set preference
            if (!localStorage.getItem('theme')) {
                this.applyTheme(e.matches ? 'dark' : 'light');
                this.updateSwitcher();
            }
        });
    }
}

// Initialize theme manager
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeManager;
}
