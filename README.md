# Luna Lounge — sito statico elegante e minimal

Un sito one-page ispirato allo stile di `deda.com`, con animazioni avanzate (GSAP, ScrollTrigger, Lenis, SplitType), microinterazioni e design scuro minimalista.

## Come avviare

- Apri `index.html` direttamente nel browser, oppure
- Servi la cartella con un server statico (consigliato per testare gli import):

```bash
# Python 3
python3 -m http.server 5173
# poi apri: http://localhost:5173
```

## Struttura

- `index.html`: markup principale
- `styles.css`: tema, layout responsivo, stili tipografici
- `scripts.js`: animazioni (preloader, smooth scroll, reveal, parallax, cursor personalizzato, bottoni magnetici)

## Personalizzazione rapida

- Colori: modifica le CSS custom properties in `:root`
- Contenuti: aggiorna testi in italiano (sezioni Hero, Servizi, Esperienza, Contatti)
- Immagini: sostituisci i riquadri `div.frame` con `<img>` o background-image

## Accessibilità e performance

- Rispetta `prefers-reduced-motion`
- Header sticky con auto-hide su scroll
- Animazioni ottimizzate con `will-change` e GSAP

## Note legali

Questo progetto è fornito a scopo dimostrativo. Verifica normative locali e policy di pubblicazione prima di mettere online contenuti.
