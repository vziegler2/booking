/**
 * Analytics & Monitoring Module
 * Handles Google Analytics, Sentry, and custom tracking
 */

class Analytics {
    constructor(config = {}) {
        this.config = {
            gaId: config.gaId || 'G-XXXXXXXXXX', // Replace with actual GA4 ID
            sentryDsn: config.sentryDsn || null,
            enableTracking: config.enableTracking !== false
        };
        this.init();
    }

    init() {
        if (!this.config.enableTracking) return;

        this.initGoogleAnalytics();
        this.initSentry();
        this.initCustomTracking();
        this.trackPageView();
    }

    initGoogleAnalytics() {
        // Google Analytics 4
        if (this.config.gaId && this.config.gaId !== 'G-XXXXXXXXXX') {
            const script = document.createElement('script');
            script.async = true;
            script.src = `https://www.googletagmanager.com/gtag/js?id=${this.config.gaId}`;
            document.head.appendChild(script);

            window.dataLayer = window.dataLayer || [];
            window.gtag = function() {
                window.dataLayer.push(arguments);
            };
            window.gtag('js', new Date());
            window.gtag('config', this.config.gaId, {
                send_page_view: false,
                cookie_flags: 'SameSite=None;Secure'
            });
        }
    }

    initSentry() {
        // Sentry Error Tracking
        if (this.config.sentryDsn && window.Sentry) {
            window.Sentry.init({
                dsn: this.config.sentryDsn,
                environment: window.location.hostname === 'localhost' ? 'development' : 'production',
                tracesSampleRate: 0.1,
                integrations: [
                    new window.Sentry.BrowserTracing()
                ]
            });
        }
    }

    initCustomTracking() {
        // Track outbound links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.hostname !== window.location.hostname) {
                this.trackEvent('outbound_link', {
                    url: link.href,
                    text: link.textContent.trim()
                });
            }
        });

        // Track scroll depth
        let maxScroll = 0;
        const trackScrollDepth = () => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
            );

            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;

                // Track at 25%, 50%, 75%, 100%
                if ([25, 50, 75, 100].includes(scrollPercent)) {
                    this.trackEvent('scroll_depth', { percent: scrollPercent });
                }
            }
        };

        window.addEventListener('scroll', this.throttle(trackScrollDepth, 1000));

        // Track time on page
        let startTime = Date.now();
        window.addEventListener('beforeunload', () => {
            const timeSpent = Math.round((Date.now() - startTime) / 1000);
            this.trackEvent('time_on_page', { seconds: timeSpent });
        });
    }

    trackPageView(path = window.location.pathname) {
        if (window.gtag) {
            window.gtag('event', 'page_view', {
                page_path: path,
                page_title: document.title
            });
        }
        console.log('Page view tracked:', path);
    }

    trackEvent(eventName, params = {}) {
        if (window.gtag) {
            window.gtag('event', eventName, params);
        }
        console.log('Event tracked:', eventName, params);
    }

    trackFormSubmission(formName, success = true) {
        this.trackEvent('form_submission', {
            form_name: formName,
            success: success
        });
    }

    trackError(error, context = {}) {
        // Send to Sentry
        if (window.Sentry) {
            window.Sentry.captureException(error, { extra: context });
        }

        // Track in GA
        this.trackEvent('javascript_error', {
            message: error.message,
            stack: error.stack,
            ...context
        });

        console.error('Error tracked:', error);
    }

    // Utility: Throttle function
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Performance tracking
    trackPerformance() {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const timing = performance.timing;
                    const metrics = {
                        dns: timing.domainLookupEnd - timing.domainLookupStart,
                        tcp: timing.connectEnd - timing.connectStart,
                        ttfb: timing.responseStart - timing.requestStart,
                        domLoad: timing.domContentLoadedEventEnd - timing.navigationStart,
                        windowLoad: timing.loadEventEnd - timing.navigationStart
                    };

                    this.trackEvent('performance', metrics);
                }, 0);
            });
        }

        // Core Web Vitals
        if ('web-vital' in window) {
            window.webVitals.getCLS((metric) => this.trackEvent('CLS', { value: metric.value }));
            window.webVitals.getFID((metric) => this.trackEvent('FID', { value: metric.value }));
            window.webVitals.getLCP((metric) => this.trackEvent('LCP', { value: metric.value }));
        }
    }
}

// Initialize analytics
document.addEventListener('DOMContentLoaded', () => {
    window.analytics = new Analytics({
        gaId: 'G-XXXXXXXXXX', // Replace with actual ID
        sentryDsn: null, // Replace with actual DSN
        enableTracking: true
    });
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Analytics;
}
