---
title: "SAP Fiori Elements: Schnelle App-Entwicklung mit wenig Code"
date: "2024-01-20"
author: "SAP Developer"
category: "Fiori"
tags: ["Fiori", "UI5", "RAP", "CDS"]
excerpt: "Erfahren Sie, wie Sie mit Fiori Elements und dem ABAP RESTful Application Programming Model moderne Apps in Rekordzeit erstellen."
lang: "de"
---

# SAP Fiori Elements: Schnelle App-Entwicklung mit wenig Code

Fiori Elements revolutioniert die SAP-App-Entwicklung. Statt jede UI manuell zu bauen, generieren Sie professionelle Oberflächen aus Annotationen. In diesem Artikel zeige ich den kompletten Workflow.

## Was sind Fiori Elements?

Fiori Elements sind Template-basierte UIs, die automatisch aus CDS-Annotationen generiert werden. Sie bieten:

- **Konsistente UX**: Alle Apps folgen den SAP Fiori Design Guidelines
- **Schnelle Entwicklung**: 80% weniger Frontend-Code
- **Automatische Features**: Suche, Filter, Sortierung, Export

## Verfügbare Templates

1. **List Report**: Tabellarische Übersichten mit Filtermöglichkeiten
2. **Object Page**: Detailansichten mit Sections und Facets
3. **Overview Page**: Dashboards mit verschiedenen Card-Typen
4. **Analytical List Page**: Analyse-fokussierte Listen

## Praktisches Beispiel: Flugbuchungs-App

### 1. CDS View mit Annotationen

```abap
@AbapCatalog.viewEnhancementCategory: [#NONE]
@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: 'Flight Bookings'
@Metadata.allowExtensions: true

define root view entity ZI_FlightBooking
  as select from sflight
{
  key carrid     as Airline,
  key connid     as Connection,
  key fldate     as FlightDate,
      price      as Price,
      currency   as Currency,
      seatsmax   as MaxSeats,
      seatsocc   as OccupiedSeats
}
```

### 2. Metadata Extension

```abap
@Metadata.layer: #CUSTOMER
annotate view ZI_FlightBooking with
{
  @UI.facet: [
    {
      id: 'GeneralInfo',
      type: #IDENTIFICATION_REFERENCE,
      label: 'General Information',
      position: 10
    }
  ]

  @UI.lineItem: [{ position: 10 }]
  @UI.identification: [{ position: 10 }]
  Airline;

  @UI.lineItem: [{ position: 20 }]
  @UI.selectionField: [{ position: 10 }]
  FlightDate;

  @UI.lineItem: [{ position: 30 }]
  Price;
}
```

### 3. Service Definition

```abap
@EndUserText.label: 'Flight Booking Service'
define service ZUI_FLIGHTBOOKING {
  expose ZI_FlightBooking as FlightBooking;
}
```

## Vorteile im Überblick

| Aspekt | Klassisch | Fiori Elements |
|--------|-----------|----------------|
| Entwicklungszeit | Wochen | Tage |
| Code-Menge | Viel | Minimal |
| UX-Konsistenz | Manuell | Automatisch |
| Wartbarkeit | Aufwendig | Einfach |

## Wann Fiori Elements nutzen?

**Ideal für:**
- Standard-CRUD-Operationen
- Datengetriebene Apps
- Schnelle Prototypen

**Besser Freestyle:**
- Hochgradig individuelle UIs
- Komplexe Interaktionen
- Gaming-ähnliche Interfaces

## Fazit

Fiori Elements ist ein Game-Changer für SAP-Entwicklung. Mit RAP und CDS Views erstellen Sie in wenigen Stunden produktionsreife Apps. Der Schlüssel liegt in gut strukturierten Annotationen.

---

*Möchten Sie Ihre SAP-Entwicklung beschleunigen? [Buchen Sie eine Beratung](#booking) und erfahren Sie, wie Fiori Elements Ihre Projekte transformieren kann.*
