/**
 * FAQ Chatbot Component
 * Provides automated responses to common questions
 */

class SAPChatbot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.faqs = this.loadFAQs();
        this.init();
    }

    loadFAQs() {
        return {
            // Services
            'leistungen|services|angebot': {
                de: 'Ich biete folgende Leistungen an:\n• ABAP-Entwicklung\n• SAP Fiori/UI5\n• S/4HANA Migration\n• SAP Integration (BTP, CPI)\n• Beratung & Workshops',
                en: 'I offer the following services:\n• ABAP Development\n• SAP Fiori/UI5\n• S/4HANA Migration\n• SAP Integration (BTP, CPI)\n• Consulting & Workshops'
            },
            // Pricing
            'preis|kosten|stundensatz|price|cost|rate': {
                de: 'Meine Stundensätze:\n• Remote-Entwicklung: ab 95€/h\n• Vor-Ort-Einsatz: ab 120€/h\n• Festpreis-Projekte: auf Anfrage\n\nKontaktieren Sie mich für ein individuelles Angebot.',
                en: 'My hourly rates:\n• Remote development: from €95/h\n• On-site work: from €120/h\n• Fixed-price projects: on request\n\nContact me for a custom quote.'
            },
            // Availability
            'verfügbar|frei|termin|available|free|appointment': {
                de: 'Ich bin Mo-Fr von 9:00 - 18:00 Uhr erreichbar. Für Projektanfragen nutzen Sie bitte das Buchungsformular unten auf der Seite.',
                en: 'I am available Mon-Fri from 9:00 AM - 6:00 PM. For project inquiries, please use the booking form at the bottom of the page.'
            },
            // Experience
            'erfahrung|jahre|projekte|experience|years|projects': {
                de: 'Ich habe über 10 Jahre Erfahrung in der SAP-Entwicklung und habe mehr als 50 Projekte erfolgreich abgeschlossen. Meine Expertise umfasst ABAP, Fiori, S/4HANA und Cloud-Integration.',
                en: 'I have over 10 years of experience in SAP development and have successfully completed more than 50 projects. My expertise includes ABAP, Fiori, S/4HANA and cloud integration.'
            },
            // Technologies
            'abap|fiori|ui5|s4hana|btp|technologie|technology': {
                de: 'Meine technischen Kompetenzen:\n• ABAP/4 & ABAP OO\n• SAP Fiori & SAPUI5\n• S/4HANA & CDS Views\n• SAP BTP & Integration\n• OData & REST APIs',
                en: 'My technical skills:\n• ABAP/4 & ABAP OO\n• SAP Fiori & SAPUI5\n• S/4HANA & CDS Views\n• SAP BTP & Integration\n• OData & REST APIs'
            },
            // Contact
            'kontakt|email|telefon|contact|phone': {
                de: 'Sie erreichen mich unter:\n• E-Mail: kontakt@sap-entwickler.de\n• Telefon: +49 123 456 7890\n\nOder nutzen Sie das Buchungsformular für eine Projektanfrage.',
                en: 'You can reach me at:\n• Email: kontakt@sap-entwickler.de\n• Phone: +49 123 456 7890\n\nOr use the booking form for a project inquiry.'
            },
            // Payment
            'zahlung|bezahlung|rechnung|payment|invoice': {
                de: 'Ich akzeptiere folgende Zahlungsmethoden:\n• Rechnung\n• SEPA-Überweisung\n• PayPal\n• Kreditkarte\n• Und weitere...',
                en: 'I accept the following payment methods:\n• Invoice\n• SEPA transfer\n• PayPal\n• Credit card\n• And more...'
            },
            // Default
            'default': {
                de: 'Entschuldigung, ich habe Ihre Frage nicht verstanden. Sie können mich zu folgenden Themen fragen:\n• Leistungen\n• Preise\n• Verfügbarkeit\n• Erfahrung\n• Technologien\n• Kontakt\n\nOder nutzen Sie das Buchungsformular für eine direkte Anfrage.',
                en: 'Sorry, I didn\'t understand your question. You can ask me about:\n• Services\n• Prices\n• Availability\n• Experience\n• Technologies\n• Contact\n\nOr use the booking form for a direct inquiry.'
            }
        };
    }

    init() {
        this.createWidget();
        this.attachEventListeners();
    }

    createWidget() {
        const widget = document.createElement('div');
        widget.className = 'chatbot-widget';
        widget.innerHTML = `
            <button class="chatbot-toggle" aria-label="Chat öffnen">
                <span class="chatbot-icon">💬</span>
                <span class="chatbot-close">✕</span>
            </button>
            <div class="chatbot-container" aria-hidden="true">
                <div class="chatbot-header">
                    <h4>FAQ-Assistent</h4>
                    <span class="chatbot-status">Online</span>
                </div>
                <div class="chatbot-messages" role="log" aria-live="polite">
                    <div class="chatbot-message bot">
                        <p>${this.getGreeting()}</p>
                    </div>
                </div>
                <form class="chatbot-input" onsubmit="return false;">
                    <input type="text"
                           placeholder="Stellen Sie eine Frage..."
                           aria-label="Nachricht eingeben"
                           autocomplete="off">
                    <button type="submit" aria-label="Nachricht senden">
                        <span>➤</span>
                    </button>
                </form>
            </div>
        `;
        document.body.appendChild(widget);
    }

    getGreeting() {
        const lang = document.documentElement.lang || 'de';
        if (lang === 'en') {
            return 'Hello! How can I help you? You can ask me about my services, prices or availability.';
        }
        return 'Hallo! Wie kann ich Ihnen helfen? Sie können mich zu meinen Leistungen, Preisen oder Verfügbarkeit fragen.';
    }

    attachEventListeners() {
        const toggle = document.querySelector('.chatbot-toggle');
        const container = document.querySelector('.chatbot-container');
        const input = document.querySelector('.chatbot-input input');
        const form = document.querySelector('.chatbot-input');

        toggle.addEventListener('click', () => {
            this.isOpen = !this.isOpen;
            container.classList.toggle('open', this.isOpen);
            container.setAttribute('aria-hidden', !this.isOpen);
            toggle.classList.toggle('active', this.isOpen);

            if (this.isOpen) {
                input.focus();
            }
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const message = input.value.trim();
            if (message) {
                this.sendMessage(message);
                input.value = '';
            }
        });

        // Quick responses
        document.querySelectorAll('.chatbot-quick-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.sendMessage(btn.dataset.question);
            });
        });
    }

    sendMessage(text) {
        const messagesContainer = document.querySelector('.chatbot-messages');

        // Add user message
        const userMsg = document.createElement('div');
        userMsg.className = 'chatbot-message user';
        userMsg.innerHTML = `<p>${this.escapeHtml(text)}</p>`;
        messagesContainer.appendChild(userMsg);

        // Simulate typing
        const typing = document.createElement('div');
        typing.className = 'chatbot-message bot typing';
        typing.innerHTML = '<p>...</p>';
        messagesContainer.appendChild(typing);

        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Generate response
        setTimeout(() => {
            typing.remove();
            const response = this.generateResponse(text);
            const botMsg = document.createElement('div');
            botMsg.className = 'chatbot-message bot';
            botMsg.innerHTML = `<p>${response.replace(/\n/g, '<br>')}</p>`;
            messagesContainer.appendChild(botMsg);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 1000);
    }

    generateResponse(input) {
        const lang = document.documentElement.lang || 'de';
        const lowerInput = input.toLowerCase();

        for (const [pattern, responses] of Object.entries(this.faqs)) {
            if (pattern === 'default') continue;

            const keywords = pattern.split('|');
            if (keywords.some(keyword => lowerInput.includes(keyword))) {
                return responses[lang] || responses['de'];
            }
        }

        return this.faqs['default'][lang] || this.faqs['default']['de'];
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize chatbot when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.sapChatbot = new SAPChatbot();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SAPChatbot;
}
