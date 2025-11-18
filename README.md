# SAP Developer Booking Website

Vollständig automatisierte, professionelle Buchungswebseite für SAP-Entwickler mit 7 Phasen der Optimierung.

## Implementierte Features

### Phase 1: Technische Basis
- Jest Unit-Tests & Playwright E2E-Tests
- GitHub Actions CI/CD Pipeline
- ESLint, Prettier, Stylelint
- CodeQL Security Scanning
- Docker-Containerisierung

### Phase 2: SEO & Sichtbarkeit
- OpenGraph & Twitter Cards
- Schema.org strukturierte Daten
- Automatische Sitemap-Generierung
- Google Analytics Integration

### Phase 3: Design & Usability
- Dark Mode mit Theme-Switcher
- 12 Keyframe-Animationen
- WCAG-konforme Accessibility
- Responsive Design (3 Breakpoints)

### Phase 4: Interaktive Features
- 12 Zahlungsoptionen
- Kalender-Integration (Google/Outlook)
- GitHub Portfolio API
- Code-Sandbox für Live-Demos

### Phase 5: Content & Automatisierung
- Markdown Blog-System
- Mehrsprachigkeit (DE/EN)
- Newsletter-Anmeldung

### Phase 6: Erweiterte Funktionen
- FAQ-Chatbot
- Chart.js Datenvisualisierung
- Security Headers (CSP)
- Sentry Monitoring

### Phase 7: Zukunftssicherheit
- Docker & nginx
- Prometheus/Grafana Monitoring
- Automatische Backups

## Installation

```bash
npm install        # Dependencies
npm start          # Dev Server
npm test           # Alle Tests
npm run docker:build  # Docker Image
```

## Projektstruktur

```
├── .github/workflows/   # CI/CD, SEO, Backup
├── src/css/            # Modulare CSS
├── src/js/             # Feature-Module
├── tests/              # Unit & E2E Tests
├── blog/               # Markdown Posts
├── locales/            # i18n (DE/EN)
├── Dockerfile          # Container
└── docker-compose.yml  # Monitoring Stack
```

## Technologien

HTML5, CSS3, ES6+, Jest, Playwright, Docker, nginx, Prometheus, Chart.js, GitHub Actions

## Live Demo

https://vziegler2.github.io/claude_code2/

## Lizenz

MIT License
