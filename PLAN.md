# WebDesignBR – Website

Agentur-Website von Linus Asche (Gründer) und Kristian Wachholz (Mitgründer) aus Bad Rothenfelde.
Zielgruppe: lokale Betriebe, vor allem Restaurants, Cafés und Hotels im Osnabrücker Land.

## Entscheidungen

| Thema | Entscheidung |
| --- | --- |
| Name | WebDesignBR (BR = Bad Rothenfelde), vorerst kein Logo |
| Stack | Astro 7, GSAP, Lenis (Smooth Scroll), Tailwind CSS 4 |
| Look | Liquid Glass, dunkle Basis mit Farbverläufen |
| Sprachen | Deutsch unter `/`, Englisch unter `/en/`. Erster Besuch mit nicht-deutschem Browser landet auf `/en/`, danach zählt die gewählte Sprache |
| Leistungen | NFC Google Tags (Aufsteller, Sticker, Tischaufkleber), Websites, Einrichtung und Hosting |
| Preise | Website 250–750 €, Hosting 50–100 € im Jahr, NFC 1 Stück 40 €, 2 Stück 70 €, 3 Stück 95 €, mehr auf Anfrage |
| Fotos | Vorerst keine. Team als Monogramm-Karten, Fotos später über ein Feld nachrüstbar |
| Portfolio | Leerer Zustand mit Einladung, Projekte kommen als Markdown-Dateien dazu |
| Deadline | Keine. Erst komplett bauen, dann einmal sauber launchen |

## Design-System

- **Farben (Gradierwerk bei Nacht):** Solenacht `#041B20` (Basis), Tiefsole `#0A2C33`, Sole `#3BE3C9` (Akzent, Links, Fokus), Salz `#EDF6F3` (Text), Abendlicht `#8C7BFF`, Sternengold `#FFC24B` (nur für Sterne und Preise).
- **Schrift:** Mona Sans Variable, selbst gehostet (keine Verbindung zu Google). Überschriften breit (`font-stretch` 112–125 %) und schwer, Fließtext normal. Die Speisekarten-Demo ist bewusst schmal gesetzt.
- **Glas:** Klasse `.glass` in `src/styles/global.css`. Mit `data-spec` folgt ein Glanzpunkt dem Mauszeiger.
- **Bewegung:** Eine orchestrierte Intro-Sequenz im Hero, sonst reagieren Animationen auf Nutzeraktionen. `prefers-reduced-motion` schaltet alles auf statisch.

## Seitenaufbau

1. Navigation: schwebende Glas-Pille, aktiver Abschnitt mit gleitendem Indikator, Sprachumschalter
2. Hero: „Mehr Gäste. Mehr Sterne.“ mit Liquid-Glass-Linse, die der Maus folgt (auf Touch-Geräten ziehbar). Dahinter Gradierwerk-Reisig mit Sole-Tropfen
3. Leistungen: NFC-Bühne mit Tipp-Animation pro Form, Speisekarten-Demo mit Allergen-Schalter, Hosting-Checkliste
4. Projekte: leerer Zustand, bis echte Projekte da sind
5. Ablauf: vier Schritte, Linie zeichnet sich beim Scrollen
6. Preise: interaktiver Mengenwähler für NFC, Website- und Hosting-Preise
7. Team: Linus und Kristian, Herkunft Bad Rothenfelde mit Koordinaten
8. Fragen: Akkordeon
9. Kontakt: Formular mit Validierung und Erfolgs-Animation
10. Footer: großer Schriftzug, Licht folgt dem Mauszeiger

Easter Egg: Konami-Code (↑ ↑ ↓ ↓ ← → ← → B A) lässt goldene Sterne statt Sole-Tropfen fallen.

## Inhalte pflegen

- **Firmendaten, Kontakt, Preise:** `src/config/site.ts`. Felder mit `null` werden auf der Seite ausgeblendet.
- **Texte (DE und EN):** `src/i18n/ui.ts`.
- **Team:** `src/content/team/*.json`. Optionale Felder: `funFact`, `email`, `photo`.
- **Projekte:** Vorlage `src/content/projects/_vorlage.md` kopieren nach `src/content/projects/de/<name>.md` und `src/content/projects/en/<name>.md`. Karten und Case-Study-Seiten entstehen automatisch.

## Entwicklung

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # statische Seite in dist/
npm run preview
```

## Offene Punkte

- [ ] Domain (steuert auch die Firmen-E-Mails)
- [ ] Firmen-E-Mails, Telefon, Socials → `site.contact`
- [ ] Impressum: Inhaber, Rechtsform, Anschrift, ggf. USt-ID → `site.company`
- [ ] Kleinunternehmer nach § 19 UStG? Preise netto oder brutto? → `site.pricing.taxNote`
- [ ] Hosting-Umfang: Sind Domain, E-Mail und Updates enthalten?
- [ ] Hosting-Anbieter wählen (z. B. Vercel, Netlify, Cloudflare Pages) und in der Datenschutzerklärung nennen
- [ ] Ziel für das Kontaktformular (`site.contact.formEndpoint`)
- [ ] Datenschutzerklärung fertigstellen und prüfen lassen
- [ ] Erste Projekte

## Annahmen im Text, bitte prüfen

- Hosting-Checkliste: „Domain einrichten, HTTPS-Verschlüsselung, Seite online bringen, ein fester Ansprechpartner aus der Region“
- „Im Osnabrücker Land kommen wir gern vorbei. Mit Betrieben weiter weg arbeiten wir per Telefon und E-Mail.“
- Ablauf in vier Schritten (Kennenlernen, Entwurf, Umsetzung, Online)
- Ansprache mit „ihr“ statt „Sie“
- NFC funktioniert „mit den meisten aktuellen Smartphones, ganz ohne App“

## Launch-Checkliste

1. Alle offenen Punkte oben erledigt, Vorschau-Hinweise auf Impressum und Datenschutz verschwunden
2. Domain in `astro.config.mjs` und `src/config/site.ts` eingetragen
3. Kontaktformular mit echtem Versand getestet
4. Test auf iPhone (Safari), Android (Chrome) und Desktop (Chrome, Safari, Firefox)
5. Lighthouse-Werte prüfen
6. Google-Unternehmensprofil für WebDesignBR anlegen
