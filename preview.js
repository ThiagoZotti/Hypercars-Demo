(() => {
  const strip = document.querySelector('.brand-strip');
  const viewport = document.querySelector('.showroom-viewport');
  const cards = [...document.querySelectorAll('.showroom .car')];
  const focusLabel = document.querySelector('#showroom-focus-label');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let scheduled = false;

  function updateStage() {
    scheduled = false;
    const paused = reducedMotion.matches || document.body.classList.contains('motion-paused');
    const visible = cards.filter(card => !card.hidden);
    const center = viewport.getBoundingClientRect().left + viewport.clientWidth / 2;
    const spread = Math.max(1, viewport.clientWidth * .58);
    let nearest = visible[0];
    let nearestDistance = Infinity;

    for (const card of cards) {
      if (card.hidden) {
        card.classList.remove('is-focused');
        continue;
      }
      const box = card.getBoundingClientRect();
      const distance = Math.abs(box.left + box.width / 2 - center);
      const focus = Math.max(0, 1 - distance / spread);
      card.style.setProperty('--focus-opacity', paused ? '1' : (0.64 + focus * .36).toFixed(3));
      card.style.setProperty('--focus-scale', paused ? '1' : (0.96 + focus * .04).toFixed(3));
      card.style.setProperty('--focus-lift', paused ? '0px' : `${((1 - focus) * 14).toFixed(1)}px`);
      if (distance < nearestDistance) { nearestDistance = distance; nearest = card; }
    }
    cards.forEach(card => card.classList.toggle('is-focused', card === nearest));
    if (nearest) {
      const shown = visible.indexOf(nearest) + 1;
      focusLabel.textContent = `EM FOCO · ${String(shown).padStart(2, '0')} / ${String(visible.length).padStart(2, '0')}`;
    }

    const stripTop = strip.getBoundingClientRect().top;
    const handoff = paused ? 1 : Math.max(0, Math.min(1, (window.innerHeight - stripTop) / Math.min(380, window.innerHeight * .5)));
    document.documentElement.style.setProperty('--handoff-progress', handoff.toFixed(3));
  }
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(updateStage);
  }

  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    document.body.classList.add('preview-motion');
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) { strip.classList.add('is-visible'); observer.disconnect(); }
      }
    }, { threshold: .15 });
    observer.observe(strip);
  } else strip.classList.add('is-visible');

  viewport.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  document.querySelectorAll('.filter').forEach(filter => filter.addEventListener('click', () => requestAnimationFrame(schedule)));
  document.querySelector('#motion-toggle').addEventListener('click', schedule);
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) strip.classList.add('is-visible');
    schedule();
  });

  document.addEventListener('jc:vehicle', ({ detail }) => {
    const index = cards.findIndex(card => card.querySelector('[data-car]')?.dataset.car === detail.key);
    document.querySelector('#dialog-index').textContent = index < 0 ? 'JC / VEÍCULOS' : `${String(index + 1).padStart(2, '0')} / ${String(cards.length).padStart(2, '0')}`;
    document.querySelector('#dialog-view-type').textContent = window.JC_SPINS?.[detail.key] ? 'Visão 360° ilustrativa' : 'Foto ilustrativa';
  });

  schedule();
})();
