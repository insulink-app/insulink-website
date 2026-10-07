# Insulink Website – Redesign

Ziel: Die Website sieht aus wie die App. Gleiche Tokens, gleiche Schrift, gleiche Muster wie in `design/DESIGN.md`. Kein Lila-Verlauf, kein Glow, keine Pill-Labels, keine Karten-Raster aus Einzelboxen.

## Grundlagen
- Hintergrund ground `#0F1B26`, Flächen panel `#152432`, Linien `#26394B`, Text `#EAF1F6`, muted `#97A9BA`, accent `#9DAEFF`, accentText `#C4CEFF`.
- Schrift: Atkinson Hyperlegible Next (wie die App), Überschriften 800, Laufweite -0.02em; tabellarische Ziffern.
- Container max. 1120 px, 24 px Seitenrand. Abschnittsabstand 120 px.
- Abschnittskopf: kleiner Label-Text in accentText (KEIN Pill/Badge, keine Großbuchstaben), H2 clamp(30–44 px), Lead 18 px muted.
- Gruppen von Inhalten = EIN Panel mit 1-px-Trennlinien (wie die Listen in der App), Radius 24.
- Buttons: Höhe 52, Radius 26; primär accent mit dunklem Text, sekundär `#1E3042`. Keine Outline-Buttons.

## Aufbau
1. **Navigation** liegt IN der Hero-Fläche (nicht sticky, keine eigene Leiste): Logo ∞ Insulink in navy, Links in navy 78 %, rechts DE, Hell/Dunkel (Kreise in navy 10 %), „Anmelden“ als navy Button. Unter 760 px nur Logo + Aktionen.
2. **Hero** (wie das Original, aber flach und moderner): volle Breite in accent `#9DAEFF`, Text in navy `#0F1B26`. KEIN Verlauf, kein Glow, kein Label über der Überschrift. Feste Höhe, kein 100vh. Alles im ersten Bildschirm (siehe screens/website-above-the-fold.png, 1440×900).
   - **Links:** H1 in drei Zeilen (clamp 44–80 px, Zeilenhöhe 0.98, -0.04em), Lead 19 px navy 78 %, Buttons „Panel öffnen“ (navy, heller Text) und „GitHub“ (navy 10 %). Darunter mit etwas Abstand klein der Hinweis „kein Medizinprodukt“. Keine Simulator-Schalter auf der Seite.
   - **Rechts:** das GANZE Handy mit dem Live-Simulator (Rahmen 414×868, auf 82 % skaliert ≈ 340×712), dahinter drei feine Kreise in navy 10 %.
   - Unter 860 px untereinander, Handy zentriert.
Jeder Abschnitt hat ein eigenes Layout, damit die Seite nicht gleichförmig wirkt:

4. **Die Idee – Statement:** zentriert, KEIN Label/H2-Muster. Ein großer Satz (clamp 34–60 px, 800): „Deine Glukosedaten gehören *dir*. Nicht dem Hersteller.“ („dir“ in accentText), darunter ein Absatz. Drei Punkte ohne Kasten, nur mit 2-px-Linie links (erste accent, andere line), Icon, Titel, ein Satz.
5. **Funktionen – Bento:** Kopf zweispaltig (Label + H2 links, kurzer Text rechts unten bündig). Darunter ein Raster aus einzelnen Kacheln (Radius 28, gap 16) mit kleinen Live-Visualisierungen:
   - Predictor (2 Spalten breit): realistischer Tagesverlauf als durchgehende, geglättete Linie (3 px; im Ziel grün, Abschnitte über 180 amber), Frühstücks-Spitze am Morgen, ruhiger Vormittag, Anstieg nach dem Mittagessen bis „jetzt“ (heller Punkt). Rechts davon leicht grau hinterlegt die nächste Stunde: gestrichelte Prognoselinie in GRAU (muted #97A9BA, nicht blau) mit sich öffnender Spannbreite (muted 16 %), Höchstwert grau markiert („~180 um 13:50“). Zielbereich 70–180 dezent hinterlegt, Grenzlinien gestrichelt. Achse: 8 / 10 / 12 Uhr, „jetzt“, „+1 h“. Legende: Messwerte alle 5 min, Prognose mit Spannbreite.
   - Live & Alarme (Werte passen zusammen): „92 ↘“ groß mit „mg/dL / fällt“ (high) rechts, darunter durchgehende Sparkline der letzten 3 h (grün, nach links ausblendend, heller Endpunkt), die zum Ende hin abfällt, darunter eine Push-Benachrichtigung im Stil des Systems (App-Icon, „Insulink · jetzt“, „Vorwarnung: niedrig in ca. 20 min“, „92 mg/dL, fallend“) mit einer angedeuteten zweiten Benachrichtigung dahinter.
   - Pumpe & Bolus: „2,1 E“, 10-Segment-Balken Reservoir, Zeile Reservoir/Pod.
   - Dashboard (2 Spalten breit): Zeit-im-Zielbereich-Balken (niedrig/im Ziel/hoch) mit Legende.
   - Unter 720 px alle Kacheln einspaltig.
6. **Ökosystem – eigene Fläche:** volle Breite in panel `#152432` (Abstand oben 140, innen 110). Kopf zweispaltig (H2 „Vier Teile. Ein offenes System.“ links, Text rechts). Darunter vier Bausteine als Ablauf nebeneinander, verbunden durch Linien mit Pfeilspitze (App → API → Panel → Predictor). Bausteine auf ground, App hervorgehoben (accent-Rand, gefüllter Icon-Kreis). Unter 900 px 2×2 ohne Pfeile.
   - **Animation (Datenfluss):** Verbindungslinien 56 px breit. Ein kleiner accent-Punkt (8 px, 4-px-Halo) wandert nacheinander über die drei Verbindungen (App → API → Panel → Predictor). Sobald er ankommt, leuchtet der Ziel-Baustein kurz auf (Rand accent + 6-px-Halo, dann wieder aus). Zyklus 4 s, linear, Endlosschleife; Verzögerungen 0 / 1 / 2 s für die Punkte und 0,9 / 1,9 / 2,9 s für die Bausteine. Darunter die Zeile „So wandert jeder Messwert: vom Sensor in die App, über deine API ins Panel und zum Predictor.“
   - Bei `prefers-reduced-motion: reduce` keine Animation. Optional erst starten, wenn der Abschnitt sichtbar ist (IntersectionObserver).
7. **So geht’s:** Kopf mit Link „Anleitung auf GitHub ↗“ rechts. Drei Schritte mit Icon im Kreis (statt Ziffer), darüber kleine Zeile „Schritt 1 · ca. 2 Minuten“ (Zeitangabe in accentText). Verbindungslinie: erstes Drittel accent, Rest line (zeigt Fortschritt).
8. **Screens:** Pfeil-Buttons + Fortschrittspunkte (aktiv als 22-px-Pille). Streifen blendet rechts aus (mask-image), damit klar ist, dass er scrollt. Bilder mit Schatten, darunter Titel + kurze Beschreibung (Radfahren mit Karte, Bolusrechner, Ernährung, Glukose, Training live mit Karte, Übungsstatistiken, Alarmtöne). Bilder in `screens/shot-*.jpg` sind Platzhalter aus dem Redesign.
9. **FAQ:** links Titel, „Deine Frage ist nicht dabei?“ + Button „Auf GitHub fragen“. Rechts Akkordeon, alle Fragen mit Antwort (Texte im Referenz-HTML, bitte inhaltlich prüfen), erste offen.
10. **CTA als Klammer zum Hero:** Fläche in accent `#9DAEFF` (Container 1200, Radius 40), feine navy Kreise im Hintergrund, Logo-Kreis navy, H2 navy „Bereit, deine Daten zu besitzen?“, Buttons wie im Hero.
11. **Footer:** links Logo + Satz „Ein offenes Ökosystem für deine Glukosewerte. Gebaut in Bonn.“, rechts drei Spalten (Produkt / Projekt / Rechtliches). KEINE Unterzeile mit Lizenz oder Sprachwahl.

**Regel für alle Graphen auf der Website:** durchgehende Linien, keine Einzelpunkte.
