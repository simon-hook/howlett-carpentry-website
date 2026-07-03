// Preloader: fade out once the page has loaded, but never before it has been
// on screen for a full second, so the branding registers even on fast
// connections. The inline CSS in index.html carries a 5s timeout animation
// as a fallback if this script never runs.
const preloader = document.getElementById('preloader');
if (preloader) {
  const MIN_SHOW_MS = 1000;
  const hidePreloader = () => {
    const remaining = Math.max(0, MIN_SHOW_MS - performance.now());
    setTimeout(() => preloader.classList.add('done'), remaining);
  };
  if (document.readyState === 'complete') {
    hidePreloader();
  } else {
    window.addEventListener('load', hidePreloader);
  }
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
  '.about-inner, .services-grid, .gallery-grid, .testimonial-grid, .contact-inner'
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

// Before/after gallery reveal. The buttons ship disabled in the HTML so they
// aren't a dead, clickable-looking UI if this script never runs.
document.querySelectorAll('[data-before-after]').forEach((tile) => {
  const updateLabel = () => {
    const showing = tile.classList.contains('revealed') ? 'after' : 'before';
    const hidden = showing === 'after' ? 'before' : 'after';
    tile.setAttribute(
      'aria-label',
      `${tile.dataset.project} — showing the ${showing} photo. Activate to show the ${hidden} photo.`
    );
  };
  tile.addEventListener('click', () => {
    tile.classList.toggle('revealed');
    updateLabel();
  });
  updateLabel();
  tile.disabled = false;
});

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
