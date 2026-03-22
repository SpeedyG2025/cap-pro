// CAPSY — Main JavaScript

document.addEventListener('DOMContentLoaded', () => {

  // ── Navbar scroll effect ──
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    });
  }

  // ── Mobile nav toggle ──
  const toggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
    // Close on link click
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  // ── Active nav link ──
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') === currentPage) a.classList.add('active');
  });

  // ── Hero page body class ──
  if (currentPage === 'index.html' || currentPage === '') {
    document.body.classList.add('hero-page');
  }

  // ── Language switcher (visual only) ──
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      showToast(`Langue: ${btn.textContent}`);
    });
  });

  // ── Filter buttons ──
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.filter-bar').querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // ── Type selector (appointments) ──
  document.querySelectorAll('.type-card').forEach(card => {
    card.addEventListener('click', () => {
      card.closest('.type-selector').querySelectorAll('.type-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
    });
  });

  // ── Payment method selector ──
  document.querySelectorAll('.pay-method').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.payment-methods').querySelectorAll('.pay-method').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      const methodName = btn.querySelector('span') ? btn.querySelector('span').textContent : btn.textContent.trim();
      const cardFields = document.getElementById('cardFields');
      if (cardFields) {
        cardFields.style.display = (methodName === 'Carte bancaire') ? 'block' : 'none';
      }
    });
  });

  // ── Donation amount buttons ──
  document.querySelectorAll('.amount-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.amount-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const custom = document.getElementById('customAmount');
      if (custom) {
        if (btn.dataset.amount === 'custom') {
          custom.style.display = 'block';
          custom.focus();
        } else {
          custom.style.display = 'none';
          custom.value = '';
          // Update impact display
          updateImpact(parseInt(btn.dataset.amount));
        }
      }
    });
  });

  function updateImpact(amount) {
    const impactMsg = document.getElementById('impactMsg');
    if (!impactMsg) return;
    if (amount <= 25) impactMsg.textContent = 'Couvre les frais d\'une consultation psychologique.';
    else if (amount <= 50) impactMsg.textContent = 'Finance un atelier collectif pour 5 participants.';
    else if (amount <= 100) impactMsg.textContent = 'Soutient une semaine de services communautaires.';
    else impactMsg.textContent = 'Transforme durablement notre capacité d\'intervention.';
  }

  // ── Forms ──
  // Contact form
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      showModal('✅', 'Message envoyé!', 'Nous vous répondrons dans les 48 heures. Merci de nous avoir contactés.', () => contactForm.reset());
    });
  }

  // Appointment form
  const apptForm = document.getElementById('apptForm');
  if (apptForm) {
    apptForm.addEventListener('submit', e => {
      e.preventDefault();
      showModal('📅', 'Rendez-vous confirmé!', 'Votre rendez-vous a été enregistré. Vous recevrez une confirmation par email sous peu.', () => {
        apptForm.reset();
        window.scrollTo(0, 0);
      });
    });
  }

  // Donation form
  const donateForm = document.getElementById('donateForm');
  if (donateForm) {
    donateForm.addEventListener('submit', e => {
      e.preventDefault();
      const amount = document.querySelector('.amount-btn.active')?.dataset.amount || document.getElementById('customAmount')?.value || '?';
      showModal('❤️', 'Don reçu avec gratitude!', `Merci pour votre don de $${amount}. Votre générosité aide des milliers d'Haïtiens à accéder aux soins mentaux.`, () => donateForm.reset());
    });
  }

  // ── Toast notification ──
  function showToast(msg) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }
  window.showToast = showToast;

  // ── Modal ──
  function showModal(icon, title, body, onClose) {
    let overlay = document.getElementById('modalOverlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'modal-overlay';
      overlay.id = 'modalOverlay';
      overlay.innerHTML = `
        <div class="modal-box">
          <div class="modal-icon" id="modalIcon"></div>
          <h3 id="modalTitle"></h3>
          <p id="modalBody"></p>
          <button class="btn-primary" id="modalClose" style="width:100%;justify-content:center;">Fermer</button>
        </div>`;
      document.body.appendChild(overlay);
    }
    document.getElementById('modalIcon').textContent = icon;
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalBody').textContent = body;
    overlay.classList.add('open');
    document.getElementById('modalClose').onclick = () => {
      overlay.classList.remove('open');
      if (onClose) onClose();
    };
    overlay.addEventListener('click', e => {
      if (e.target === overlay) overlay.classList.remove('open');
    });
  }
  window.showModal = showModal;

  // ── Scroll reveal ──
  const revealEls = document.querySelectorAll('.service-card, .activity-card, .testimonial-card, .team-card, .mv-card, .impact-item');
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(el => {
        if (el.isIntersecting) {
          el.target.style.opacity = '1';
          el.target.style.transform = 'translateY(0)';
          obs.unobserve(el.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = `opacity .5s ease ${i * 0.07}s, transform .5s ease ${i * 0.07}s`;
      obs.observe(el);
    });
  }
});
