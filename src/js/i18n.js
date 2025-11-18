/**
 * Internationalization (i18n) Module
 * Handles language switching and translations
 */

class I18n {
    constructor() {
        this.currentLang = localStorage.getItem('lang') ||
                          navigator.language.split('-')[0] ||
                          'de';
        this.translations = {};
        this.supportedLangs = ['de', 'en'];
        this.init();
    }

    async init() {
        await this.loadTranslations(this.currentLang);
        this.createLanguageSwitcher();
        this.applyTranslations();
    }

    async loadTranslations(lang) {
        try {
            const response = await fetch(`/locales/${lang}/translations.json`);
            if (!response.ok) throw new Error('Translation file not found');
            this.translations = await response.json();
            this.currentLang = lang;
            localStorage.setItem('lang', lang);
            document.documentElement.lang = lang;
        } catch (error) {
            console.warn(`Could not load translations for ${lang}:`, error);
            // Fallback to German
            if (lang !== 'de') {
                await this.loadTranslations('de');
            }
        }
    }

    createLanguageSwitcher() {
        const switcher = document.createElement('div');
        switcher.className = 'language-switcher';
        switcher.innerHTML = `
            <button class="lang-btn ${this.currentLang === 'de' ? 'active' : ''}"
                    data-lang="de"
                    aria-label="Deutsch">
                🇩🇪 DE
            </button>
            <button class="lang-btn ${this.currentLang === 'en' ? 'active' : ''}"
                    data-lang="en"
                    aria-label="English">
                🇬🇧 EN
            </button>
        `;

        // Insert after theme switcher or in navbar
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            navbar.insertBefore(switcher, navbar.querySelector('.burger'));
        }

        // Event listeners
        switcher.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const lang = btn.dataset.lang;
                if (lang !== this.currentLang) {
                    await this.loadTranslations(lang);
                    this.applyTranslations();
                    this.updateSwitcher();
                }
            });
        });
    }

    updateSwitcher() {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === this.currentLang);
        });
    }

    applyTranslations() {
        // Apply translations to elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            const translation = this.getTranslation(key);
            if (translation) {
                el.textContent = translation;
            }
        });

        // Apply to placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.dataset.i18nPlaceholder;
            const translation = this.getTranslation(key);
            if (translation) {
                el.placeholder = translation;
            }
        });

        // Apply to aria-labels
        document.querySelectorAll('[data-i18n-aria]').forEach(el => {
            const key = el.dataset.i18nAria;
            const translation = this.getTranslation(key);
            if (translation) {
                el.setAttribute('aria-label', translation);
            }
        });

        // Dispatch event for other components
        window.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { lang: this.currentLang }
        }));
    }

    getTranslation(key) {
        const keys = key.split('.');
        let value = this.translations;

        for (const k of keys) {
            if (value && typeof value === 'object') {
                value = value[k];
            } else {
                return null;
            }
        }

        return value;
    }

    t(key, replacements = {}) {
        let translation = this.getTranslation(key) || key;

        // Replace placeholders like {{name}}
        for (const [placeholder, value] of Object.entries(replacements)) {
            translation = translation.replace(
                new RegExp(`{{${placeholder}}}`, 'g'),
                value
            );
        }

        return translation;
    }
}

// Initialize i18n
document.addEventListener('DOMContentLoaded', () => {
    window.i18n = new I18n();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = I18n;
}
