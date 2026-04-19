/* ─────────────────────────────────────────────────────────────
   DINESH SRIRAM VELAN — Portfolio  |  script.js
───────────────────────────────────────────────────────────── */

/* ── 1. Loading Screen ──────────────────────────────────────── */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => loader.classList.add('hidden'), 400);
});

/* ── 2. Theme Toggle ────────────────────────────────────────── */
const html = document.documentElement;
const themeBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

// Persist preference
const savedTheme = localStorage.getItem('portfolio-theme') || 'light';
html.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeBtn.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('portfolio-theme', next);
  updateThemeIcon(next);
});

function updateThemeIcon(theme) {
  themeIcon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
}

/* ── 3. Sticky Navbar Shadow on Scroll ──────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
  updateActiveNav();
}, { passive: true });

/* ── 4. Hamburger / Mobile Menu ─────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  const open = hamburger.classList.toggle('open');
  navLinks.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', String(open));
});

// Close mobile menu on link click
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

/* ── 5. Active Nav Link on Scroll ───────────────────────────── */
const sections = document.querySelectorAll('section[id]');

function updateActiveNav() {
  const scrollY = window.scrollY + 90;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (link) {
      link.classList.toggle('active', scrollY >= top && scrollY < top + height);
    }
  });
}

/* ── 6. Smooth Scroll (native, polyfill-safe) ───────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ── 7. Scroll Reveal Animations ────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger children of grid containers
      const delay = entry.target.closest('.skills-grid, .projects-grid')
        ? Array.from(entry.target.parentElement.children).indexOf(entry.target) * 80
        : 0;
      setTimeout(() => entry.target.classList.add('visible'), delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── 8. EmailJS Initialisation ──────────────────────────────── */
// ✅  SETUP STEPS:
//  1. Go to https://www.emailjs.com/ and sign up with dineshsriramvelan@gmail.com
//  2. Dashboard → Email Services → Add New Service → choose Gmail → Connect Account
//     Copy the "Service ID" (e.g. service_xxxxxxx) and paste it below
//  3. Dashboard → Email Templates → Create New Template
//     Set To: dineshsriramvelan@gmail.com, use {{from_name}}, {{from_email}}, {{message}}
//     Copy the "Template ID" (e.g. template_xxxxxxx) and paste it below
//  4. Dashboard → Account → API Keys → copy Public Key and paste it below

const EMAILJS_PUBLIC_KEY = 'puQa53yHBr3zy2uMG';   // 👈 Paste your Public Key here
const EMAILJS_SERVICE_ID = 'service_qxckmrk';   // 👈 Paste your Service ID here
const EMAILJS_TEMPLATE_ID = 'template_g67xsrk';  // 👈 Paste your Template ID here

emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

/* ── 9. Contact Form ────────────────────────────────────────── */
const form = document.getElementById('contact-form');
const formNotice = document.getElementById('form-notice');
const submitBtn = document.getElementById('form-submit-btn');

form.addEventListener('submit', e => {
  e.preventDefault();
  formNotice.className = 'form-notice';
  formNotice.textContent = '';

  const name = document.getElementById('form-name').value.trim();
  const email = document.getElementById('form-email').value.trim();
  const message = document.getElementById('form-message').value.trim();

  // Basic validation
  if (!name || !email || !message) {
    showNotice('Please fill in all fields.', 'error');
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showNotice('Please enter a valid email address.', 'error');
    return;
  }

  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…';

  // Template variables — must match your EmailJS template placeholders
  const templateParams = {
    from_name: name,
    from_email: email,
    message: message,
    to_name: 'Dinesh',
  };

  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
    .then(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
      showNotice(`Thanks ${name}! Your message has been sent. I'll reply to ${email} soon. ✅`, 'success');
      form.reset();
    })
    .catch(err => {
      console.error('EmailJS error:', err);
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
      // Show the actual error code/text for debugging
      const errMsg = err && err.text ? err.text : (err && err.status ? `Error ${err.status}` : JSON.stringify(err));
      showNotice(`Error: ${errMsg}`, 'error');
    });
});

function showNotice(message, type) {
  formNotice.textContent = message;
  formNotice.className = `form-notice ${type}`;
}

/* ── 10. Legacy hireMe() (keeps function alive if cached HTML) ── */
function hireMe() {
  document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
}