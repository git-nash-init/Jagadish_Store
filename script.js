/**
 * JAGDISH CLOTH STORES — Interactive JavaScript
 * Handles: Navbar, Scroll Animations, Counters, Tour Tabs, Particles, Hamburger
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 0. PRELOADER — Dismiss after content is ready ──────────── */
  const preloader = document.getElementById('preloader');
  const hidePreloader = () => {
    if (preloader) {
      preloader.classList.add('hide');
      // Remove from DOM after transition
      setTimeout(() => preloader.remove(), 750);
    }
  };
  // Hide after 1.8s — fast enough to feel snappy, long enough to brand
  const preloaderTimer = setTimeout(hidePreloader, 1800);
  // Also hide immediately if page was already loaded (cached)
  if (document.readyState === 'complete') {
    clearTimeout(preloaderTimer);
    setTimeout(hidePreloader, 400);
  }
  window.addEventListener('load', () => {
    clearTimeout(preloaderTimer);
    setTimeout(hidePreloader, 600);
  });

  /* ── 1. NAVBAR: Scroll Glass Effect ──────────────────────── */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');

  const handleNavScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active link highlight based on scroll position
    const sections = document.querySelectorAll('section[id], footer[id]');
    let currentSection = '';
    sections.forEach(section => {
      const top    = section.offsetTop - 120;
      const bottom = top + section.offsetHeight;
      if (window.scrollY >= top && window.scrollY < bottom) {
        currentSection = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  /* ── 2. HAMBURGER MENU ────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('navLinks');

  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('open');
    document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
  });

  // Close menu on link click
  navMenu?.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (navMenu?.classList.contains('open') && !navbar.contains(e.target)) {
      hamburger.classList.remove('active');
      navMenu.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  /* ── 3. SCROLL REVEAL ANIMATIONS ─────────────────────────── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Don't unobserve — keeps animation on each visit
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    revealObserver.observe(el);
  });

  /* ── 4. COUNTER ANIMATIONS ────────────────────────────────── */
  const counters = document.querySelectorAll('.stat-number[data-target]');

  const animateCounter = (el) => {
    const target   = parseInt(el.dataset.target);
    const duration = 2000; // ms
    const start    = performance.now();

    const update = (currentTime) => {
      const elapsed  = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      const current  = Math.round(eased * target);

      // Format large numbers
      el.textContent = target >= 1000
        ? current.toLocaleString('en-IN')
        : current.toString();

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));

  /* ── 5. FLOOR TOUR TABS ───────────────────────────────────── */
  const tourTabs   = document.querySelectorAll('.tour-tab');
  const tourPanels = document.querySelectorAll('.tour-panel');

  tourTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const floor = tab.dataset.floor;

      // Update tabs
      tourTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Update panels
      tourPanels.forEach(panel => {
        panel.classList.remove('active');
        if (panel.id === `panel-${floor}`) {
          panel.classList.add('active');
        }
      });
    });
  });

  /* ── 6. HERO PARTICLES ────────────────────────────────────── */
  const particlesContainer = document.getElementById('particles');

  if (particlesContainer) {
    const PARTICLE_COUNT = 25;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');

      // Random positioning
      particle.style.left    = `${Math.random() * 100}%`;
      particle.style.top     = `${40 + Math.random() * 60}%`;
      particle.style.width   = `${1 + Math.random() * 3}px`;
      particle.style.height  = particle.style.width;
      particle.style.opacity = `${0.2 + Math.random() * 0.5}`;

      // Animation
      const dur   = `${4 + Math.random() * 8}s`;
      const delay = `${Math.random() * 6}s`;
      particle.style.setProperty('--dur', dur);
      particle.style.setProperty('--delay', delay);

      // Some gold, some white
      particle.style.background = Math.random() > 0.5
        ? '#D4AF37'
        : 'rgba(253, 248, 240, 0.7)';

      particlesContainer.appendChild(particle);
    }
  }

  /* ── 7. SMOOTH SCROLL for anchor links ───────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── 8. NAVBAR: Hide on mobile overlay when scrolling ──────── */
  let lastScrollY = window.scrollY;
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    // Only hide/show on mobile and only when menu is closed
    if (window.innerWidth <= 768 && !navMenu?.classList.contains('open')) {
      if (currentScrollY > lastScrollY && currentScrollY > 200) {
        navbar.style.transform = 'translateY(-100%)';
      } else {
        navbar.style.transform = 'translateY(0)';
      }
    }
    lastScrollY = currentScrollY;
  }, { passive: true });

  /* ── 9. ADD TRANSITION TO NAVBAR TRANSFORM ─────────────────── */
  navbar.style.transition = 'transform 0.4s cubic-bezier(0.4,0,0.2,1), background 0.4s ease, padding 0.4s ease, box-shadow 0.4s ease';

  /* ── 10. COLLECTION CARD HOVER PARALLAX ──────────────────── */
  document.querySelectorAll('.collection-card, .why-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const x      = ((e.clientX - rect.left) / rect.width  - 0.5) * 8;
      const y      = ((e.clientY - rect.top)  / rect.height - 0.5) * 8;
      card.style.transform = `translateY(-6px) rotateX(${-y}deg) rotateY(${x}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ── 11. HERO SLIDESHOW ────────────────────────── */
  const heroSlides = document.querySelectorAll('.hero-slide');
  if (heroSlides.length > 1) {
    let currentSlide = 0;
    setInterval(() => {
      heroSlides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % heroSlides.length;
      heroSlides[currentSlide].classList.add('active');
    }, 5000); // Switch every 5 seconds
  }

  /* ── 12. GOLD SHIMMER on logo hover ──────────────── */
  const logoEl = document.querySelector('.nav-logo');
  if (logoEl) {
    logoEl.addEventListener('mouseenter', () => {
      logoEl.style.filter = 'drop-shadow(0 0 12px rgba(212,175,55,0.5))';
    });
    logoEl.addEventListener('mouseleave', () => {
      logoEl.style.filter = '';
    });
  }

  /* NOTE: Preloader handles initial page visibility.
     No body opacity trick needed here. */

  console.log('%c✦ Jagdish Cloth Stores ✦', 'color: #D4AF37; font-size: 18px; font-family: serif; padding: 10px;');
  console.log('%cEst. 1957 | New Market, Dibrugarh', 'color: #A52020; font-size: 12px;');

});
