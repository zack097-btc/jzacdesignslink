/* ══════════════════════════════════════════════════════════════
   JZAC DESIGNS — SITE INTERACTIONS
   ══════════════════════════════════════════════════════════════ */

const CONTACT = {
  name: 'JZac Designs',
  phone: '+15097208239',
  phoneDisplay: '(509) 720-8239',
  email: 'JZacDesigns@proton.me',
  city: 'Spokane Valley',
  state: 'WA'
};

// Each project's full photo set, used by the lightbox when a portfolio card is opened.
const PROJECTS = {
  krittersDen: {
    client: "The Kritters Den",
    type: "Custom LED Logo Sign",
    photos: [
      { src: 'photos/kritters-den-lit.jpg', desc: 'Lit' },
      { src: 'photos/kritters-den-unlit.jpg', desc: 'Unlit' }
    ]
  },
  juddLees: {
    client: "Judd Lee's Tire",
    type: '3D Dimensional Letters',
    photos: [
      { src: 'photos/judd-lees-tire-full-layout.jpg', desc: 'Full Layout' },
      { src: 'photos/judd-lees-tire-full-alt.jpg', desc: 'Full Set — Alternate Angle' },
      { src: 'photos/judd-lees-tire-display.jpg', desc: 'Display Arrangement' },
      { src: 'photos/judd-lees-tire-detail.jpg', desc: 'Detail — Depth & Craftsmanship' },
      { src: 'photos/judd-lees-tire-plaque.jpg', desc: 'Desk Plaque Version' }
    ]
  },
  sorryClosed: {
    client: "Sorry We're Closed",
    type: 'LED Backlit Sign',
    photos: [
      { src: 'photos/sorry-were-closed-installed.jpg', desc: 'Installed' },
      { src: 'photos/sorry-were-closed-studio.jpg', desc: 'Studio Shot' }
    ]
  },
  milligan: {
    client: 'Milligan Motorsports',
    type: 'Custom 3D Business Plaque',
    photos: [
      { src: 'photos/milligan-motorsports-plaque.jpg', desc: 'Custom 3D Business Plaque' }
    ]
  },
  bmwM: {
    client: '@M3Zack3 / BMW M',
    type: 'Custom Glow-in-Dark Plaque',
    photos: [
      { src: 'photos/bmw-m-plaque.jpg', desc: 'Full Plaque' },
      { src: 'photos/bmw-m-plaque-detail.jpg', desc: 'Detail' }
    ]
  }
};

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initCard();
  initShareAndContact();
  initPortfolio();
  initFunnel();
});

/* ── Sticky nav ────────────────────────────────────────────── */

function initNav() {
  const nav = document.getElementById('siteNav');
  const hero = document.querySelector('.card-hero');
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');

  const threshold = () => hero.offsetHeight * 0.75;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('is-visible', window.scrollY > threshold());
  }, { passive: true });

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  menu.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ── Digital card flip ─────────────────────────────────────── */

function initCard() {
  const cardFlip = document.getElementById('cardFlip');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion) {
    cardFlip.classList.add('is-flipped');
  } else {
    setTimeout(() => cardFlip.classList.add('is-flipped'), 700);
  }

  cardFlip.addEventListener('click', () => {
    cardFlip.classList.toggle('is-flipped');
  });
}

/* ── Save contact (vCard) + native share ──────────────────── */

function initShareAndContact() {
  document.getElementById('btnSaveContact').addEventListener('click', downloadVCard);
  document.getElementById('btnShare').addEventListener('click', shareCard);

  // Explore-card links that carry a data-filter pre-select the matching
  // portfolio filter once the browser finishes the anchor scroll.
  document.querySelectorAll('.explore-card[data-filter]').forEach((el) => {
    el.addEventListener('click', () => {
      const filter = el.dataset.filter;
      setTimeout(() => {
        const pill = document.querySelector(`.filter-pill[data-filter="${filter}"]`);
        if (pill) pill.click();
      }, 350);
    });
  });
}

function downloadVCard() {
  const vcard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${CONTACT.name}`,
    `ORG:${CONTACT.name}`,
    `TEL;TYPE=CELL,VOICE:${CONTACT.phone}`,
    `EMAIL;TYPE=INTERNET:${CONTACT.email}`,
    `ADR;TYPE=WORK:;;${CONTACT.city};${CONTACT.state};;USA`,
    `URL:${window.location.origin}`,
    'NOTE:Custom Vinyl, Signs, Graphics & 3D Printed Design',
    'END:VCARD'
  ].join('\r\n');

  const blob = new Blob([vcard], { type: 'text/vcard' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'JZac-Designs.vcf';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  showToast('Contact card downloaded');
}

async function shareCard() {
  const shareData = {
    title: 'JZac Designs',
    text: 'Custom Vinyl, Signs & 3D Printed Design — Spokane Valley, WA',
    url: window.location.href
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
    } catch (err) {
      // user cancelled the share sheet — not an error
    }
    return;
  }

  if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(shareData.url);
      showToast('Link copied to clipboard');
      return;
    } catch (err) {
      // fall through to final fallback
    }
  }

  showToast(shareData.url);
}

let toastTimer = null;
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2400);
}

/* ── Portfolio: filters + lightbox ────────────────────────── */

function initPortfolio() {
  const filterPills = document.querySelectorAll('.filter-pill');
  const cards = document.querySelectorAll('.portfolio-card');

  filterPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      filterPills.forEach((p) => p.classList.remove('is-active'));
      pill.classList.add('is-active');
      const filter = pill.dataset.filter;
      cards.forEach((card) => {
        const match = filter === 'all' || card.dataset.filter === filter;
        card.style.display = match ? '' : 'none';
      });
    });
  });

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClient = document.getElementById('lightboxClient');
  const lightboxDesc = document.getElementById('lightboxDesc');
  let activeProject = null;
  let activeIndex = 0;

  function render() {
    const photo = activeProject.photos[activeIndex];
    lightboxImg.src = photo.src;
    lightboxImg.alt = `${activeProject.client} — ${photo.desc}`;
    lightboxClient.textContent = activeProject.client;
    lightboxDesc.textContent = `${activeProject.type} — ${photo.desc}`;
  }

  function open(projectKey) {
    activeProject = PROJECTS[projectKey];
    if (!activeProject) return;
    activeIndex = 0;
    render();
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function step(delta) {
    const count = activeProject.photos.length;
    activeIndex = (activeIndex + delta + count) % count;
    render();
  }

  cards.forEach((card) => {
    card.addEventListener('click', () => open(card.dataset.project));
  });

  document.getElementById('lightboxClose').addEventListener('click', close);
  document.getElementById('lightboxPrev').addEventListener('click', () => step(-1));
  document.getElementById('lightboxNext').addEventListener('click', () => step(1));

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });
}

/* ── Build Your Project funnel ─────────────────────────────── */

function initFunnel() {
  let step = 1;
  const data = { projectType: '', description: '', timeline: '' };

  const steps = document.querySelectorAll('.funnel-step');
  const fpSteps = document.querySelectorAll('.fp-step');
  const fpLines = document.querySelectorAll('.fp-line');
  const backBtn = document.getElementById('funnelBack');
  const nextBtn = document.getElementById('funnelNext');
  const sendBtn = document.getElementById('funnelSend');
  const typeGrid = document.getElementById('projectTypeGrid');

  typeGrid.querySelectorAll('.option-card').forEach((btn) => {
    btn.addEventListener('click', () => {
      typeGrid.querySelectorAll('.option-card').forEach((b) => b.classList.remove('is-selected'));
      btn.classList.add('is-selected');
      data.projectType = btn.dataset.value;
    });
  });

  function show(n) {
    steps.forEach((s) => s.classList.toggle('is-active', Number(s.dataset.step) === n));
    fpSteps.forEach((s) => {
      const num = Number(s.dataset.step);
      s.classList.toggle('is-active', num === n);
      s.classList.toggle('is-done', num < n);
    });
    fpLines.forEach((line, i) => line.classList.toggle('is-done', i < n - 1));
    backBtn.hidden = n === 1;
    nextBtn.hidden = n === 3;
    sendBtn.hidden = n !== 3;
  }

  nextBtn.addEventListener('click', () => {
    if (step === 1 && !data.projectType) {
      typeGrid.classList.remove('shake');
      // restart the animation even if triggered twice in a row
      void typeGrid.offsetWidth;
      typeGrid.classList.add('shake');
      return;
    }
    if (step === 2) {
      data.description = document.getElementById('fProjectDesc').value.trim();
      data.timeline = document.getElementById('fTimeline').value.trim();
    }
    if (step < 3) {
      step += 1;
      show(step);
    }
  });

  backBtn.addEventListener('click', () => {
    if (step > 1) {
      step -= 1;
      show(step);
    }
  });

  sendBtn.addEventListener('click', (e) => {
    const nameField = document.getElementById('fName');
    const emailField = document.getElementById('fEmail');

    if (!nameField.checkValidity()) { e.preventDefault(); nameField.reportValidity(); return; }
    if (!emailField.checkValidity()) { e.preventDefault(); emailField.reportValidity(); return; }

    const name = nameField.value.trim();
    const phone = document.getElementById('fPhone').value.trim();
    const email = emailField.value.trim();

    const subject = encodeURIComponent(`Project Inquiry - ${data.projectType || 'JZac Designs'}`);
    const body = encodeURIComponent(
      'New project inquiry from the JZac Designs site.\n\n' +
      `Project type: ${data.projectType || '(not specified)'}\n` +
      `Description: ${data.description || '(not provided)'}\n` +
      `Timeline: ${data.timeline || '(not provided)'}\n\n` +
      `Name: ${name}\n` +
      `Phone: ${phone || '(not provided)'}\n` +
      `Email: ${email}\n`
    );
    sendBtn.href = `mailto:${CONTACT.email}?subject=${subject}&body=${body}`;
  });

  show(1);
}
