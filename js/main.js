// Count-up hero stats. Starts only once BOTH are true: the preloader has
// lifted (so the animation isn't spent behind the overlay) and the stats are
// actually on screen (on phones they start below the fold, and an animation
// nobody sees is a missed animation). Static HTML already holds the final
// values, so with JS off the numbers are simply correct.
let countsStarted = false;
const startCounts = () => {
  if (countsStarted) return;
  countsStarted = true;
  // Runs under prefers-reduced-motion too: a counting number is not the kind
  // of spatial movement the setting exists to avoid.
  document.querySelectorAll('[data-count]').forEach((el) => {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const suffix = el.dataset.suffix || '';
    // The markup holds the final value right now — pin its rendered width so
    // the row doesn't reflow as the counting number gains digits
    el.style.minWidth = Math.ceil(el.getBoundingClientRect().width) + 'px';
    const DURATION_MS = 1400;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / DURATION_MS);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = (target * eased).toFixed(decimals) + suffix;
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
};

let preloaderLifted = false;
let statsInView = false;
const maybeStartCounts = () => {
  if (preloaderLifted && statsInView) startCounts();
};
const statsEl = document.querySelector('.hero-stats');
if (statsEl && 'IntersectionObserver' in window) {
  const statsObserver = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        statsInView = true;
        statsObserver.disconnect();
        maybeStartCounts();
      }
    },
    { threshold: 0.5 }
  );
  statsObserver.observe(statsEl);
} else {
  statsInView = true;
}

// Preloader: fade out once the page has loaded, but never before it has been
// on screen for a full second, so the branding registers even on fast
// connections. The inline CSS in index.html carries a 5s timeout animation
// as a fallback if this script never runs.
const preloader = document.getElementById('preloader');
if (preloader) {
  const MIN_SHOW_MS = 1000;
  const finish = () => {
    preloader.classList.add('done');
    preloaderLifted = true;
    maybeStartCounts();
  };
  const hidePreloader = () => {
    const remaining = Math.max(0, MIN_SHOW_MS - performance.now());
    setTimeout(finish, remaining);
  };
  if (document.readyState === 'complete') {
    hidePreloader();
  } else {
    window.addEventListener('load', hidePreloader);
  }
  // Backstop in case 'load' never fires (a hung resource on a flaky connection)
  setTimeout(finish, 4000);
  // iOS Safari can restore the page from the back/forward cache with the
  // overlay re-shown and no new 'load' event — hide it immediately then
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) finish();
  });
} else {
  preloaderLifted = true;
  maybeStartCounts();
}

// Mobile nav toggle
const navToggle = document.getElementById('nav-toggle');
const mainNav = document.getElementById('main-nav');

navToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

mainNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Scroll reveal animation
const revealTargets = document.querySelectorAll(
  '.about-inner, .services-grid, .gallery-grid, .testimonial-grid, .faq-list, .areas-inner, .contact-inner'
);
if ('IntersectionObserver' in window) {
  revealTargets.forEach((el) => el.classList.add('reveal'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealTargets.forEach((el) => observer.observe(el));
}

// Pencil-line underline drawn under section headings as they come into view.
// Runs under prefers-reduced-motion too — a 64px line growing is too small to
// be the vestibular-trigger kind of motion the setting targets.
const headings = document.querySelectorAll('.section h2');
if ('IntersectionObserver' in window) {
  const headingObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('underline-drawn');
          headingObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  headings.forEach((h) => headingObserver.observe(h));
} else {
  headings.forEach((h) => h.classList.add('underline-drawn'));
}

// Scrollspy: highlight the nav link for the section in the middle of the view
const navLinkById = {};
mainNav.querySelectorAll('a[href^="#"]').forEach((link) => {
  navLinkById[link.getAttribute('href').slice(1)] = link;
});
if ('IntersectionObserver' in window) {
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        Object.values(navLinkById).forEach((l) => l.classList.remove('active'));
        const link = navLinkById[entry.target.id];
        if (link) link.classList.add('active');
      });
    },
    // A thin horizontal band around the middle of the viewport decides
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
  );
  document.querySelectorAll('main section[id]').forEach((s) => spy.observe(s));
}

// Before/after drag sliders. All interactive chrome stays hidden until this
// runs (.ba-ready), so without JS the tiles are plain photos of the result.
document.querySelectorAll('[data-ba-slider]').forEach((tile) => {
  const beforeImg = tile.querySelector('.ba-before');
  const divider = tile.querySelector('.ba-divider');
  // Each badge goes inside a full-tile wrapper that carries the same clip as
  // its photo, so labels only show over their own side of the divider.
  // (clip-path percentages resolve against the clipped element's own box,
  // which is why the tiny badge can't be clipped directly.)
  const wrapForClip = (badge) => {
    const wrapper = document.createElement('span');
    wrapper.className = 'ba-clip';
    badge.parentNode.insertBefore(wrapper, badge);
    wrapper.appendChild(badge);
    return wrapper;
  };
  const beforeBadgeClip = wrapForClip(tile.querySelector('.ba-badge-before'));
  const afterBadgeClip = wrapForClip(tile.querySelector('.ba-badge-after'));
  // The slider role lives on a dedicated interaction surface rather than the
  // tile: role="slider" makes every descendant presentational, so if the tile
  // itself were the slider, the expand button inside it would vanish from the
  // accessibility tree. The surface is JS-created, so without JS there is no
  // drag cursor over an inert image either.
  const surface = document.createElement('div');
  surface.className = 'ba-surface';
  tile.insertBefore(surface, tile.querySelector('.ba-expand'));

  let pos = 25;
  // Writes literal values rather than a CSS custom property: calc()+var()
  // inside clip-path is unreliable in iOS Safari.
  const setPos = (pct) => {
    pos = Math.min(100, Math.max(0, pct));
    const beforeClip = 'inset(0 ' + (100 - pos) + '% 0 0)';
    const afterClip = 'inset(0 0 0 ' + pos + '%)';
    [beforeImg, beforeBadgeClip].forEach((el) => {
      el.style.clipPath = beforeClip;
      el.style.webkitClipPath = beforeClip;
    });
    afterBadgeClip.style.clipPath = afterClip;
    afterBadgeClip.style.webkitClipPath = afterClip;
    divider.style.left = pos + '%';
    surface.setAttribute('aria-valuenow', String(Math.round(pos)));
    surface.setAttribute('aria-valuetext', Math.round(pos) + '% of the before photo shown');
  };

  surface.setAttribute('role', 'slider');
  surface.setAttribute('tabindex', '0');
  surface.setAttribute('aria-label', tile.dataset.project + ': before and after comparison. Drag or use arrow keys.');
  surface.setAttribute('aria-valuemin', '0');
  surface.setAttribute('aria-valuemax', '100');
  setPos(25);
  tile.classList.add('ba-ready');

  const markUsed = () => tile.classList.add('ba-used');
  const pctFromEvent = (event) => {
    const rect = tile.getBoundingClientRect();
    return ((event.clientX - rect.left) / rect.width) * 100;
  };

  // Mouse drags start immediately. Touches wait until the gesture shows
  // horizontal intent, so a page-scroll that merely starts on the tile
  // doesn't yank the divider to the thumb; a clean tap still repositions.
  let dragging = false;
  let pendingTouch = null;
  // Capture can throw if the pointer has already gone inactive between
  // events; losing capture just means a drag ends at the tile edge
  const capture = (event) => {
    try {
      surface.setPointerCapture(event.pointerId);
    } catch (ignored) { /* keep dragging uncaptured */ }
  };
  surface.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse') {
      dragging = true;
      markUsed();
      setPos(pctFromEvent(event));
      capture(event);
    } else {
      pendingTouch = { x: event.clientX, y: event.clientY };
    }
  });
  surface.addEventListener('pointermove', (event) => {
    if (dragging) {
      setPos(pctFromEvent(event));
      return;
    }
    if (pendingTouch) {
      const dx = Math.abs(event.clientX - pendingTouch.x);
      const dy = Math.abs(event.clientY - pendingTouch.y);
      if (dx > 6 && dx > dy) {
        // Horizontal intent: take over the gesture
        dragging = true;
        pendingTouch = null;
        markUsed();
        setPos(pctFromEvent(event));
        capture(event);
      } else if (dy > 8 && dy > dx) {
        // Vertical intent: it's a scroll, leave the divider alone
        pendingTouch = null;
      }
    }
  });
  ['pointerup', 'pointercancel'].forEach((type) =>
    surface.addEventListener(type, (event) => {
      if (pendingTouch && type === 'pointerup') {
        // A tap that never turned into a scroll or drag: jump to the tap point
        markUsed();
        setPos(pctFromEvent(event));
      }
      dragging = false;
      pendingTouch = null;
    })
  );
  surface.addEventListener('keydown', (event) => {
    const steps = { ArrowLeft: pos - 5, ArrowRight: pos + 5, Home: 0, End: 100 };
    if (event.key in steps) {
      event.preventDefault();
      markUsed();
      setPos(steps[event.key]);
    }
  });
});

// Lightbox for the finished (after) photos
const lightbox = document.getElementById('lightbox');
if (lightbox) {
  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const lightboxClose = lightbox.querySelector('.lightbox-close');
  let lastFocused = null;

  // Scroll lock that also works on iOS Safari, where overflow:hidden on the
  // body doesn't stop touch scrolling: fix the body in place at the current
  // offset, then restore the exact scroll position on close.
  let savedScrollY = 0;
  const lockScroll = () => {
    savedScrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = -savedScrollY + 'px';
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
  };
  const unlockScroll = () => {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    // scroll-behavior: smooth would animate the restore; bypass it
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, savedScrollY);
    document.documentElement.style.scrollBehavior = '';
  };

  const openLightbox = (src, alt) => {
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    lightbox.hidden = false;
    lastFocused = document.activeElement;
    lightboxClose.focus();
    lockScroll();
  };
  const closeLightbox = () => {
    lightbox.hidden = true;
    lightboxImg.src = '';
    unlockScroll();
    if (lastFocused) lastFocused.focus();
  };

  document.querySelectorAll('.ba-expand').forEach((btn) => {
    btn.disabled = false;
    btn.addEventListener('click', () => {
      const img = btn.closest('[data-ba-slider]').querySelector('.ba-after');
      openLightbox(img.currentSrc || img.src, img.alt);
    });
  });
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (event) => {
    if (lightbox.hidden) return;
    if (event.key === 'Escape') {
      closeLightbox();
    } else if (event.key === 'Tab') {
      // Focus trap: the close button is the dialog's only focusable control,
      // so Tab must not wander into the page behind the overlay
      event.preventDefault();
      lightboxClose.focus();
    }
  });
}

// Brand-text fallback if the logo image fails to load (header and footer)
document.querySelectorAll('.logo-img, .footer-logo').forEach((img) => {
  const swap = () => {
    const span = document.createElement('span');
    span.className = 'logo-text-fallback';
    span.innerHTML = 'Howlett <strong>Carpentry &amp; Joinery</strong>';
    img.replaceWith(span);
  };
  if (img.complete && img.naturalWidth === 0) {
    swap();
  } else {
    img.addEventListener('error', swap);
  }
});

// Contact form (front-end only placeholder — no backend wired up yet)
const contactForm = document.getElementById('contact-form');
const formNote = document.getElementById('form-note');

contactForm.addEventListener('submit', (event) => {
  event.preventDefault();
  formNote.textContent = "Thanks! This form isn't connected to anything yet — hook it up to an email service or backend to start receiving enquiries.";
  contactForm.reset();
});

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();
