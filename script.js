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
  document.querySelector('#filter-status').textContent = `${count} ${count === 1 ? 'veículo conceitual' : 'veículos conceituais'}. Imagens de referência; estoque e disponibilidade serão definidos pela loja.`;
}));
const vehicles = {
  sport: { title: 'Sport Sedan', category: 'ESPORTIVO', description: 'Uma referência para quem procura proporções clássicas e personalidade esportiva. Modelo, ano, quilometragem e disponibilidade serão definidos no estoque real da loja.', image: cards[0].querySelector('img').src },
  touring: { title: 'Grand Touring', category: 'GRAND TOURING', description: 'Uma referência para quem valoriza presença e elegância em movimento. Modelo, ano, quilometragem e disponibilidade serão definidos no estoque real da loja.', image: cards[1].querySelector('img').src },
  performance: { title: 'Performance Edition', category: 'ESPORTIVO', description: 'Uma referência para quem busca um carro de design expressivo. Modelo, ano, quilometragem e disponibilidade serão definidos no estoque real da loja.', image: cards[2].querySelector('img').src },
  general: { title: 'O que move você?', category: 'SEU PRÓXIMO CAPÍTULO', description: 'Conte qual tipo de carro você procura e prepare suas perguntas para a Hypercars.' }
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
  message.value = key === 'general' ? 'Olá, Hypercars! Estou procurando um carro e gostaria de conhecer a coleção. Meu estilo de carro é: ' : `Olá, Hypercars! Gostei da proposta ${vehicle.title} e quero conhecer as opções disponíveis. Podemos conversar?`;
  document.querySelector('#copy-status').textContent = '';
  document.body.classList.add('modal-open');
  dialog.showModal();
  document.querySelector('#dialog-close').focus();
}
document.querySelectorAll('[data-car]').forEach(button => button.addEventListener('click', () => openDetails(button.dataset.car)));
document.querySelector('#contact-open').addEventListener('click', () => openDetails('general'));
document.querySelector('#dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); } });
dialog.addEventListener('close', () => { document.body.classList.remove('modal-open'); previousFocus?.focus(); });
document.querySelector('#copy-message').addEventListener('click', async () => {
  const status = document.querySelector('#copy-status');
  if (!message.value.trim()) { status.textContent = 'Escreva uma mensagem antes de copiar.'; message.focus(); return; }
  try { await navigator.clipboard.writeText(message.value); status.textContent = 'Mensagem copiada. Pronta para usar quando o contato estiver disponível.'; }
  catch { message.focus(); message.select(); status.textContent = 'Selecione e copie a mensagem usando Ctrl+C ou a opção Copiar do seu dispositivo.'; }
});
document.querySelector('#year').textContent = new Date().getFullYear();

