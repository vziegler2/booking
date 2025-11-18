/**
 * Unit Tests for Utility Functions
 */

describe('Language Color Mapping', () => {
    const getLanguageColor = (language) => {
        const colors = {
            'JavaScript': '#f1e05a',
            'TypeScript': '#2b7489',
            'Python': '#3572A5',
            'Java': '#b07219',
            'ABAP': '#E8274B'
        };
        return colors[language] || '#6b7280';
    };

    test('should return correct color for known languages', () => {
        expect(getLanguageColor('JavaScript')).toBe('#f1e05a');
        expect(getLanguageColor('ABAP')).toBe('#E8274B');
        expect(getLanguageColor('Python')).toBe('#3572A5');
    });

    test('should return default color for unknown languages', () => {
        expect(getLanguageColor('Unknown')).toBe('#6b7280');
        expect(getLanguageColor('')).toBe('#6b7280');
    });
});

describe('Theme Management', () => {
    beforeEach(() => {
        localStorage.clear();
        document.documentElement.removeAttribute('data-theme');
    });

    test('should toggle theme correctly', () => {
        const toggleTheme = () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            return newTheme;
        };

        expect(toggleTheme()).toBe('dark');
        expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

        expect(toggleTheme()).toBe('light');
        expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });
});

describe('Counter Animation', () => {
    test('should animate from 0 to target', () => {
        const animateCounter = (target, duration = 1000) => {
            const steps = 60;
            const increment = target / steps;
            let current = 0;
            const values = [];

            for (let i = 0; i <= steps; i++) {
                current = Math.min(current + increment, target);
                values.push(Math.floor(current));
            }

            return values;
        };

        const values = animateCounter(100);
        expect(values[0]).toBe(1);
        expect(values[values.length - 1]).toBe(100);
    });
});

describe('Date Formatting', () => {
    test('should format dates correctly', () => {
        const formatDate = (date, locale = 'de-DE') => {
            return new Intl.DateTimeFormat(locale, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }).format(date);
        };

        const testDate = new Date('2024-01-15');
        expect(formatDate(testDate, 'de-DE')).toContain('2024');
        expect(formatDate(testDate, 'en-US')).toContain('2024');
    });
});

describe('URL Validation', () => {
    test('should validate URLs correctly', () => {
        const isValidUrl = (string) => {
            try {
                new URL(string);
                return true;
            } catch {
                return false;
            }
        };

        expect(isValidUrl('https://example.com')).toBe(true);
        expect(isValidUrl('http://localhost:3000')).toBe(true);
        expect(isValidUrl('not-a-url')).toBe(false);
        expect(isValidUrl('')).toBe(false);
    });
});
