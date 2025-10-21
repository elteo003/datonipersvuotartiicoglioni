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
    lenis = new window.Lenis({ smoothWheel: true, smoothTouch: false });
    function raf(time) {
      lenis.raf(time);
      window.requestAnimationFrame(raf);
    }
    window.requestAnimationFrame(raf);
    if (window.ScrollTrigger) {
      lenis.on('scroll', () => window.ScrollTrigger.update());
    }
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

  // Water Drop Effect with Canvas
  class WaterDropEffect {
    constructor(canvas, section) {
      this.canvas = canvas;
      this.section = section;
      this.ctx = canvas.getContext('2d');
      this.waves = [];
      this.animationId = null;
      this.isAnimating = false;

      this.setupCanvas();
      this.bindEvents();
    }

    setupCanvas() {
      if (!this.canvas.getContext) {
        return;
      }
      
      const resizeCanvas = () => {
        const rect = this.section.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        
        // Set canvas size accounting for device pixel ratio
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
        
        // Scale context for crisp rendering
        this.ctx.scale(dpr, dpr);
      };

      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
    }

    createWave(x, y) {
      const wave = {
        x: x,
        y: y,
        radius: 0,
        maxRadius: Math.max(this.canvas.width, this.canvas.height) * 0.4, // Ridotto per essere più visibile
        opacity: 0.9,
        speed: 3.0 + Math.random() * 1.0, // Più veloce per essere più visibile
        thickness: 4.0 + Math.random() * 2, // Molto più spesso
        life: 1.0,
        initialThickness: 0
      };
      
      this.waves.push(wave);
      return wave;
    }

    drawWave(wave) {
      this.ctx.save();
      this.ctx.globalAlpha = wave.opacity * wave.life;
      
      // Use solid white color for better visibility
      this.ctx.strokeStyle = '#ffffff';
      this.ctx.lineWidth = wave.thickness;
      this.ctx.lineCap = 'round';
      this.ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
      this.ctx.shadowBlur = 2;
      
      this.ctx.beginPath();
      this.ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
      this.ctx.stroke();
      
      this.ctx.restore();
    }

    updateWave(wave, deltaTime) {
      wave.radius += wave.speed * deltaTime * 60; // Moltiplicato per 60 per velocità normale
      wave.life -= deltaTime * 0.3; // Fade più veloce
      wave.opacity = Math.max(0, wave.life * 0.9);
      
      // Thickness decreases more gradually
      if (wave.initialThickness === 0) {
        wave.initialThickness = wave.thickness;
      }
      wave.thickness = Math.max(1.0, wave.initialThickness * wave.life); // Minimo 1px
      
      return wave.life > 0 && wave.radius < wave.maxRadius;
    }

    animate() {
      if (this.waves.length === 0) {
        this.isAnimating = false;
        return;
      }

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      const deltaTime = 0.016; // ~60fps
      this.waves = this.waves.filter(wave => {
        const isAlive = this.updateWave(wave, deltaTime);
        if (isAlive) {
          this.drawWave(wave);
        }
        return isAlive;
      });

      if (this.waves.length > 0) {
        this.animationId = requestAnimationFrame(() => this.animate());
      } else {
        this.isAnimating = false;
      }
    }

    triggerDrop(x, y) {
      if (this.isAnimating) return;
      
      this.isAnimating = true;
      this.createWave(x, y);
      
      // Use requestAnimationFrame for better performance
      requestAnimationFrame(() => this.animate());
    }

    bindEvents() {
      const handleInteraction = (e) => {
        e.preventDefault();
        const rect = this.section.getBoundingClientRect();
        let x, y;
        
        // Handle different event types
        if (e.touches && e.touches.length > 0) {
          x = e.touches[0].clientX - rect.left;
          y = e.touches[0].clientY - rect.top;
        } else {
          x = e.clientX - rect.left;
          y = e.clientY - rect.top;
        }
        
        this.triggerDrop(x, y);
      };

      // Support for all interaction types with proper mobile handling
      this.section.addEventListener('click', handleInteraction);
      this.section.addEventListener('touchstart', handleInteraction, { passive: false });
      this.section.addEventListener('pointerdown', handleInteraction);
      
      // Prevent context menu on long press for mobile
      this.section.addEventListener('contextmenu', (e) => e.preventDefault());
    }
  }

  // Philosophy section with water drop effect
  function setupPhilosophy() {
    const section = document.querySelector('.philosophy');
    const quoteEl = document.getElementById('philosophyQuote');
    const source = document.getElementById('philosophySource');
    const canvas = document.getElementById('waterCanvas');
    
    if (!section || !quoteEl || !source || !canvas) {
      return;
    }

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Parse sentences from source
    const raw = (source.textContent || '').replace(/\s+/g, ' ').trim();
    const sentences = (raw.match(/[^.!?]+[.!?]/g) || [raw])
      .map((s) => s.trim())
      .filter(Boolean);

    if (!sentences.length) return;

    let currentIndex = 0;
    quoteEl.textContent = sentences[currentIndex];

    // Initialize water drop effect
    const waterEffect = new WaterDropEffect(canvas, section);
    let isChangingText = false;

    // Text change function
    const changeText = () => {
      if (isChangingText) return;
      isChangingText = true;

      const nextIndex = (currentIndex + 1) % sentences.length;
      const nextText = sentences[nextIndex];

      if (window.gsap && !prefersReducedMotion) {
        // Smooth text transition with GSAP
        gsap.to(quoteEl, {
          yPercent: -15,
          opacity: 0,
          skewY: 1,
          duration: 0.4,
          ease: 'power2.in',
          onComplete: () => {
            quoteEl.textContent = nextText;
            gsap.set(quoteEl, { yPercent: 15, opacity: 0, skewY: -1 });
            gsap.to(quoteEl, {
              yPercent: 0,
              opacity: 1,
              skewY: 0,
              duration: 0.6,
              ease: 'power2.out',
              onComplete: () => {
                currentIndex = nextIndex;
                isChangingText = false;
              }
            });
          }
        });
      } else {
        // Simple text change for reduced motion
        quoteEl.textContent = nextText;
        currentIndex = nextIndex;
        isChangingText = false;
      }
    };

    // Override animate to handle text change when animation completes
    const originalAnimate = waterEffect.animate.bind(waterEffect);
    waterEffect.animate = function() {
      const wasAnimating = this.isAnimating;
      originalAnimate();
      
      // If animation just finished, change text
      if (wasAnimating && !this.isAnimating && this.waves.length === 0) {
        setTimeout(changeText, 300); // Small delay for better UX
      }
    };

    // Reduced motion fallback
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

  // Kickoff
  function initializeApp() {
    try {
      splitHeadlines();
      setupReveals();
      setupParallax();
      setupMagnetic();
      setupCursor();
      setupPhilosophy();
      animateBlobs();
      setupHeader();
    } catch (error) {
      console.error('Error during initialization:', error);
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
