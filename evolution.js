(() => {
  const rm = matchMedia('(prefers-reduced-motion: reduce)');
  const root = document.documentElement, hero = document.querySelector('.cinematic-hero');
  let queued = false;
  const tick = () => {
    queued = false;
    const paused = rm.matches || document.body.classList.contains('motion-paused');
    root.style.setProperty('--exit', paused ? 0 : Math.min(1, scrollY / (hero.offsetHeight * .8)).toFixed(3));
  };
  addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(tick); } }, { passive: true });
  document.querySelector('#motion-toggle')?.addEventListener('click', tick);
  tick();
  const experience = document.querySelector('.experience');
  const targets = document.querySelectorAll('.experience-item,.essence-bottom,.contact-bottom');
  if ('IntersectionObserver' in window && !rm.matches) {
    document.body.classList.add('ev');
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      if (e.target === experience) e.target.querySelector('.experience-image')?.classList.add('in');
      else e.target.classList.add('in');
      io.unobserve(e.target);
    }), { threshold: .2 });
    if (experience) io.observe(experience);
    targets.forEach(t => io.observe(t));
  }
})();
