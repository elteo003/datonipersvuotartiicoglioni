/* Global animations and interactions */
(() => {
  document.documentElement.classList.remove('no-js');

  // Year in footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Initialize GSAP
  const { gsap } = window;
  if (gsap) {
    gsap.registerPlugin(window.ScrollTrigger);
  }

  // Smooth scroll with Lenis
  let lenis;
  if (window.Lenis) {
    lenis = new window.Lenis({ 
      smoothWheel: true, 
      smoothTouch: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      infinite: false,
      gestureOrientation: 'vertical',
      normalizeWheel: true
    });
    
    function raf(time) {
      lenis.raf(time);
      window.requestAnimationFrame(raf);
    }
    window.requestAnimationFrame(raf);
    
    if (window.ScrollTrigger) {
      lenis.on('scroll', () => window.ScrollTrigger.update());
    }
  } else {
    // Fallback: usa solo CSS smooth scroll
    document.documentElement.style.scrollBehavior = 'smooth';
  }

  // Preloader timeline
  const preloader = document.querySelector('.preloader');
  const progressEl = document.getElementById('preloaderProgress');
  if (preloader && gsap) {
    let progress = 0;
    const fakeLoader = setInterval(() => {
      progress = Math.min(100, progress + Math.round(Math.random() * 12));
      if (progressEl) progressEl.textContent = progress + '%';
      if (progress >= 100) {
        clearInterval(fakeLoader);
        gsap.to('.preloader', { yPercent: -100, duration: 0.9, ease: 'power3.inOut', onComplete: () => preloader.remove() });
      }
    }, 120);
  }

  // SplitType for headlines
  function splitHeadlines() {
    if (!window.SplitType) return;
    document.querySelectorAll('.headline').forEach((el) => {
      // Assicurati che l'elemento sia visibile prima di applicare SplitType
      el.style.opacity = '1';
      el.style.visibility = 'visible';
      el.style.transform = 'none';
      
      const instance = new window.SplitType(el, { types: 'lines, words' });
      gsap.set(instance.lines, { overflow: 'hidden' });
      gsap.from(instance.words, { yPercent: 120, opacity: 0, duration: 1.1, ease: 'power4.out', stagger: { each: 0.035 }, scrollTrigger: { trigger: el, start: 'top 80%' } });
    });
  }

  // Generic reveal animations
  function setupReveals() {
    const fadeUps = document.querySelectorAll('[data-animate="fade-up"]');
    fadeUps.forEach((el) => {
      const delay = parseFloat(el.getAttribute('data-delay') || '0');
      gsap.fromTo(
        el,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay, scrollTrigger: { trigger: el, start: 'top 85%' } }
      );
    });

    const cards = document.querySelectorAll('[data-animate="card"]');
    cards.forEach((el) => {
      const delay = parseFloat(el.getAttribute('data-delay') || '0');
      gsap.to(el, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay, scrollTrigger: { trigger: el, start: 'top 85%' } });
    });

    const reveals = document.querySelectorAll('[data-animate="reveal"]');
    reveals.forEach((el) => {
      const delay = parseFloat(el.getAttribute('data-delay') || '0');
      gsap.fromTo(el, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay, scrollTrigger: { trigger: el, start: 'top 85%' } });
    });

    const lineReveals = document.querySelectorAll('[data-animate="reveal-lines"]');
    lineReveals.forEach((el) => {
      const text = el.textContent || '';
      const words = text.split(' ').map((w) => `<span class="word line">${w}</span>`).join(' ');
      el.innerHTML = words;
      gsap.from(el.querySelectorAll('.word'), { yPercent: 120, opacity: 0, duration: 1, ease: 'power4.out', stagger: { each: 0.05 }, scrollTrigger: { trigger: el, start: 'top 85%' } });
    });
  }

  // Parallax motion
  function setupParallax() {
    const elements = document.querySelectorAll('[data-parallax]');
    elements.forEach((el) => {
      const speed = parseFloat(el.getAttribute('data-speed') || '0.2');
      gsap.to(el, { yPercent: speed * -50, ease: 'none', scrollTrigger: { trigger: el.parentElement || el, start: 'top bottom', scrub: true } });
    });
  }

  // Magnetic buttons
  function setupMagnetic() {
    const magnets = document.querySelectorAll('.magnetic');
    magnets.forEach((btn) => {
      let xTo = gsap.quickTo(btn, 'x', { duration: 0.3, ease: 'power3' });
      let yTo = gsap.quickTo(btn, 'y', { duration: 0.3, ease: 'power3' });
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const relX = e.clientX - rect.left - rect.width / 2;
        const relY = e.clientY - rect.top - rect.height / 2;
        xTo(relX * 0.25);
        yTo(relY * 0.25);
      });
      btn.addEventListener('mouseleave', () => {
        xTo(0);
        yTo(0);
      });
    });
  }

  // Custom cursor
  function setupCursor() {
    const cursor = document.querySelector('.cursor');
    const dot = document.querySelector('.cursor-dot');
    const crown = document.querySelector('.cursor-crown');
    const ring = document.querySelector('.cursor-ring');
    if (!cursor || !dot || !ring) return;

    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    let ringX = mouseX, ringY = mouseY;
    let crownX = mouseX, crownY = mouseY;

    const move = (e) => { mouseX = e.clientX; mouseY = e.clientY; };
    window.addEventListener('mousemove', move, { passive: true });

    gsap.ticker.add(() => {
      gsap.set(dot, { x: mouseX, y: mouseY });
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      gsap.set(ring, { x: ringX, y: ringY });
      if (crown) {
        crownX += (mouseX - crownX) * 0.2;
        crownY += (mouseY - crownY) * 0.2;
        gsap.set(crown, { x: crownX, y: crownY });
      }
    });

    const interactive = 'a, button, .btn, .link, input, textarea, label';
    document.querySelectorAll(interactive).forEach((el) => {
      el.addEventListener('mouseenter', () => {
        gsap.to(ring, { scale: 1.6, duration: 0.2 });
        if (crown) gsap.to(crown, { scale: 1.3, duration: 0.2 });
      });
      el.addEventListener('mouseleave', () => {
        gsap.to(ring, { scale: 1, duration: 0.2 });
        if (crown) gsap.to(crown, { scale: 1, duration: 0.2 });
      });
    });
  }

  /**
   * Water Drop Effect - Effetto goccia d'acqua con onde concentriche
   * Genera onde trasparenti con bordi bianchi che si propagano dal punto di contatto
   */
  class WaterDropEffect {
    constructor(canvas, section) {
      this.canvas = canvas;
      this.section = section;
      this.ctx = canvas.getContext('2d');
      this.waves = [];
      this.animationId = null;
      this.isAnimating = false;
      this.dpr = window.devicePixelRatio || 1;

      this.setupCanvas();
      this.bindEvents();
    }

    /**
     * Configura il canvas con dimensioni corrette e device pixel ratio
     */
    setupCanvas() {
      if (!this.canvas.getContext) {
        console.warn('Canvas not supported in this browser');
        return;
      }

      const resizeCanvas = () => {
        const rect = this.section.getBoundingClientRect();

        // Imposta dimensioni canvas con DPR per rendering nitido
        this.canvas.width = rect.width * this.dpr;
        this.canvas.height = rect.height * this.dpr;
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';

        // Scala il context per il device pixel ratio
        this.ctx.scale(this.dpr, this.dpr);

        // Salva le dimensioni per calcoli successivi
        this.canvasWidth = rect.width;
        this.canvasHeight = rect.height;
      };

      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
    }

    /**
     * Crea una nuova onda dal punto di contatto
     * @param {number} x - Coordinata X del punto di contatto
     * @param {number} y - Coordinata Y del punto di contatto
     */
    createWave(x, y) {
      // Calcola il centro della sezione per la propagazione verso il centro
      const centerX = this.canvasWidth / 2;
      const centerY = this.canvasHeight / 2;

      // Calcola la distanza massima dal punto di contatto al centro
      const maxDistance = Math.sqrt(
        Math.pow(centerX - x, 2) + Math.pow(centerY - y, 2)
      );

      const wave = {
        x: x,
        y: y,
        radius: 0,
        maxRadius: maxDistance * 2.5, // Molto più grande per coprire tutta la scritta
        opacity: 0.8,
        speed: 1.5 + Math.random() * 0.3, // Velocità più lenta per effetto più duraturo
        thickness: 4.0 + Math.random() * 2.0, // Spessore maggiore
        life: 1.0,
        initialThickness: 0,
        centerX: centerX,
        centerY: centerY
      };

      this.waves.push(wave);
      return wave;
    }

    /**
     * Disegna un'onda sul canvas
     * @param {Object} wave - Oggetto onda da disegnare
     */
    drawWave(wave) {
      this.ctx.save();

      // Imposta opacità basata sulla vita dell'onda
      this.ctx.globalAlpha = wave.opacity * wave.life;

      // Configura stile per bordi bianchi trasparenti
      this.ctx.strokeStyle = '#ffffff';
      this.ctx.lineWidth = wave.thickness;
      this.ctx.lineCap = 'round';
      this.ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
      this.ctx.shadowBlur = 3;

      // Disegna il cerchio
      this.ctx.beginPath();
      this.ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
      this.ctx.stroke();

      this.ctx.restore();
    }

    /**
     * Aggiorna le proprietà di un'onda
     * @param {Object} wave - Onda da aggiornare
     * @param {number} deltaTime - Tempo trascorso dall'ultimo frame
     * @returns {boolean} - True se l'onda è ancora viva
     */
    updateWave(wave, deltaTime) {
      // Espandi l'onda
      wave.radius += wave.speed * deltaTime * 60;

      // Riduci la vita dell'onda più lentamente
      wave.life -= deltaTime * 0.25;

      // Calcola opacità basata sulla vita
      wave.opacity = Math.max(0, wave.life * 0.8);

      // Riduci gradualmente lo spessore
      if (wave.initialThickness === 0) {
        wave.initialThickness = wave.thickness;
      }
      wave.thickness = Math.max(0.5, wave.initialThickness * wave.life);

      // L'onda muore quando la vita finisce o raggiunge il raggio massimo
      return wave.life > 0 && wave.radius < wave.maxRadius;
    }

    /**
     * Loop di animazione principale
     */
    animate() {
      if (this.waves.length === 0) {
        this.isAnimating = false;
        return;
      }

      // Pulisci il canvas
      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

      const deltaTime = 0.016; // ~60fps

      // Aggiorna e disegna tutte le onde vive
      this.waves = this.waves.filter(wave => {
        const isAlive = this.updateWave(wave, deltaTime);
        if (isAlive) {
          this.drawWave(wave);
        }
        return isAlive;
      });

      // Continua l'animazione se ci sono onde vive
      if (this.waves.length > 0) {
        this.animationId = requestAnimationFrame(() => this.animate());
      } else {
        this.isAnimating = false;
      }
    }

    /**
     * Attiva l'effetto goccia d'acqua
     * @param {number} x - Coordinata X del punto di contatto
     * @param {number} y - Coordinata Y del punto di contatto
     */
    triggerDrop(x, y) {
      if (this.isAnimating) return;

      this.isAnimating = true;
      this.createWave(x, y);

      // Avvia l'animazione
      requestAnimationFrame(() => this.animate());
    }

    /**
     * Configura gli eventi di interazione
     */
    bindEvents() {
      const handleInteraction = (e) => {
        e.preventDefault();
        const rect = this.section.getBoundingClientRect();
        let x, y;

        // Gestisci diversi tipi di eventi
        if (e.touches && e.touches.length > 0) {
          // Touch event
          x = e.touches[0].clientX - rect.left;
          y = e.touches[0].clientY - rect.top;
        } else {
          // Mouse event
          x = e.clientX - rect.left;
          y = e.clientY - rect.top;
        }

        this.triggerDrop(x, y);
      };

      // Aggiungi listener per tutti i tipi di interazione
      this.section.addEventListener('click', handleInteraction);
      this.section.addEventListener('touchstart', handleInteraction, { passive: false });
      this.section.addEventListener('pointerdown', handleInteraction);

      // Previeni il menu contestuale su mobile
      this.section.addEventListener('contextmenu', (e) => e.preventDefault());
    }
  }

  /**
   * Setup della sezione filosofia con effetto goccia d'acqua
   * Gestisce il cambio automatico del testo dopo l'animazione delle onde
   */
  function setupPhilosophy() {
    const section = document.querySelector('.philosophy');
    const quoteEl = document.getElementById('philosophyQuote');
    const canvas = document.getElementById('waterCanvas');

    if (!section || !quoteEl || !canvas) {
      console.warn('Missing required elements for philosophy effect');
      return;
    }

    // Array di frasi filosofiche
    const philosophyQuotes = [
      "Spazi essenziali, luce calibrata, materiali nobili. Ogni dettaglio è pensato per lasciare che sia l'esperienza a parlare, con naturale fluidità.",
      "Il silenzio parla più forte delle parole.",
      "L'eleganza risiede nella semplicità.",
      "La discrezione è la forma più alta di lusso.",
      "Ogni momento è un'occasione per creare ricordi indelebili.",
      "La bellezza nasce dall'armonia tra forma e funzione.",
      "Il lusso autentico si manifesta nell'attenzione ai dettagli.",
      "La perfezione si raggiunge quando non c'è più nulla da togliere."
    ];

    // Controlla preferenze di movimento ridotto
    const prefersReducedMotion = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let currentIndex = 0;
    let isChangingText = false;

    // Inizializza l'effetto goccia d'acqua
    const waterEffect = new WaterDropEffect(canvas, section);

    /**
     * Cambia il testo della filosofia
     */
    const changeText = () => {
      if (isChangingText) return;
      isChangingText = true;

      const nextIndex = (currentIndex + 1) % philosophyQuotes.length;
      const nextText = philosophyQuotes[nextIndex];

      if (window.gsap && !prefersReducedMotion) {
        // Transizione fluida con GSAP
        gsap.to(quoteEl, {
          yPercent: -20,
          opacity: 0,
          skewY: 2,
          duration: 0.5,
          ease: 'power2.in',
          onComplete: () => {
            quoteEl.textContent = nextText;
            gsap.set(quoteEl, { yPercent: 20, opacity: 0, skewY: -2 });
            gsap.to(quoteEl, {
              yPercent: 0,
              opacity: 1,
              skewY: 0,
              duration: 0.7,
              ease: 'power2.out',
              onComplete: () => {
                currentIndex = nextIndex;
                isChangingText = false;
              }
            });
          }
        });
      } else {
        // Cambio semplice per movimento ridotto
        quoteEl.textContent = nextText;
        currentIndex = nextIndex;
        isChangingText = false;
      }
    };

    /**
     * Override della funzione animate per gestire il cambio di testo
     */
    const originalAnimate = waterEffect.animate.bind(waterEffect);
    waterEffect.animate = function () {
      const wasAnimating = this.isAnimating;
      originalAnimate();

      // Se l'animazione è appena finita, cambia il testo
      if (wasAnimating && !this.isAnimating && this.waves.length === 0) {
        setTimeout(changeText, 500); // Delay per migliore UX
      }
    };

    // Fallback per movimento ridotto
    if (prefersReducedMotion) {
      const indicator = document.createElement('div');
      indicator.className = 'philosophy-indicator';
      section.appendChild(indicator);

      const showIndicator = (x, y) => {
        indicator.style.left = x + 'px';
        indicator.style.top = y + 'px';
        indicator.style.opacity = '1';
        setTimeout(() => {
          indicator.style.opacity = '0';
        }, 300);
      };

      // Gestisci click per movimento ridotto
      section.addEventListener('click', (e) => {
        const rect = section.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        showIndicator(x, y);
        changeText();
      });
    }
  }

  // Floating blobs subtle wandering
  function animateBlobs() {
    const blobs = document.querySelectorAll('.blob');
    blobs.forEach((b) => {
      gsap.to(b, { x: () => gsap.utils.random(-80, 80), y: () => gsap.utils.random(-60, 60), duration: () => gsap.utils.random(6, 12), repeat: -1, yoyo: true, ease: 'sine.inOut' });
    });

    // mouse parallax for blobs
    const hero = document.querySelector('.hero');
    if (!hero) return;
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const cx = (e.clientX - rect.left) / rect.width - 0.5;
      const cy = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to('.blob.b1', { x: cx * 40, y: cy * 30, duration: 0.6, ease: 'power2.out' });
      gsap.to('.blob.b2', { x: cx * -35, y: cy * -25, duration: 0.6, ease: 'power2.out' });
      gsap.to('.blob.b3', { x: cx * 25, y: cy * -20, duration: 0.6, ease: 'power2.out' });
    });
  }

  // Header show/hide on scroll direction
  function setupHeader() {
    const header = document.querySelector('.site-header');
    if (!header || !window.ScrollTrigger) return;
    let last = 0;
    window.addEventListener('scroll', () => {
      const y = window.scrollY || 0;
      const down = y > last;
      last = y;
      header.style.transform = down && y > 30 ? 'translateY(-100%)' : 'translateY(0)';
    }, { passive: true });
  }

  // Dot Navigation System
  function setupDotNavigation() {
    const dotNav = document.querySelector('.dot-navigation');
    const dotItems = document.querySelectorAll('.dot-item');
    const sections = [
      { id: 'home', element: document.getElementById('home') },
      { id: 'philosophy', element: document.getElementById('philosophy') },
      { id: 'servizi', element: document.getElementById('servizi') },
      { id: 'esperienza', element: document.getElementById('esperienza') },
      { id: 'contatti', element: document.getElementById('contatti') }
    ];

    if (!dotNav || !dotItems.length || !sections.every(s => s.element)) {
      console.warn('Dot navigation elements not found');
      return;
    }

    // Show navigation on all devices for now
    function checkViewport() {
      if (window.innerWidth >= 768) {
        dotNav.classList.add('visible');
      } else {
        dotNav.classList.add('visible'); // Forza visibilità anche su mobile per debug
      }
    }

    // Initial check
    checkViewport();
    window.addEventListener('resize', checkViewport);

    // Smooth scroll to section
    function scrollToSection(sectionId) {
      const section = sections.find(s => s.id === sectionId);
      if (!section || !section.element) return;

      section.element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }

    // Update active dot based on scroll position
    function updateActiveDot() {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      let activeSection = null;
      let minDistance = Infinity;

      sections.forEach(({ element, id }) => {
        if (!element) return;

        const rect = element.getBoundingClientRect();
        const elementTop = rect.top + scrollY;
        const elementBottom = elementTop + rect.height;

        // Calculate distance from viewport center
        const viewportCenter = scrollY + windowHeight / 2;
        const elementCenter = elementTop + rect.height / 2;
        const distance = Math.abs(viewportCenter - elementCenter);

        // Check if section is in viewport
        const isInView = rect.top <= windowHeight / 2 && rect.bottom >= windowHeight / 2;

        if (isInView && distance < minDistance) {
          minDistance = distance;
          activeSection = id;
        }
      });

      // If no section is in view, find the closest one
      if (!activeSection) {
        sections.forEach(({ element, id }) => {
          if (!element) return;

          const rect = element.getBoundingClientRect();
          const elementTop = rect.top + scrollY;
          const elementBottom = elementTop + rect.height;
          const viewportCenter = scrollY + windowHeight / 2;

          // Calculate distance to viewport center
          let distance;
          if (viewportCenter < elementTop) {
            distance = elementTop - viewportCenter;
          } else if (viewportCenter > elementBottom) {
            distance = viewportCenter - elementBottom;
          } else {
            distance = 0; // Section is in view
          }

          if (distance < minDistance) {
            minDistance = distance;
            activeSection = id;
          }
        });
      }

      // Update active dot
      dotItems.forEach(dot => {
        const sectionId = dot.getAttribute('data-section');
        if (sectionId === activeSection) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }

    // Add click handlers
    dotItems.forEach(dot => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionId = dot.getAttribute('data-section');
        scrollToSection(sectionId);
      });
    });

    // Throttled scroll handler
    let scrollTimeout;
    function handleScroll() {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      scrollTimeout = setTimeout(updateActiveDot, 10);
    }

    // Listen for scroll events
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial update
    updateActiveDot();

    // Update on Lenis scroll if available
    if (window.Lenis && lenis) {
      lenis.on('scroll', updateActiveDot);
    }
  }


  // Fallback per assicurare visibilità
  function ensureVisibility() {
    // Forza visibilità di tutti i titoli
    document.querySelectorAll('.h2, .h2.headline').forEach(el => {
      el.style.opacity = '1';
      el.style.visibility = 'visible';
      el.style.transform = 'none';
    });
    
    // Forza visibilità della dot navigation
    const dotNav = document.querySelector('.dot-navigation');
    if (dotNav) {
      dotNav.style.opacity = '1';
      dotNav.style.visibility = 'visible';
      dotNav.classList.add('visible');
    }
  }

  // Kickoff
  function initializeApp() {
    try {
      // Prima assicurati che tutto sia visibile
      ensureVisibility();
      
      splitHeadlines();
      setupReveals();
      setupParallax();
      setupMagnetic();
      setupCursor();
      setupPhilosophy();
      animateBlobs();
      setupHeader();
      setupDotNavigation();
      
      // Fallback finale
      setTimeout(ensureVisibility, 1000);
    } catch (error) {
      console.error('Error during initialization:', error);
      // Fallback in caso di errore
      ensureVisibility();
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
  } else {
    initializeApp();
  }

  // Also try on window load as backup
  window.addEventListener('load', initializeApp);
})();
