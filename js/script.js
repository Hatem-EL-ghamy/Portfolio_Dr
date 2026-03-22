// =========================================
// DENTAL PORTFOLIO - Script
// Dr. Abdelrahman Ashraf | Bilingual EN/AR
// =========================================

// === Language System ===
let currentLang = localStorage.getItem('portfolioLang') || 'en';

function applyLanguage(lang) {
  const html = document.getElementById('htmlRoot');
  html.setAttribute('lang', lang);
  html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

  // Update all elements with data-en / data-ar
  document.querySelectorAll('[data-en], [data-ar]').forEach(el => {
    const text = el.getAttribute(`data-${lang}`);
    if (text) {
      // Don't overwrite child elements — only set textContent if no child elements
      if (el.children.length === 0) {
        el.textContent = text;
      }
    }
  });

  // Update placeholders
  document.querySelectorAll('[data-placeholder-en]').forEach(el => {
    const ph = el.getAttribute(`data-placeholder-${lang}`);
    if (ph) el.setAttribute('placeholder', ph);
  });

  // Update select options
  document.querySelectorAll('select option[data-en]').forEach(opt => {
    const text = opt.getAttribute(`data-${lang}`);
    if (text) opt.textContent = text;
  });

  // Update page title
  const titleEl = document.querySelector('title');
  if (titleEl) {
    titleEl.textContent = titleEl.getAttribute(`data-${lang}`) || titleEl.textContent;
  }

  // Update lang toggle label
  const langLabel = document.getElementById('langLabel');
  if (langLabel) {
    langLabel.textContent = lang === 'en' ? 'العربية' : 'English';
  }

  currentLang = lang;
  localStorage.setItem('portfolioLang', lang);
}

// Init language on load
document.addEventListener('DOMContentLoaded', () => {
  applyLanguage(currentLang);
  initAOS();
  initCounters();
});

// Toggle button
document.getElementById('langToggle')?.addEventListener('click', () => {
  applyLanguage(currentLang === 'en' ? 'ar' : 'en');
});

// === Navbar scroll effect ===
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
});

// === Active nav link on scroll ===
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function setActiveLink() {
  const scrollY = window.scrollY + 120;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    if (scrollY >= top && scrollY < top + height) {
      navLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${id}"]`);
      if (active) active.classList.add('active');
    }
  });
}
window.addEventListener('scroll', setActiveLink);

// === Mobile menu ===
const hamburger = document.getElementById('hamburger');
const navLinksEl = document.getElementById('navLinks');

hamburger?.addEventListener('click', () => {
  navLinksEl.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  if (navLinksEl.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '1';
    spans[2].style.transform = '';
  }
});

navLinksEl?.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinksEl.classList.remove('open');
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '1';
    spans[2].style.transform = '';
  });
});

// === Scroll to Top ===
const scrollTopBtn = document.getElementById('scrollTop');
window.addEventListener('scroll', () => {
  if (window.scrollY > 400) scrollTopBtn?.classList.add('visible');
  else scrollTopBtn?.classList.remove('visible');
});
scrollTopBtn?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// === AOS - Animate on scroll ===
function initAOS() {
  const elements = document.querySelectorAll('[data-aos]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.getAttribute('data-delay') || 0;
        setTimeout(() => {
          entry.target.classList.add('aos-animate');
        }, parseInt(delay));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  elements.forEach(el => observer.observe(el));
}

// === Counter animation ===
function animateCounter(el, target, duration = 2000) {
  let start = 0;
  const increment = target / (duration / 16);
  const timer = setInterval(() => {
    start += increment;
    if (start >= target) {
      el.textContent = target;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(start);
    }
  }, 16);
}

function initCounters() {
  const counters = document.querySelectorAll('.stat-num');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.getAttribute('data-target'));
        animateCounter(entry.target, target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(counter => observer.observe(counter));
}

// === Smooth scroll for anchor links ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 90;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// === Contact Form → WhatsApp ===
const contactForm = document.getElementById('contactForm');
contactForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name')?.value.trim();
  const phone = document.getElementById('phone')?.value.trim();
  const service = document.getElementById('service')?.value;
  const message = document.getElementById('message')?.value.trim();

  if (!name || !phone) {
    showToast(currentLang === 'ar' ? '⚠️ يرجى ملء الاسم ورقم الهاتف' : '⚠️ Please fill in your name and phone number', 'warning');
    return;
  }

  const isAr = currentLang === 'ar';
  const text = isAr
    ? `مرحباً دكتور عبدالرحمن،\n\nاسمي: ${name}\nرقمي: ${phone}\nالخدمة: ${service || 'غير محددة'}\nرسالتي: ${message || 'لا توجد رسالة إضافية'}`
    : `Hello Dr. Abdelrahman,\n\nMy Name: ${name}\nPhone: ${phone}\nService: ${service || 'Not specified'}\nMessage: ${message || 'No additional message'}`;

  const waUrl = `https://wa.me/201275109353?text=${encodeURIComponent(text)}`;
  window.open(waUrl, '_blank');
  showToast(isAr ? '✅ سيتم تحويلك لواتساب!' : '✅ Redirecting you to WhatsApp!', 'success');
  contactForm.reset();
});

// === Toast notification ===
function showToast(msg, type = 'success') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.style.cssText = `
    position: fixed;
    bottom: 32px;
    ${document.documentElement.dir === 'rtl' ? 'left: 32px;' : 'right: 32px;'}
    background: ${type === 'success' ? 'linear-gradient(135deg, #1565c0, #1976d2)' : 'linear-gradient(135deg, #f59e0b, #d97706)'};
    color: white;
    padding: 16px 28px;
    border-radius: 14px;
    font-size: 0.95rem;
    font-weight: 700;
    font-family: 'Cairo', 'Inter', sans-serif;
    box-shadow: 0 8px 32px rgba(0,0,0,0.2);
    z-index: 9999;
    animation: slideInToast 0.4s ease forwards;
    direction: ${document.documentElement.dir};
  `;
  toast.textContent = msg;

  if (!document.getElementById('toastStyles')) {
    const style = document.createElement('style');
    style.id = 'toastStyles';
    style.textContent = `
      @keyframes slideInToast { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes slideOutToast { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(20px); } }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'slideOutToast 0.4s ease forwards';
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

// === Gallery Lightbox ===
const lightbox = document.getElementById('lightboxModal');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxDesc = document.getElementById('lightboxDesc');
const lightboxCounter = document.getElementById('lightboxCounter');
const btnClose = document.getElementById('lightboxClose');
const btnPrev = document.getElementById('lightboxPrev');
const btnNext = document.getElementById('lightboxNext');

let currentGalleryImages = [];
let currentImageIndex = 0;
let currentCaseDescAr = '';
let currentCaseDescEn = '';
let currentCaseTitleAr = '';
let currentCaseTitleEn = '';

document.querySelectorAll('.gallery-card').forEach(card => {
  card.addEventListener('click', () => {
    // Extract images
    const imgSpans = card.querySelectorAll('.case-images span');
    currentGalleryImages = Array.from(imgSpans).map(span => span.getAttribute('data-src'));
    
    // Extract description & text
    currentCaseDescAr = card.querySelector('.case-desc-ar').innerHTML;
    currentCaseDescEn = card.querySelector('.case-desc-en').innerHTML;
    
    const titleEl = card.querySelector('.gallery-title');
    currentCaseTitleAr = titleEl.getAttribute('data-ar');
    currentCaseTitleEn = titleEl.getAttribute('data-en');

    currentImageIndex = 0;
    updateLightboxUI();

    // Show modal
    lightbox.classList.add('show');
    document.body.style.overflow = 'hidden';
  });
});

function updateLightboxUI() {
  if (currentGalleryImages.length === 0) return;
  
  // Set Image
  lightboxImg.src = currentGalleryImages[currentImageIndex];
  
  // Set Text based on current active language
  const isAr = currentLang === 'ar';
  lightboxTitle.textContent = isAr ? currentCaseTitleAr : currentCaseTitleEn;
  lightboxDesc.innerHTML = isAr ? currentCaseDescAr : currentCaseDescEn;
  
  // Set Counter
  lightboxCounter.textContent = isAr
    ? `${currentImageIndex + 1} من ${currentGalleryImages.length}`
    : `${currentImageIndex + 1} / ${currentGalleryImages.length}`;
  
  // Toggle Prev/Next visibility based on array length
  btnPrev.style.display = currentGalleryImages.length > 1 ? 'flex' : 'none';
  btnNext.style.display = currentGalleryImages.length > 1 ? 'flex' : 'none';
}

function closeLightbox() {
  lightbox.classList.remove('show');
  document.body.style.overflow = 'auto'; // restore scroll
}

function nextImage() {
  currentImageIndex = (currentImageIndex + 1) % currentGalleryImages.length;
  updateLightboxUI();
}

function prevImage() {
  currentImageIndex = (currentImageIndex - 1 + currentGalleryImages.length) % currentGalleryImages.length;
  updateLightboxUI();
}

btnClose?.addEventListener('click', closeLightbox);
btnNext?.addEventListener('click', nextImage);
btnPrev?.addEventListener('click', prevImage);

// Close when clicking outside of the content
lightbox?.addEventListener('click', (e) => {
  if (e.target === lightbox) {
    closeLightbox();
  }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (!lightbox?.classList.contains('show')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') {
    if (document.documentElement.dir === 'rtl') prevImage(); else nextImage();
  }
  if (e.key === 'ArrowLeft') {
    if (document.documentElement.dir === 'rtl') nextImage(); else prevImage();
  }
});

// Hook into existing Language Toggle to update the lightbox text if it's open
const langToggleBtn = document.getElementById('langToggle');
if (langToggleBtn) {
  // Add a secondary event listener that runs after applyLanguage
  langToggleBtn.addEventListener('click', () => {
    if (lightbox?.classList.contains('show')) {
      updateLightboxUI();
    }
  });
}

