const menu = document.querySelector('.menu-button');
const mobileNav = document.querySelector('#mobile-nav');
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  mobileNav.hidden = !open;
});
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  mobileNav.hidden = true;
  menu.setAttribute('aria-expanded', 'false');
  menu.setAttribute('aria-label', 'Abrir menu');
}));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !mobileNav.hidden) {
    mobileNav.hidden = true;
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'Abrir menu');
    menu.focus();
  }
});
const cards = [...document.querySelectorAll('.car')];
document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.filter').forEach(filter => {
    const active = filter === button;
    filter.classList.toggle('active', active);
    filter.setAttribute('aria-pressed', String(active));
  });
  cards.forEach(card => card.hidden = button.dataset.filter !== 'todos' && card.dataset.category !== button.dataset.filter);
  const count = cards.filter(card => !card.hidden).length;
  syncShowroomFilter(count);
}));
const vehicles = {
  "civic": {
    "title": "Honda Civic",
    "category": "SEDÃ / REFERÊNCIA DO MODELO",
    "description": "Imagem ilustrativa de Civic. O giro 360° apresenta uma referência do modelo. Consulte a JC Veículos para confirmar estoque, ano, versão e condições do veículo disponível.",
    "image": "assets/car-civic.png"
  },
  "c180": {
    "title": "Mercedes-Benz C180 Coupé",
    "category": "CUPÊ / REFERÊNCIA DO MODELO",
    "description": "Imagem ilustrativa da Mercedes-Benz C180 Avantgarde Coupé 2017 do catálogo Webmotors. Consulte a JC Veículos para confirmar estoque, ano, versão e condições do veículo disponível.",
    "image": "assets/car-c180-coupe.png"
  },
  "corolla": {
    "title": "Toyota Corolla",
    "category": "SEDÃ / REFERÊNCIA DO MODELO",
    "description": "Imagem ilustrativa de Corolla. O giro 360° apresenta uma referência do modelo. Consulte a JC Veículos para confirmar estoque, ano, versão e condições do veículo disponível.",
    "image": "assets/car-corolla.png"
  },
  "saveiro": {
    "title": "Volkswagen Saveiro",
    "category": "PICAPE / REFERÊNCIA DO MODELO",
    "description": "Imagem ilustrativa de Saveiro. Consulte a JC Veículos para confirmar estoque, ano, versão e condições do veículo disponível.",
    "image": "assets/car-saveiro.png"
  },
  "hilux": {
    "title": "Toyota Hilux",
    "category": "PICAPE / REFERÊNCIA DO MODELO",
    "description": "Imagem ilustrativa de Hilux. O giro 360° apresenta uma referência do modelo. Consulte a JC Veículos para confirmar estoque, ano, versão e condições do veículo disponível.",
    "image": "assets/car-hilux.png"
  },
  "general": {
    "title": "O que move você?",
    "category": "SEU PRÓXIMO CAPÍTULO",
    "description": "Conte qual carro procura para a JC Veículos."
  }
};
const dialog = document.querySelector('#car-dialog');
const message = document.querySelector('#interest');
let previousFocus;
function openDetails(key) {
  const vehicle = vehicles[key];
  previousFocus = document.activeElement;
  document.querySelector('#dialog-title').textContent = vehicle.title;
  document.querySelector('#dialog-category').textContent = vehicle.category;
  document.querySelector('#dialog-description').textContent = vehicle.description;
  const image = document.querySelector('#dialog-image');
  image.hidden = !vehicle.image;
  if (vehicle.image) { image.src = vehicle.image; image.alt = `Imagem ilustrativa de ${vehicle.title}`; }
  message.value = key === 'general' ? 'Olá, JC Veículos! Estou procurando um carro e gostaria de conhecer a coleção. Meu estilo de carro é: ' : `Olá, JC Veículos! Vi o ${vehicle.title} no site e quero conhecer as opções disponíveis. Podemos conversar?`;
  document.querySelector('#copy-status').textContent = '';
  document.body.classList.add('modal-open');
  dialog.showModal();
  dialog.scrollTop = 0;
  dialog.dataset.vehicle = key;
  document.dispatchEvent(new CustomEvent("jc:vehicle", { detail: { key, vehicle } }));
  document.querySelector('#dialog-close').focus();
}
document.querySelectorAll('[data-car]').forEach(button => button.addEventListener('click', () => openDetails(button.dataset.car)));

document.querySelector('#dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); } });
dialog.addEventListener('close', () => { document.body.classList.remove('modal-open'); previousFocus?.focus(); });
document.querySelector('#copy-message').addEventListener('click', async () => {
  const status = document.querySelector('#copy-status');
  if (!message.value.trim()) { status.textContent = 'Escreva uma mensagem antes de copiar.'; message.focus(); return; }
  try { await navigator.clipboard.writeText(message.value); status.textContent = 'Mensagem copiada. Agora você pode enviá-la pelo Instagram.'; }
  catch { message.focus(); message.select(); status.textContent = 'Selecione e copie a mensagem usando Ctrl+C ou a opção Copiar do seu dispositivo.'; }
});
document.querySelector('#year').textContent = new Date().getFullYear();

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const precisePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const motionToggle = document.querySelector('#motion-toggle');
let userPaused = false;
function applyMotionPreference() {
  const paused = userPaused || reducedMotion.matches;
  document.body.classList.toggle('motion-paused', paused);
  motionToggle.setAttribute('aria-pressed', String(paused));
  motionToggle.querySelector('.motion-label').textContent = paused ? 'Ativar animações' : 'Pausar animações';
  motionToggle.disabled = reducedMotion.matches;
  if (reducedMotion.matches) motionToggle.querySelector('.motion-label').textContent = 'Movimento reduzido';
  motionToggle.setAttribute('aria-label', motionToggle.querySelector('.motion-label').textContent);
  document.querySelectorAll('.button').forEach(button => { button.style.removeProperty('--mx'); button.style.removeProperty('--my'); });
}
motionToggle.addEventListener('click', () => { userPaused = !userPaused; applyMotionPreference(); });
reducedMotion.addEventListener('change', applyMotionPreference);
applyMotionPreference();
document.querySelectorAll('.button').forEach(button => {
  button.addEventListener('pointermove', event => {
    if (!precisePointer.matches || reducedMotion.matches || userPaused) return;
    const rect = button.getBoundingClientRect();
    button.style.setProperty('--mx', `${(event.clientX - rect.left - rect.width / 2) * .035}px`);
    button.style.setProperty('--my', `${(event.clientY - rect.top - rect.height / 2) * .1}px`);
  });
  button.addEventListener('pointerleave', () => { button.style.removeProperty('--mx'); button.style.removeProperty('--my'); });
  button.addEventListener('click', event => {
    if (reducedMotion.matches || userPaused) return;
    const rect = button.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.setAttribute('aria-hidden', 'true');
    ripple.style.left = `${event.detail ? event.clientX - rect.left : rect.width / 2}px`;
    ripple.style.top = `${event.detail ? event.clientY - rect.top : rect.height / 2}px`;
    button.append(ripple);
    ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
    window.setTimeout(() => ripple.remove(), 900);
  });
});

// The hero exits as one scene while the next section enters.
let scrollScheduled = false;
const hero = document.querySelector('.cinematic-hero');
const experiencePhoto = document.querySelector('.experience-image');
const showroom = document.querySelector('.showroom');
const showroomViewport = document.querySelector('.showroom-viewport');
const showroomPrev = document.querySelector('#showroom-prev');
const showroomNext = document.querySelector('#showroom-next');
function positionShowroomCards() {
  const viewportCenter = showroomViewport.getBoundingClientRect().left + showroomViewport.clientWidth / 2;
  const still = reducedMotion.matches || userPaused;
  cards.forEach(card => {
    if (card.hidden || still) {
      card.style.setProperty('--card-tilt', '0deg');
      card.style.setProperty('--card-lift', '0px');
      return;
    }
    const bounds = card.getBoundingClientRect();
    const offset = (bounds.left + bounds.width / 2 - viewportCenter) / showroomViewport.clientWidth;
    card.style.setProperty('--card-tilt', `${Math.max(-8, Math.min(8, -offset * 8)).toFixed(1)}deg`);
    card.style.setProperty('--card-lift', `${Math.min(15, Math.abs(offset) * 15).toFixed(1)}px`);
  });
  const lastPosition = showroomViewport.scrollWidth - showroomViewport.clientWidth;
  showroomPrev.disabled = showroomViewport.scrollLeft < 4;
  showroomNext.disabled = showroomViewport.scrollLeft >= lastPosition - 4 || lastPosition < 4;
}
function syncShowroomFilter(count) {
  showroom.classList.toggle('showroom--compact', count < 4);
  showroomViewport.scrollLeft = 0;
  requestAnimationFrame(() => { positionShowroomCards(); scheduleScrollEffects(); });
}
function moveShowroom(direction) {
  const card = cards.find(item => !item.hidden);
  if (!card) return;
  const gap = parseFloat(getComputedStyle(document.querySelector('.cars')).gap) || 0;
  showroomViewport.scrollBy({ left: direction * (card.offsetWidth + gap), behavior: reducedMotion.matches || userPaused ? 'instant' : 'smooth' });
}
showroomPrev.addEventListener('click', () => moveShowroom(-1));
showroomNext.addEventListener('click', () => moveShowroom(1));
showroomViewport.addEventListener('scroll', () => requestAnimationFrame(positionShowroomCards), { passive: true });
showroomViewport.addEventListener('keydown', event => {
  if (event.target !== showroomViewport || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
  event.preventDefault();
  moveShowroom(event.key === 'ArrowRight' ? 1 : -1);
});
function updateScrollEffects() {
  scrollScheduled = false;
  const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  document.documentElement.style.setProperty('--scroll-progress', String(Math.min(1, window.scrollY / maxScroll)));
  const canMove = !reducedMotion.matches && !userPaused;
  const heroScroll = canMove ? Math.min(window.scrollY, 700) : 0;
  const heroExit = canMove ? Math.max(0, Math.min(1, (window.scrollY - 30) / Math.max(320, hero.offsetHeight * .78))) : 0;
  document.documentElement.style.setProperty('--hero-drift', `${Math.round(heroScroll * -.11)}px`);
  document.documentElement.style.setProperty('--hero-scene-scale', (1.1 + heroExit * .2).toFixed(3));
  document.documentElement.style.setProperty('--hero-copy-x', `${Math.round(heroExit * -110)}px`);
  document.documentElement.style.setProperty('--hero-copy-y', `${Math.round(heroExit * -45)}px`);
  document.documentElement.style.setProperty('--hero-copy-scale', (1 - heroExit * .08).toFixed(3));
  document.documentElement.style.setProperty('--hero-copy-opacity', Math.max(0, 1 - heroExit * 1.35).toFixed(3));
  if (experiencePhoto) {
    const bounds = experiencePhoto.getBoundingClientRect();
    const centered = (window.innerHeight / 2 - (bounds.top + bounds.height / 2)) / window.innerHeight;
    const drift = canMove ? Math.max(-20, Math.min(20, centered * 28)) : 0;
    document.documentElement.style.setProperty('--experience-drift', `${drift.toFixed(1)}px`);
  }
  positionShowroomCards();
}
function scheduleScrollEffects() {
  if (scrollScheduled) return;
  scrollScheduled = true;
  requestAnimationFrame(updateScrollEffects);
}
window.addEventListener('scroll', scheduleScrollEffects, { passive: true });
window.addEventListener('resize', scheduleScrollEffects);
motionToggle.addEventListener('click', scheduleScrollEffects);
reducedMotion.addEventListener('change', scheduleScrollEffects);
scheduleScrollEffects();

if ('IntersectionObserver' in window) {
  const stages = document.querySelectorAll('.section-heading, .essence, .experience-copy, .contact-main');
  const stageObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      stageObserver.unobserve(entry.target);
    });
  }, { threshold: .15, rootMargin: '0px 0px -8% 0px' });
  stages.forEach(stage => stageObserver.observe(stage));
  document.body.classList.add('motion-ready');
}

