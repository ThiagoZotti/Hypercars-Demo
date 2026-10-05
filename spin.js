(() => {
  const dialog = document.querySelector('#car-dialog');
  const photo = document.querySelector('#dialog-image');
  const viewer = document.createElement('section');
  viewer.className = 'spin-viewer';
  viewer.hidden = true;
  viewer.innerHTML = `<div class="spin-stage"><img alt="" draggable="false" width="960" height="640"><span class="spin-badge">360°</span></div><div class="spin-controls"><button type="button" class="text-action spin-back" aria-label="Ver ângulo anterior">←</button><label>Gire para explorar<input type="range" min="0" value="0" step="1" aria-label="Ângulo do veículo"></label><button type="button" class="text-action spin-next" aria-label="Ver próximo ângulo">→</button></div><p class="spin-status" role="status"></p><button type="button" class="text-action spin-retry" hidden>Tentar novamente</button>`;
  photo.after(viewer);
  const image = viewer.querySelector('img');
  const stage = viewer.querySelector('.spin-stage');
  const canvas = document.createElement('canvas');
  canvas.setAttribute('role', 'img');
  canvas.hidden = true;
  stage.prepend(canvas);
  const context = canvas.getContext('2d');
  const range = viewer.querySelector('input');
  const status = viewer.querySelector('.spin-status');
  const retry = viewer.querySelector('.spin-retry');
  let frames = [], index = 0, generation = 0, currentVehicle, drag, sprite;
  function show(next) {
    if (!frames.length) return;
    index = ((next % frames.length) + frames.length) % frames.length;
    const angle = Math.round(index * 360 / frames.length);
    const description = `${currentVehicle.title}, vista ${index + 1} de ${frames.length}, giro ${angle} graus`;
    if (sprite) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(frames[0], index * sprite.width, 0, sprite.width, sprite.height, 0, 0, canvas.width, canvas.height);
      canvas.setAttribute('aria-label', description);
    } else {
      image.src = frames[index].src;
      image.alt = description;
    }
    range.value = index;
    range.setAttribute('aria-valuetext', `Vista ${index + 1} de ${frames.length}, ${angle} graus`);
  }
  async function load(key, vehicle) {
    const ticket = ++generation;
    drag = undefined; frames = []; currentVehicle = vehicle;
    const set = window.JC_SPINS?.[key];
    sprite = set && !Array.isArray(set) && Number.isInteger(set.frames) && set.frames >= 12 && set.width > 0 && set.height > 0 ? set : null;
    const urls = sprite ? Array(sprite.frames).fill(sprite.sprite) : set;
    viewer.hidden = !Array.isArray(urls) || urls.length < 12;
    photo.hidden = !vehicle.image;
    if (viewer.hidden) return;
    image.hidden = true; canvas.hidden = true; retry.hidden = true;
    stage.hidden = false;
    viewer.querySelector('.spin-controls').hidden = true;
    status.textContent = 'Carregando as vistas do veículo…';
    try {
      const unique = [...new Set(urls)];
      const loaded = await Promise.all(unique.map(url => new Promise((resolve, reject) => {
        const frame = new Image();
        const timer = setTimeout(() => reject(new Error('timeout')), 15000);
        frame.onload = () => { clearTimeout(timer); resolve(frame); };
        frame.onerror = () => { clearTimeout(timer); reject(new Error('image')); };
        frame.src = url;
      })));
      if (ticket !== generation || !dialog.open) return;
      if (sprite && (loaded[0].naturalWidth !== sprite.width * sprite.frames || loaded[0].naturalHeight !== sprite.height || !context)) throw new Error('Invalid sequence');
      frames = urls.map(url => loaded[unique.indexOf(url)]);
      if (sprite) {
        canvas.width = sprite.width; canvas.height = sprite.height;
        stage.style.aspectRatio = `${sprite.width} / ${sprite.height}`;
      } else stage.style.removeProperty('aspect-ratio');
      range.max = frames.length - 1; show(0);
      canvas.hidden = !sprite; image.hidden = !!sprite; photo.hidden = true;
      viewer.querySelector('.spin-controls').hidden = false;
      status.textContent = 'Arraste, use as setas ou escolha um ângulo. Visão ilustrativa do modelo.';
    } catch {
      if (ticket !== generation || !dialog.open) return;
      status.textContent = 'Não foi possível carregar a visão 360°. A foto do carro continua disponível.';
      stage.hidden = true;
      retry.hidden = false;
    }
  }
  range.addEventListener('input', () => show(Number(range.value)));
  viewer.querySelector('.spin-back').addEventListener('click', () => show(index - 1));
  viewer.querySelector('.spin-next').addEventListener('click', () => show(index + 1));
  stage.addEventListener('pointerdown', event => {
    if (!frames.length || (event.pointerType === 'mouse' && event.button !== 0)) return;
    drag = { x: event.clientX, index, id: event.pointerId };
    stage.setPointerCapture(event.pointerId);
  });
  stage.addEventListener('pointermove', event => {
    if (drag?.id === event.pointerId) show(drag.index + Math.round((drag.x - event.clientX) / Math.max(6, stage.clientWidth / frames.length)));
  });
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(type => stage.addEventListener(type, () => { drag = undefined; }));
  dialog.addEventListener('close', () => { ++generation; drag = undefined; });
  document.addEventListener('jc:vehicle', event => load(event.detail.key, event.detail.vehicle));
  retry.addEventListener('click', () => load(dialog.dataset.vehicle, currentVehicle));
})();
