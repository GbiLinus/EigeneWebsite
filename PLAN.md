# WebDesignBR – Website

Agentur-Website von Linus Asche (Gründer) und Kristian Wachholz (Mitgründer) aus Bad Rothenfelde.
Zielgruppe: lokale Betriebe, vor allem Restaurants, Cafés und Hotels im Osnabrücker Land.

## Entscheidungen

| Thema | Entscheidung |
| --- | --- |
| Name | WebDesignBR (BR = Bad Rothenfelde), vorerst kein Logo |
| Stack | Astro 7, GSAP, Lenis (Smooth Scroll), Tailwind CSS 4 |
| Look | Liquid Glass, dunkle Basis mit Farbverläufen. Umschalter Hell / System / Dunkel in der Navigation (Standard: System) |
| Sprachen | Deutsch unter `/`, Englisch unter `/en/`. Besucher mit nicht-deutschem Browser sehen unten einen kleinen Hinweis „Switch to English“ (keine automatische Weiterleitung, die kostete Ladezeit). Die gewählte Sprache wird gemerkt |
| Leistungen | NFC Google Tags (Aufsteller, Sticker, Tischaufkleber), Websites, Einrichtung und Hosting |
| Preise | Website 250–750 €, Hosting 50–100 € im Jahr. Aufsteller und Sticker: 1 Stück 40 €, 2 Stück 70 €, 3 Stück 95 €, mehr auf Anfrage. Tischaufkleber mit NFC (für WLAN, Speisekarte oder Bewertungen): erster 25 €, zweiter 20 €, dritter 17,50 €, jeder weitere 15 € |
| Mega-Bundle | Kompakt 800 €: 1 Aufsteller oder Sticker, 1 Tischaufkleber (z. B. WLAN), Website nach Wünschen mit kleinen Einschränkungen, Einrichtung, 1 Jahr Hosting gratis. Komplett ab 1.100 €: 2 Aufsteller oder Sticker, 25 Tischaufkleber, ausführliche Website ganz nach Wünschen, Einrichtung, 1 Jahr Hosting gratis, auf Wunsch eigene Domain. Darüber hinaus: Konfigurator ohne Obergrenze |
| Fotos | Vorerst keine. Team als Monogramm-Karten, Fotos später über ein Feld nachrüstbar |
| Portfolio | Leerer Zustand mit Einladung, Projekte kommen als Markdown-Dateien dazu |
| Deadline | Keine. Erst komplett bauen, dann einmal sauber launchen |

## Design-System

- **Farben (Gradierwerk bei Nacht):** Solenacht `#041B20` (Basis), Tiefsole `#0A2C33`, Sole `#3BE3C9` (Akzent, Links, Fokus), Salz `#EDF6F3` (Text), Abendlicht `#8C7BFF`, Sternengold `#FFC24B` (nur für Sterne und Preise).
- **Schrift:** Mona Sans Variable, selbst gehostet (keine Verbindung zu Google). Überschriften breit (`font-stretch` 112–125 %) und schwer, Fließtext normal. Die Speisekarten-Demo ist bewusst schmal gesetzt.
- **Glas:** Klasse `.glass` in `src/styles/global.css`. Mit `data-spec` folgt ein Glanzpunkt dem Mauszeiger.
- **Bewegung:** Eine orchestrierte Intro-Sequenz im Hero, sonst reagieren Animationen auf Nutzeraktionen. `prefers-reduced-motion` schaltet alles auf statisch.

## Hell und Dunkel

- Umschalter mit drei Stellungen in der Navigation, im mobilen Menü und im Mitarbeiterbereich: links Hell, Mitte System, rechts Dunkel.
- Standard ist System: Die Seite folgt der Einstellung des Geräts und wechselt mit, wenn sich diese ändert.
- Die Wahl wird im Browser gespeichert (`wdbr-theme`) und gilt für Website und Mitarbeiterbereich.
- Heller Modus: komplett in Lila, ohne Blau- oder Grüntöne. Hauptfarbe helles Lila (`#c392f2`, Text `#7a2fa8`), zweite Farbe `#a85fd6`, Hintergrund `#f5f1fa`, Schrift dunkles Lila `#1d1229`. Gold bleibt für Sterne und Preise, Rot für Fehler. Der dunkle Modus bleibt Türkis.
- Farben kommen aus Theme-Tokens in `src/styles/global.css` (`:root` für Dunkel, `:root[data-theme='light']` für Hell). Neue Komponenten nutzen diese Tokens statt fester Farben.

## Seitenaufbau

1. Navigation: schwebende Glas-Pille, aktiver Abschnitt mit gleitendem Indikator, Sprachumschalter
2. Hero: „Mehr Gäste. Mehr Sterne.“ mit Liquid-Glass-Linse, die der Maus folgt (auf Touch-Geräten ziehbar). Dahinter Gradierwerk-Reisig mit Sole-Tropfen
3. Leistungen: NFC-Bühne mit Tipp-Animation pro Form, Speisekarten-Demo mit Allergen-Schalter, Hosting-Checkliste
4. Projekte: leerer Zustand, bis echte Projekte da sind
5. Ablauf: vier Schritte, Linie zeichnet sich beim Scrollen
6. Preise: Mega-Bundle als hervorgehobenes Angebot, Mengenwähler für Aufsteller und Sticker, Rechner für Tischaufkleber (1–50 Stück), Website- und Hosting-Preise
7. Team: Linus und Kristian, Herkunft Bad Rothenfelde mit Koordinaten
8. Fragen: Akkordeon
9. Kontakt: Formular mit Validierung und Erfolgs-Animation
10. Footer: großer Schriftzug, Licht folgt dem Mauszeiger

Easter Egg: Konami-Code (↑ ↑ ↓ ↓ ← → ← → B A) lässt goldene Sterne statt Sole-Tropfen fallen.

## Bundle-Konfigurator

Button „Selbst konfigurieren“ auf der Bundle-Karte öffnet ein Fenster. Kunden wählen Website-Umfang und Wünsche, Anzahl Aufsteller und Sticker, Tischaufkleber (ohne Obergrenze), weitere Hosting-Jahre und eine Wunsch-Domain. Die Konfiguration geht als Anfrage (Interesse „Mega-Bundle“) in den Mitarbeiterbereich, mit einer Zusammenfassung auf Deutsch.

Richtwert:
- Passt die Auswahl in Kompakt oder Komplett, steht der feste Bundle-Preis da.
- Sonst: günstigstes passendes Bundle plus der Mehrumfang zu Einzelpreisen, der Mehrumfang mit 10 % Puffer, das Ganze auf volle 50 € aufgerundet. So fällt das echte Angebot nicht höher aus als der Richtwert.
- Preise in `site.pricing.configurator` (bestätigt): jeder weitere Aufsteller oder Sticker ab dem vierten 25 €, jedes weitere Hosting-Jahr 100 €.
- Ersparnis wird nur beim Komplett-Bundle angezeigt (`showSaved` pro Stufe).

## Mitarbeiterbereich

Nur für Linus und Kristian. Nirgends auf der Website verlinkt, für Suchmaschinen gesperrt.

| Adresse | Inhalt |
| --- | --- |
| `/anmelden/` | Login (eigene Seite, getrennt vom Bereich) |
| `/intern/` | Übersicht: neue Anfragen, eigene offene Anfragen, fälliges Hosting, Kunden |
| `/intern/anfragen/` | Alle Anfragen aus dem Kontaktformular mit Status, Zuständigkeit und Notizen. Eine Anfrage lässt sich als Kunde übernehmen |
| `/intern/kunden/` | Kundenliste mit Leistungen und Hosting-Laufzeit, Markierung bei fälliger Verlängerung |
| `/intern/termine/` | Buchungslinks von Cal.com und Anleitung für den Apple-Kalender |
| `/intern/passwort/` | Passwort ändern |

**Apple Passwörter:** Das Login-Formular nutzt `autocomplete="username"` und `current-password`, nach der Anmeldung folgt ein echter Seitenwechsel. Safari bietet danach das Sichern an. Beim Ändern schlägt Apple über `autocomplete="new-password"` und `passwordrules` ein starkes Passwort vor (mindestens 12 Zeichen). `/.well-known/change-password` führt zu „Passwort ändern“, damit Apple Passwörter direkt dorthin springen kann. Der Bereich lässt sich auf dem iPhone über „Zum Home-Bildschirm“ wie eine App ablegen.

**Demo-Modus:** Mit `PUBLIC_DEMO=true` beim Bauen (Tests und Vorschau-Builds, schreibt nichts in die echte Datenbank) oder beim Entwickeln ohne Supabase. Dann läuft alles mit Beispieldaten im Browser. Anmeldung mit `linus@webdesignbr.de` oder `kristian@webdesignbr.de`, Passwort `vorschau`. Anfragen aus dem Kontaktformular landen dann nur im eigenen Browser.

**Live ohne Supabase:** Die Demo-Zugangsdaten sind ausgeblendet, die Login-Seite sagt „Noch nicht eingerichtet“, und das Kontaktformular zeigt einen Fehler statt einer falschen Erfolgsmeldung. `npm run build` warnt in diesem Fall.

### Supabase einrichten

1. Auf supabase.com ein Projekt anlegen, Region **Frankfurt (eu-central-1)**.
2. Unter Settings den Vertrag zur Auftragsverarbeitung (DPA) abschließen.
3. Authentication > Sign In / Providers: „Allow new users to sign up“ ausschalten, Mindestlänge für Passwörter auf 12 setzen.
4. Authentication > URL Configuration: Site URL auf die Domain setzen, `https://<domain>/intern/passwort/` als Redirect URL eintragen.
5. SQL Editor: `supabase/schema.sql` ausführen. Wer die Datei schon vorher ausgeführt hat, führt nur den letzten Abschnitt „Spam-Bremse“ zusätzlich aus (höchstens 3 Anfragen pro E-Mail-Adresse und 30 insgesamt in 10 Minuten).
6. Authentication > Users > „Add user“ > „Create new user“: Linus und Kristian mit E-Mail und vorläufigem Passwort anlegen, „Auto Confirm User“ an. Einladungs-Mails gehen ohne eigenen Mailserver nur an Mitglieder des Supabase-Teams (höchstens 2 Mails pro Stunde). Das eigene Passwort legt danach jeder unter `/intern/passwort/` fest.
7. Die beiden E-Mail-Adressen in den `insert`-Befehl am Ende von `supabase/schema.sql` eintragen und nur diesen Befehl ausführen.
8. `PUBLIC_SUPABASE_URL` und `PUBLIC_SUPABASE_KEY` (Publishable Key) beim Hosting als Umgebungsvariablen eintragen, lokal in `.env` (Vorlage: `.env.example`).

Hinweis: Kostenlose Supabase-Projekte pausieren nach einer Woche ohne Nutzung. Abhilfe: ein automatischer wöchentlicher Aufruf oder der Pro-Tarif.

### Cal.com einrichten

Jeder legt ein eigenes Konto an und verbindet seinen Apple-Kalender. Die Schritte stehen unter `/intern/termine/`. Die Buchungslinks kommen in `site.booking` in `src/config/site.ts`, danach erscheint auf der Website „Termin mit Linus“ und „Termin mit Kristian“.

## Inhalte pflegen

- **Firmendaten, Kontakt, Preise:** `src/config/site.ts`. Felder mit `null` werden auf der Seite ausgeblendet.
- **Texte (DE und EN):** `src/i18n/ui.ts`.
- **Team:** `src/content/team/*.json`. Optionale Felder: `funFact`, `email`, `photo`.
- **Projekte:** Vorlage `src/content/projects/_vorlage.md` kopieren nach `src/content/projects/de/<name>.md` und `src/content/projects/en/<name>.md`. Karten und Case-Study-Seiten entstehen automatisch.

## Performance

Lighthouse (lokal gemessen, Startseite): Desktop 100 / 100 / 100 / 100, Mobil 95 / 100 / 100 / 100 (Performance / Barrierefreiheit / Best Practices / SEO).

- CSS steht direkt im HTML, keine blockierenden Stylesheets
- Hauptschrift wird vorgeladen
- Hero-Animation: Reisig einmal gezeichnet, Tropfen als vorgerenderte Grafiken, in die Linse wird nur der sichtbare Ausschnitt kopiert. Auf Handys und schwächeren Geräten halbe Bildrate und weniger Tropfen
- Sitemap mit DE/EN-Verknüpfung (`/sitemap-index.xml`), `robots.txt`

## Entwicklung

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # statische Seite in dist/
npm run preview
```

## Offene Punkte

- [ ] Gewerbe anmelden (Gemeinde Bad Rothenfelde). Danach kommt vom Finanzamt der Fragebogen zur steuerlichen Erfassung, dort entscheidet ihr über die Kleinunternehmerregelung. Zu zweit seid ihr automatisch eine GbR
- [ ] Domain (steuert auch die Firmen-E-Mails)
- [x] Kontakt-E-Mail vorerst `linus.webdesignbr@gmail.com` (später Adresse mit eigener Domain)
- [ ] Telefon, Socials → `site.contact`
- [ ] Impressum: Inhaber, Rechtsform, Anschrift, ggf. USt-ID → `site.company`
- [ ] Kleinunternehmer nach § 19 UStG? Preise netto oder brutto? → `site.pricing.taxNote` (noch unklar, mit Steuerberater oder Finanzamt klären)
- [ ] Hosting-Umfang: Sind Domain, E-Mail und Updates enthalten?
- [ ] Hosting bei Netlify (Tarif Personal): Projekt aus GitHub importieren, Einstellungen stehen in `netlify.toml`. Danach Netlify in der Datenschutzerklärung nennen und `site` in `astro.config.mjs` sowie `site.url` auf die Netlify-Adresse setzen, bis die Domain steht
- [x] Supabase-Projekt eingerichtet (URL und Publishable Key in `site.supabase`), RLS geprüft: anonym nichts lesbar, Registrierung gesperrt
- [ ] Nach dem Hosting: in Supabase unter Authentication > URL Configuration die Site URL und `https://<domain>/intern/passwort/` als Redirect URL eintragen
- [x] Cal.com Linus: `https://cal.com/linus-asche`
- [ ] Cal.com Kristian: Konto anlegen, Link in `site.booking.kristian`
- [ ] Optional: E-Mail-Benachrichtigung bei neuer Anfrage (Supabase Database Webhook)
- [ ] Optional: Cloudflare Turnstile, falls Fangfeld, Mindestzeit (2,5 Sekunden) und Spam-Bremse in der Datenbank nicht reichen
- [ ] Optional: Mitarbeiterbereich unter eigener Subdomain, z. B. `intern.webdesignbr.de`
- [ ] Datenschutzerklärung prüfen lassen. Entwurf zu Supabase, Cal.com, Spamschutz und Browser-Speicher steht. Offen: Hosting-Anbieter, Grundlage für Cal.com (USA). Supabase-Region bestätigt: Frankfurt (eu-central-1). Löschfrist bestätigt: 6 Monate ohne Auftrag
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
3. Supabase eingetragen, Kontaktformular getestet: Anfrage erscheint unter `/intern/anfragen/`
4. Test auf iPhone (Safari), Android (Chrome) und Desktop (Chrome, Safari, Firefox)
5. Lighthouse-Werte prüfen
6. Google-Unternehmensprofil für WebDesignBR anlegen
