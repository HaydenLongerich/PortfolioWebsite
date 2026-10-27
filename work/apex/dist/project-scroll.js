(() => {
  'use strict';
  const grid = document.querySelector('.project-showcase');
  if (!grid) return;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const cards = [...grid.querySelectorAll('.project-card')].map(card => {
    const frame = document.createElement('div');
    frame.className = 'project-motion-frame';
    card.before(frame);
    frame.append(card);
    return {card, frame, value: null};
  });
  let raf = 0, last = 0, entranceAt = 0, loaded = false;
  const clamp = value => Math.min(1, Math.max(0, value));
  function draw(now) {
    raf = 0;
    if (motion.matches || document.hidden) return;
    const dt = Math.min(64, last ? now - last : 16);
    last = now;
    const blend = 1 - Math.exp(-dt / 85);
    const height = window.innerHeight;
    const stagger = window.innerWidth > 700 ? height * .035 : 0;
    const entering = now < entranceAt + 1100 + (cards.length - 1) * 130;
    const targets = cards.map(({frame, card}, i) => {
      if (card.contains(document.activeElement)) return 1;
      const scrollProgress = clamp((height * .98 - frame.getBoundingClientRect().top - (i % 2) * stagger) / (height * .48));
      const entranceProgress = clamp((now - entranceAt - i * 130) / 1100);
      return scrollProgress * entranceProgress;
    });
    let moving = entering;
    cards.forEach((item, i) => {
      if (item.value === null) item.value = targets[i];
      item.value += (targets[i] - item.value) * blend;
      if (Math.abs(targets[i] - item.value) < .001) item.value = targets[i];
      else moving = true;
      const p = 1 - Math.pow(1 - item.value, 3);
      const remaining = 1 - p;
      const side = i % 2 ? 1 : -1;
      item.card.style.transform = `perspective(1400px) translate3d(${side * remaining * 24}px,${remaining * 75}px,0) rotateX(${remaining * 6}deg) rotateZ(${side * remaining * 1.4}deg) scale(${1 - remaining * .045})`;
      item.card.style.opacity = String(p);
      item.card.style.setProperty('--arrival-light', String(Math.sin(item.value * Math.PI) * .48));
      item.card.style.setProperty('--arrival-sweep', `${-110 + item.value * 220}%`);
    });
    document.documentElement.classList.remove('projects-loading');
    if (moving) raf = requestAnimationFrame(draw);
    else last = 0;
  }
  function wake() {
    if (loaded && !raf && !motion.matches && !document.hidden) raf = requestAnimationFrame(draw);
  }
  function configure() {
    loaded = true;
    cancelAnimationFrame(raf);
    raf = 0;
    last = 0;
    // Let the existing page shutters open before the cards begin to unfold.
    const arriving = document.documentElement.classList.contains('page-arriving') || document.querySelector('.page-transition.is-entering');
    entranceAt = performance.now() + (arriving ? 950 : 80);
    cards.forEach(item => { item.value = 0; });
    if (motion.matches) document.documentElement.classList.remove('projects-loading');
    grid.classList.toggle('scroll-choreography', !motion.matches);
    cards.forEach(({card}) => {
      card.style.removeProperty('transform');
      card.style.removeProperty('opacity');
      card.style.removeProperty('--arrival-light');
      card.style.removeProperty('--arrival-sweep');
    });
    wake();
  }
  addEventListener('scroll', wake, {passive: true});
  addEventListener('resize', wake, {passive: true});
  addEventListener('pageshow', wake);
  grid.addEventListener('focusin', wake);
  document.addEventListener('visibilitychange', wake);
  motion.addEventListener('change', configure);
  if (document.readyState === 'complete') configure();
  else addEventListener('load', configure, {once: true});
})();
