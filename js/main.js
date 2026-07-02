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

// Before/after gallery reveal
document.querySelectorAll('[data-before-after]').forEach((tile) => {
  const toggle = () => tile.classList.toggle('revealed');
  tile.addEventListener('click', toggle);
  tile.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggle();
    }
  });
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
