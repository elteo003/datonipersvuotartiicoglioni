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

  // Philosophy ripple + rotating quotes
  function setupPhilosophy() {
    const section = document.querySelector('.philosophy');
    const quoteEl = document.getElementById('philosophyQuote');
    const source = document.getElementById('philosophySource');
    const ripplesLayer = section ? section.querySelector('.philosophy-ripples') : null;
    if (!section || !quoteEl || !source || !ripplesLayer) return;

    // Respect reduced motion while still providing discrete, non-animated feedback
    const prefersReducedMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    const raw = (source.textContent || '').replace(/\s+/g, ' ').trim();
    const sentences = (raw.match(/[^.!?]+[.!?]/g) || [raw])
      .map((s) => s.trim())
      .filter(Boolean);
    if (!sentences.length) return;

    let currentIndex = 0;
    quoteEl.textContent = sentences[currentIndex];

    let busy = false;
    const triggerRipple = (clientX, clientY) => {
      if (busy) return;
      const rect = section.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      // Reduced motion: provide discrete, non-animated feedback and advance text
      if (prefersReducedMotion) {
        const indicator = document.createElement('span');
        indicator.className = 'ripple-indicator';
        indicator.style.left = x + 'px';
        indicator.style.top = y + 'px';
        ripplesLayer.appendChild(indicator);

        const nextIndex = (currentIndex + 1) % sentences.length;
        const nextText = sentences[nextIndex];
        quoteEl.textContent = nextText;
        currentIndex = nextIndex;

        // Remove indicator shortly without relying on CSS animation
        setTimeout(() => indicator.remove(), 180);
        return;
      }

      busy = true;

      const RINGS = 4; // multiple concentric waves for realism
      const DURATION_BASE = 1.35;
      const STAGGER = 0.12;

      const rings = [];
      for (let i = 0; i < RINGS; i++) {
        const ring = document.createElement('span');
        ring.className = 'ripple';
        ring.style.left = x + 'px';
        ring.style.top = y + 'px';
        ring.style.animation = `rippleWave ${DURATION_BASE + i * 0.15}s ease-out ${i * STAGGER}s forwards`;
        ring.style.opacity = String(Math.max(0.6, 0.9 - i * 0.15));
        ripplesLayer.appendChild(ring);
        rings.push(ring);
      }

      let ringsCompleted = 0;
      const markOneDone = () => {
        ringsCompleted += 1;
        if (ringsCompleted >= rings.length) {
          rings.forEach((el) => el.remove());
          // advance to next sentence
          const nextIndex = (currentIndex + 1) % sentences.length;
          const nextText = sentences[nextIndex];
          if (window.gsap) {
            window.gsap.to(quoteEl, {
              // words dissolve via wave: slight skew + mask-like yPercent
              yPercent: -18,
              opacity: 0,
              skewY: 2,
              duration: 0.45,
              ease: 'power3.in',
              onComplete: () => {
                quoteEl.textContent = nextText;
                window.gsap.set(quoteEl, { yPercent: 18, opacity: 0, skewY: -2 });
                window.gsap.to(quoteEl, {
                  yPercent: 0,
                  opacity: 1,
                  skewY: 0,
                  duration: 0.7,
                  ease: 'power3.out',
                  onComplete: () => {
                    currentIndex = nextIndex;
                    busy = false;
                  }
                });
              }
            });
          } else {
            quoteEl.textContent = nextText;
            currentIndex = nextIndex;
            busy = false;
          }
        }
      };

      // Ensure cleanup if animationend does not fire
      const failSafeId = setTimeout(() => {
        rings.forEach((el) => el.remove());
        markOneDone();
      }, (DURATION_BASE + (RINGS - 1) * 0.15 + STAGGER + 0.3) * 1000);

      rings.forEach((el) => {
        el.addEventListener('animationend', () => {
          el.remove();
          markOneDone();
        }, { once: true });
      });
    };

    section.addEventListener('pointerdown', (e) => {
      triggerRipple(e.clientX, e.clientY);
    });

    // Droplet fall-in + auto ripple on enter viewport
    if (window.gsap && window.ScrollTrigger && !prefersReducedMotion) {
      const droplet = document.createElement('span');
      droplet.className = 'droplet';
      droplet.setAttribute('aria-hidden', 'true');
      ripplesLayer.appendChild(droplet);

      const tl = window.gsap.timeline({ paused: true });
      // Start above section center and fall down with gravity-like ease
      tl.set(droplet, {
        x: () => section.getBoundingClientRect().width * 0.5,
        y: -60,
        scale: 1,
        opacity: 0,
      })
      .to(droplet, {
        opacity: 1,
        duration: 0.2,
        ease: 'power1.out'
      })
      .to(droplet, {
        y: () => section.getBoundingClientRect().height * 0.45,
        duration: 0.9,
        ease: 'power2.in'
      })
      // impact: quick squash-stretch and then hide
      .to(droplet, {
        scaleX: 1.2,
        scaleY: 0.7,
        duration: 0.08,
        ease: 'power1.in'
      })
      .to(droplet, {
        scaleX: 0.9,
        scaleY: 1.1,
        duration: 0.12,
        ease: 'power1.out'
      })
      .to(droplet, { opacity: 0, duration: 0.15 }, '>-0.05')
      // trigger ripple at impact position
      .add(() => {
        const rect = section.getBoundingClientRect();
        const cx = rect.left + rect.width * 0.5;
        const cy = rect.top + rect.height * 0.45;
        triggerRipple(cx, cy);
      }, '>-0.1');

      window.ScrollTrigger.create({
        trigger: section,
        start: 'top 70%',
        once: true,
        onEnter: () => tl.play()
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
  window.addEventListener('load', () => {
    splitHeadlines();
    setupReveals();
    setupParallax();
    setupMagnetic();
    setupCursor();
    setupPhilosophy();
    animateBlobs();
    setupHeader();
  });
})();
