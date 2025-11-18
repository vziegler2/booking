# SAP Developer Booking Website

Professionelle Buchungswebseite für SAP-Entwickler mit modernem Design, umfangreichen UX-Features und vollständiger SEO-Optimierung.

## Features

### Technische Basis (Phase 1)
- **Build-System**: npm-basiertes Build-System mit ESLint und Prettier
- **CI/CD**: GitHub Actions Workflow für automatisches Deployment auf GitHub Pages
- **Code-Qualität**: Konfigurierte Linting-Regeln für JavaScript und CSS

### SEO & Sichtbarkeit (Phase 2)
- **Meta-Tags**: Vollständige OpenGraph und Twitter Card Integration
- **Strukturierte Daten**: Schema.org JSON-LD für ProfessionalService und Person
- **Sitemap & Robots**: Automatisch generierte sitemap.xml und robots.txt

### Design & Usability (Phase 3)
- **Responsive Design**: Optimiert für Desktop, Tablet und Mobile (3 Breakpoints)
- **Accessibility**: WCAG-konform mit Skip-Links, ARIA-Labels, Fokus-Styles
- **Animationen**: 12 einprägsame Keyframe-Animationen
- **Modulare CSS**: Organisiert in logische Komponenten-Blöcke

### Interaktive Features (Phase 4)
- **Kontaktformular**: Echtzeit-Validierung mit visueller Rückmeldung
- **Kalender-Integration**: Direkte Terminbuchung über Google Calendar und Outlook
- **GitHub Portfolio**: Automatische Anzeige der neuesten Repositories via GitHub API
- **12 Zahlungsoptionen**: Rechnung, SEPA, PayPal, Kreditkarte, Stripe, Klarna, etc.

## Installation

```bash
# Dependencies installieren
npm install

# Entwicklungsserver starten
npm start

# Code-Qualität prüfen
npm run lint

# Code formatieren
npm run format
```

## Projektstruktur

```
claude_code2/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions CI/CD
├── src/
│   ├── assets/
│   │   └── images/             # Bilder und Icons
│   ├── css/                    # Modulare CSS-Dateien
│   └── js/                     # JavaScript-Module
├── index.html                  # Haupt-HTML-Datei
├── styles.css                  # Haupt-Stylesheet (~1400 Zeilen)
├── script.js                   # Haupt-JavaScript (~720 Zeilen)
├── sitemap.xml                 # SEO Sitemap
├── robots.txt                  # Crawler-Anweisungen
├── package.json                # npm-Konfiguration
├── .eslintrc.json              # ESLint-Regeln
├── .prettierrc                 # Prettier-Konfiguration
├── .stylelintrc.json           # Stylelint-Regeln
└── README.md                   # Diese Datei
```

## Technologien

- **HTML5**: Semantisches Markup mit Accessibility-Features
- **CSS3**: Custom Properties, Flexbox, Grid, Animationen
- **JavaScript**: ES6+, Fetch API, Intersection Observer
- **GitHub API**: Für automatisches Repository-Display
- **GitHub Actions**: CI/CD Pipeline

## Features im Detail

### Animationen
- `fadeInUp`, `fadeInLeft`, `fadeInRight`: Einblendeffekte
- `float`: Schwebende Elemente
- `pulse`: Pulsierende Buttons
- `shimmer`: Schimmernde Effekte
- `glow`: Leuchtende Buttons
- `rotate`: Rotierende Spinner
- `typing`: Schreibmaschinen-Effekt

### Accessibility
- Skip-Link für Tastatur-Navigation
- ARIA-Labels für alle interaktiven Elemente
- Fokus-Styles für Keyboard-User
- Semantische HTML-Struktur
- Live-Regions für Statusmeldungen

### Performance
- Preconnect für Google Fonts
- Optimierte Animationen mit `transform` und `opacity`
- Intersection Observer für lazy Loading
- Minimalistische Abhängigkeiten

## Deployment

Das Projekt wird automatisch auf GitHub Pages deployed, wenn Änderungen auf den `main` oder `master` Branch gepusht werden.

**Live-URL**: https://vziegler2.github.io/claude_code2/

## Anpassung

### GitHub-Benutzername ändern
In `script.js` die Variable `username` in der Funktion `initGitHubPortfolio()` anpassen:

```javascript
const username = 'ihr-username';
```

### Kontaktdaten ändern
In `index.html` die E-Mail und Telefonnummer in der Booking-Section aktualisieren.

### Farben ändern
In `styles.css` die CSS-Variablen im `:root`-Block anpassen:

```css
:root {
    --primary: #0070f3;
    --secondary: #00d4aa;
    --dark: #0a1628;
    /* ... */
}
```

## Browser-Support

- Chrome/Edge 88+
- Firefox 78+
- Safari 14+
- Mobile Safari/Chrome

## Lizenz

MIT License

## Autor

SAP Developer - Professionelle SAP-Entwicklung
