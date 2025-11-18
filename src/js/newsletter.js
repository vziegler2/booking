/**
 * Newsletter Module
 * Handles newsletter subscription with validation
 */

class Newsletter {
    constructor() {
        this.form = null;
        this.init();
    }

    init() {
        this.createWidget();
        this.attachEventListeners();
    }

    createWidget() {
        // Check if newsletter section exists
        const existingNewsletter = document.getElementById('newsletter');
        if (existingNewsletter) {
            this.form = existingNewsletter.querySelector('form');
            return;
        }

        // Create newsletter section if it doesn't exist
        const section = document.createElement('section');
        section.id = 'newsletter';
        section.className = 'newsletter-section';
        section.innerHTML = `
            <div class="container">
                <div class="newsletter-content">
                    <div class="newsletter-text">
                        <h3>SAP Newsletter</h3>
                        <p>Bleiben Sie informiert über SAP-News, Tipps und Best Practices.</p>
                    </div>
                    <form class="newsletter-form" id="newsletter-form">
                        <div class="newsletter-input-group">
                            <input type="email"
                                   name="email"
                                   placeholder="Ihre E-Mail-Adresse"
                                   required
                                   aria-label="E-Mail für Newsletter">
                            <button type="submit">
                                Abonnieren
                            </button>
                        </div>
                        <div class="newsletter-status" role="status" aria-live="polite"></div>
                        <small class="newsletter-privacy">
                            Wir respektieren Ihre Privatsphäre. Abmeldung jederzeit möglich.
                        </small>
                    </form>
                </div>
            </div>
        `;

        // Insert before footer
        const footer = document.querySelector('footer');
        if (footer) {
            footer.parentNode.insertBefore(section, footer);
        }

        this.form = section.querySelector('form');
    }

    attachEventListeners() {
        if (!this.form) return;

        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleSubmit(e);
        });

        // Real-time validation
        const emailInput = this.form.querySelector('input[type="email"]');
        if (emailInput) {
            emailInput.addEventListener('input', () => {
                this.validateEmail(emailInput);
            });
        }
    }

    validateEmail(input) {
        const email = input.value.trim();
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        input.classList.toggle('valid', isValid && email.length > 0);
        input.classList.toggle('invalid', !isValid && email.length > 0);

        return isValid;
    }

    async handleSubmit(e) {
        const form = e.target;
        const emailInput = form.querySelector('input[type="email"]');
        const statusEl = form.querySelector('.newsletter-status');
        const submitBtn = form.querySelector('button[type="submit"]');

        if (!emailInput || !this.validateEmail(emailInput)) {
            this.showStatus(statusEl, 'error', 'Bitte geben Sie eine gültige E-Mail-Adresse ein.');
            return;
        }

        const email = emailInput.value.trim();
        const originalText = submitBtn.textContent;

        // Show loading state
        submitBtn.textContent = 'Wird gesendet...';
        submitBtn.disabled = true;

        try {
            // Simulate API call (replace with actual endpoint)
            await this.subscribeToNewsletter(email);

            // Show success
            this.showStatus(statusEl, 'success', 'Vielen Dank! Bitte bestätigen Sie Ihre Anmeldung per E-Mail.');
            form.reset();

            // Track subscription
            this.trackSubscription(email);

        } catch (error) {
            console.error('Newsletter subscription failed:', error);
            this.showStatus(statusEl, 'error', 'Anmeldung fehlgeschlagen. Bitte versuchen Sie es erneut.');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    async subscribeToNewsletter(email) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // In production, this would be an actual API call:
        // const response = await fetch('/api/newsletter/subscribe', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ email })
        // });
        // if (!response.ok) throw new Error('Subscription failed');
        // return response.json();

        // Store in localStorage for demo purposes
        const subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
        if (!subscribers.includes(email)) {
            subscribers.push(email);
            localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));
        }

        return { success: true, email };
    }

    showStatus(element, type, message) {
        if (!element) return;

        element.textContent = message;
        element.className = `newsletter-status ${type}`;

        // Auto-hide after 5 seconds
        setTimeout(() => {
            element.textContent = '';
            element.className = 'newsletter-status';
        }, 5000);
    }

    trackSubscription(email) {
        // Google Analytics tracking
        if (window.gtag) {
            window.gtag('event', 'newsletter_subscription', {
                event_category: 'engagement',
                event_label: 'Newsletter'
            });
        }

        // Custom analytics
        console.log('Newsletter subscription tracked:', email.replace(/(.{3}).*@/, '$1***@'));
    }
}

// Initialize newsletter
document.addEventListener('DOMContentLoaded', () => {
    window.newsletter = new Newsletter();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Newsletter;
}
