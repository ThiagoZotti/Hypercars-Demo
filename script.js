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
  document.querySelector('#filter-status').textContent = `${count} ${count === 1 ? 'veículo publicado' : 'veículos publicados'} pela JC Veículos. Consulte disponibilidade, preços e condições atuais.`;
}));
const vehicles = {
  sport: { title: 'Fiat Palio', category: 'SPORTING 1.6 / 2016', description: 'Fiat Palio Sporting 1.6, ano 2016, publicado no Instagram da JC Veículos. Consulte a loja para confirmar disponibilidade, preço e condições atuais.', image: cards[0].querySelector('img').src },
  touring: { title: 'Volkswagen Saveiro', category: 'TRENDLINE / 2023', description: 'Volkswagen Saveiro Trendline, ano 2023, publicada no Instagram da JC Veículos. Consulte a loja para confirmar disponibilidade, preço e condições atuais.', image: cards[1].querySelector('img').src },
  performance: { title: 'Fiat Uno', category: 'SPORTING 1.4 / 2012', description: 'Fiat Uno Sporting 1.4, ano 2012, publicado no Instagram da JC Veículos. Consulte a loja para confirmar disponibilidade, preço e condições atuais.', image: cards[2].querySelector('img').src },
  general: { title: 'O que move você?', category: 'SEU PRÓXIMO CAPÍTULO', description: 'Conte qual carro procura para a JC Veículos.' }
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
  if (vehicle.image) { image.src = vehicle.image; image.alt = `Foto de ${vehicle.title} publicada pela JC Veículos`; }
  message.value = key === 'general' ? 'Olá, JC Veículos! Estou procurando um carro e gostaria de conhecer a coleção. Meu estilo de carro é: ' : `Olá, JC Veículos! Vi o ${vehicle.title} no site e quero conhecer as opções disponíveis. Podemos conversar?`;
  document.querySelector('#copy-status').textContent = '';
  document.body.classList.add('modal-open');
  dialog.showModal();
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


