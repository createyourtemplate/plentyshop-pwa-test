# Item Availability Notification Module

Dieses Modul ermöglicht es Kunden, sich für eine Verfügbarkeitsbenachrichtigung eines Artikels anzumelden. Sobald ein Artikel wieder verfügbar ist (basierend auf konfigurierbaren Bedingungen), erhält der Kunde automatisch eine E-Mail-Benachrichtigung.

## Funktionsübersicht

- **Anmeldeformular** – Kunden tragen ihre E-Mail-Adresse ein, um benachrichtigt zu werden, sobald ein Artikel wieder verfügbar ist.
- **Konfigurierbare Sichtbarkeit** – Das Formular wird nur angezeigt, wenn eine konfigurierbare Bedingung erfüllt ist (z. B. Verfügbarkeits-ID größer als 6).
- **Konfigurierbare Benachrichtigungsbedingung** – Die E-Mail wird nur versendet, wenn eine weitere Bedingung erfüllt ist (z. B. Verfügbarkeits-ID kleiner oder gleich 2).
- **Datenschutzhinweis** – Optionaler Datenschutzhinweis mit Checkbox-Zustimmung konfigurierbar.
- **Cloudflare Turnstile** – Optionaler Bot-Schutz über Cloudflare Turnstile (wird aktiviert, wenn `cloudflareTurnstileApiSiteKey` in den Site-Einstellungen gesetzt ist).
- **Double-Opt-In** – Nach der Anmeldung erhält der Kunde eine Bestätigungs-E-Mail. Über einen Link in der E-Mail wird die Anmeldung bestätigt. Das Modul verarbeitet diese Bestätigung automatisch über eine globale Route-Middleware.
- **CMS-Block** – Das Modul stellt einen CMS-Block (`ItemAvailabilityNotification`) bereit, der im PlentyONE CMS-Editor auf Produktseiten platziert werden kann.
- **Mehrsprachigkeit** – Übersetzungen für Deutsch, Englisch, Französisch und Italienisch enthalten.

## Installation

### 1. Modul in die PWA einbinden

Kopiere den Ordner `itemAvailabilityNotification` in das Verzeichnis `apps/web/modules/` der PlentyONE Shop PWA:

```
apps/web/modules/itemAvailabilityNotification/
```

Registriere das Modul anschließend in der Nuxt-Konfiguration (`apps/web/nuxt.config.ts`):

```ts
modules: [
  // ... andere Module
  './modules/itemAvailabilityNotification',
],
```

### 2. Server-Extension einbinden

> **Hintergrund:** Die Verfügbarkeitsbenachrichtigung ist ein bestehendes Plugin im PlentyONE-Backend. Die mitgelieferte Extension erweitert den Alokai Middleware-Layer der PWA lediglich um die notwendigen Routen, damit das Frontend mit dem Backend kommunizieren kann. Die eigentliche Geschäftslogik (Speichern der Anmeldung, Versand der E-Mails) liegt vollständig im PlentyONE-Backend.

Kopiere die Datei `itemAvailabilityNotification.ts` in das Verzeichnis `apps/server/extensions/`:

```
apps/server/extensions/itemAvailabilityNotification.ts
```

### 3. Middleware-Konfiguration erweitern

Öffne `apps/server/middleware.config.ts` und importiere die Extension:

```ts
import { itemAvailabilityNotificationExtension } from './extensions/itemAvailabilityNotification';
```

Füge die Extension anschließend in der `extensions`-Funktion des `plentysystems`-Integrations-Eintrags hinzu:

```ts
extensions: (extensions: any) => [
  ...extensions,
  itemAvailabilityNotificationExtension,
],
```

Vollständiges Beispiel:

```ts
import dotenv from 'dotenv';
import * as path from 'path';
import { itemAvailabilityNotificationExtension } from './extensions/itemAvailabilityNotification';

dotenv.config({ path: path.resolve(__dirname, '../web/.env') });

const config = {
  integrations: {
    plentysystems: {
      location: '@plentymarkets/shop-api/server',
      configuration: {
        api: {
          url: process.env.API_ENDPOINT,
          securityToken: process.env.API_SECURITY_TOKEN ?? '',
        },
      },
      extensions: (extensions: any) => [...extensions, itemAvailabilityNotificationExtension],
    },
  },
};

export default config;
```

## API-Endpunkte

Das Modul registriert zwei Endpunkte im Alokai Middleware:

| Methode                                 | Beschreibung                                                                       |
| --------------------------------------- | ---------------------------------------------------------------------------------- |
| `subscribeItemAvailabilityNotification` | Meldet einen Kunden für die Benachrichtigung an. Schickt eine Bestätigungs-E-Mail. |
| `confirmItemAvailabilityNotification`   | Bestätigt die Anmeldung über den Link in der Bestätigungs-E-Mail (Double-Opt-In).  |

Die Extensions kommunizieren mit folgenden PlentyONE REST-Endpunkten:

| Extension-Methode                       | REST-Endpunkt                              |
| --------------------------------------- | ------------------------------------------ |
| `subscribeItemAvailabilityNotification` | `POST /rest/cyt/item_availability`         |
| `confirmItemAvailabilityNotification`   | `POST /rest/cyt/item_availability/confirm` |

## Double-Opt-In-Flow

1. Kunde trägt E-Mail-Adresse im Formular ein und sendet ab.
2. PlentyONE sendet eine Bestätigungs-E-Mail an den Kunden.
3. Die E-Mail enthält einen Link zurück in den Shop mit den Query-Parametern `?subscription=<wert>&hash=<token>`.
4. Die globale Route-Middleware des Moduls erkennt diese Parameter und ruft `confirmItemAvailabilityNotification` auf.
5. Je nach Ergebnis wird dem Kunden eine Erfolgs- oder Fehlermeldung angezeigt.

## CMS-Block

Der Block `ItemAvailabilityNotification` ist nach der Installation im CMS-Editor unter der Kategorie `item_availability_notification` verfügbar und kann auf Produktseiten platziert werden.

### Einstellungen im Editor

| Einstellung                          | Beschreibung                                                                        |
| ------------------------------------ | ----------------------------------------------------------------------------------- |
| **Eigene Klasse**                    | Zusätzliche CSS-Klasse für den äußeren Container                                    |
| **Formular anzeigen, wenn**          | Bedingung für die Sichtbarkeit des Formulars (Feld, Operator, Vergleichswert)       |
| **Benachrichtigung versenden, wenn** | Bedingung, ab wann PlentyONE die E-Mail verschickt (Feld, Operator, Vergleichswert) |
| **Datenschutzhinweis anzeigen**      | Zeigt einen Hinweistext mit Link zur Datenschutzerklärung                           |
| **Zustimmung per Checkbox**          | Erfordert aktive Zustimmung zur Datenschutzerklärung vor dem Absenden               |

## Projektstruktur

```
itemAvailabilityNotification/
├── index.ts                                        # Modul-Definition (Nuxt)
└── runtime/
    ├── components/
    │   ├── ItemAvailabilityNotification/
    │   │   ├── ItemAvailabilityNotification.vue    # Formular-Komponente (Frontend)
    │   │   └── types.ts
    │   └── blocks/
    │       └── ItemAvailabilityNotification/
    │           ├── ItemAvailabilityNotification.vue      # CMS-Block-Wrapper
    │           ├── ItemAvailabilityNotificationForm.vue  # CMS-Editor-Formular
    │           ├── defaults.ts                           # Block-Standardwerte & -Registrierung
    │           └── types.ts
    ├── composables/
    │   └── useItemAvailabilityNotification/
    │       ├── useItemAvailabilityNotification.ts  # subscribe & confirm
    │       └── types.ts
    ├── configuration/
    │   └── block-layout.config.ts
    ├── lang/
    │   ├── de.json
    │   ├── en.json
    │   ├── fr.json
    │   └── it.json
    ├── middleware/
    │   └── itemAvailabilityNotification.client.ts  # Double-Opt-In Route-Middleware
    └── plugins/
        └── block-layout-config.ts
```

---

> **Hinweis:** Die Server-Extension (`apps/server/extensions/itemAvailabilityNotification.ts`) ist nicht Teil des Modul-Ordners und muss separat in `apps/server/extensions/` abgelegt werden.
