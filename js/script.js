/* =========================================================
   EVENTRA — Interactive behaviours
   ========================================================= */

// Cache frequently used elements once.
const header = document.querySelector('.site-header');
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
const revealItems = document.querySelectorAll('.reveal');
const counters = document.querySelectorAll('.counter');
const statsSection = document.querySelector('.stats-section');
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');
const galleryButtons = document.querySelectorAll('[data-gallery-open]');
const portfolioGallery = document.getElementById('portfolioGallery');
const galleryTitle = document.getElementById('galleryTitle');
const galleryEyebrow = document.getElementById('galleryEyebrow');
const galleryImages = document.getElementById('galleryImages');
const closeGallery = document.getElementById('closeGallery');

// ---------- Sticky header ----------
function updateHeader() {
  if (!header) return;
  header.classList.toggle('scrolled', window.scrollY > 30);
}

window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

// ---------- Mobile navigation ----------
function closeMobileMenu() {
  if (!menuBtn || !navLinks) return;

  navLinks.classList.remove('mobile-open');
  navLinks.classList.add('hidden');
  menuBtn.textContent = 'MENU';
  menuBtn.setAttribute('aria-expanded', 'false');
  menuBtn.setAttribute('aria-label', 'Open menu');
}

if (menuBtn && navLinks) {
  menuBtn.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('mobile-open');
    navLinks.classList.toggle('hidden', !isOpen);
    menuBtn.textContent = isOpen ? 'CLOSE' : 'MENU';
    menuBtn.setAttribute('aria-expanded', String(isOpen));
    menuBtn.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });

  // Close the menu after choosing a section on small screens.
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 1024) closeMobileMenu();
    });
  });

  // Reset the mobile menu when returning to desktop width.
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) {
      navLinks.classList.remove('mobile-open', 'hidden');
      menuBtn.textContent = 'MENU';
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.setAttribute('aria-label', 'Open menu');
    } else if (!navLinks.classList.contains('mobile-open')) {
      navLinks.classList.add('hidden');
    }
  });
}

// ---------- Reveal elements on scroll ----------
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const itemIndex = Array.from(revealItems).indexOf(entry.target);
        entry.target.style.transitionDelay = `${(itemIndex % 4) * 90}ms`;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach(item => revealObserver.observe(item));
} else {
  // Fallback for browsers without IntersectionObserver.
  revealItems.forEach(item => item.classList.add('visible'));
}

// ---------- Animate statistics once ----------
let countersStarted = false;

function animateCounters() {
  if (countersStarted) return;
  countersStarted = true;

  counters.forEach(counter => {
    const target = Number(counter.dataset.target);
    const duration = 1800;
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 4);
      counter.textContent = Math.floor(target * easedProgress).toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target.toLocaleString() + '+';
      }
    }

    requestAnimationFrame(updateCounter);
  });
}

if ('IntersectionObserver' in window && statsSection) {
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        counterObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });

  counterObserver.observe(statsSection);
} else {
  animateCounters();
}

// ---------- Portfolio category galleries ----------
const portfolioCollections = {
  wedding: {
    title: 'Wedding celebrations',
    eyebrow: 'A day made uniquely yours',
    images: [
      ['https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=85', 'An outdoor wedding ceremony'],
      ['https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=85', 'Romantic wedding reception'],
      ['https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=900&q=85', 'Elegant wedding table styling'],
      ['https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=900&q=85', 'Wedding floral details'],
      ['https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?auto=format&fit=crop&w=900&q=85', 'Wedding reception details'],
      ['https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=900&q=85', 'A celebration under the lights']
    ]
  },
  corporate: {
    title: 'Corporate events',
    eyebrow: 'Ideas, people and experiences',
    images: [
      ['https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=900&q=85', 'Corporate conference setup'],
      ['https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=900&q=85', 'Business event venue'],
      ['https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=900&q=85', 'Conference presentation'],
      ['https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=85', 'Networking event'],
      ['https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=85', 'Team gathering'],
      ['https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=85', 'Large event production']
    ]
  },
  private: {
    title: 'Private celebrations',
    eyebrow: 'Little details, big memories',
    images: [
      ['https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=900&q=85', 'Colorful birthday celebration'],
      ['https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=900&q=85', 'Beautiful celebration table'],
      ['https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=900&q=85', 'Party decorations'],
      ['https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=85', 'A lively private event'],
      ['https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=900&q=85', 'Dinner party styling'],
      ['https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=85', 'A special day together']
    ]
  }
};

function openPortfolioGallery(category) {
  if (!portfolioGallery || !galleryImages) return;
  const collection = portfolioCollections[category];
  if (!collection) return;

  galleryTitle.textContent = collection.title;
  galleryEyebrow.textContent = collection.eyebrow;
  galleryImages.innerHTML = collection.images.map(([src, alt]) => `
    <figure class="gallery-photo">
      <img src="${src}" alt="${alt}" loading="lazy">
    </figure>
  `).join('');

  portfolioGallery.classList.remove('hidden');
  galleryButtons.forEach(button => {
    button.setAttribute('aria-expanded', String(button.dataset.galleryOpen === category));
  });
  portfolioGallery.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

galleryButtons.forEach(button => {
  button.setAttribute('aria-expanded', 'false');
  button.addEventListener('click', () => openPortfolioGallery(button.dataset.galleryOpen));
});

if (closeGallery && portfolioGallery) {
  closeGallery.addEventListener('click', () => {
    portfolioGallery.classList.add('hidden');
    galleryButtons.forEach(button => button.setAttribute('aria-expanded', 'false'));
  });
}

// ---------- Contact form feedback ----------
// This is a front-end demo only. Connect a backend or form service to receive submissions.
if (contactForm && formMessage) {
  contactForm.addEventListener('submit', event => {
    event.preventDefault();

    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    const visitorName = contactForm.elements.name.value.trim();
    formMessage.textContent = `Thank you${visitorName ? `, ${visitorName}` : ''}! Your inquiry is ready. Please note: this demo form is not connected to a server.`;
    contactForm.reset();
  });
}

// ---------- Dynamic footer year ----------
const currentYear = document.getElementById('currentYear');
if (currentYear) currentYear.textContent = new Date().getFullYear();

// ---------- Highlight the current navigation section ----------
const observedSections = document.querySelectorAll('main section[id], footer[id="contact"]');

if ('IntersectionObserver' in window && observedSections.length && navLinks) {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const sectionId = entry.target.id;
      navLinks.querySelectorAll('a[href^="#"]').forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
      });
    });
  }, { rootMargin: '-35% 0px -55% 0px' });

  observedSections.forEach(section => sectionObserver.observe(section));
}
