(() => {
  'use strict';
  const projects = {
    bridge: {title: 'BridgeLink Group', images: [['bridgelink-home.jpg', 'The BridgeLink Group homepage'], ['bridgelink-company.jpg', 'About the automotive sales team'], ['bridgelink-coverage.jpg', 'North American coverage and interactive map']]},
    cortex: {title: 'Cortex', images: [
      ['cortex-1.jpg', 'The shared context dashboard'],
      ['cortex-2.jpg', 'Workspace sign-in'],
      ['cortex-3.jpg', 'AI chat with image generation'],
      ['cortex-4.jpg', 'Department chat and shared context'],
      ['cortex-5.jpg', 'Exploring a context entry']
    ]},
    invest: {title: 'altF4 invest', images: [
      ['invest-1.jpg', 'Home page'],
      ['invest-2.jpg', 'Account sign-up'],
      ['invest-3-redacted.png', 'Dashboard'],
      ['invest-4-redacted.png', 'Learning arena'],
      ['invest-5.jpg', 'Stock simulator'],
      ['invest-6-redacted.png', 'Strategy builder'],
      ['invest-7-redacted.png', 'Reports'],
      ['invest-8-redacted.png', 'Investor profile']
    ]},
    advisory: {title: 'Student Advisory System', images: [
      ['advisory-1.jpg', 'Student and admin sign-in'],
      ['advisory-2.jpg', 'Course browsing and prerequisites'],
      ['advisory-3.jpg', 'Course enrollment'],
      ['advisory-4.jpg', 'Dashboard and weekly schedule'],
      ['advisory-5.jpg', 'Academic reports and student information']
    ]}
  };
  const dialog = document.querySelector('#projectGallery');
  if (!dialog) return;
  const image = document.querySelector('#galleryImage');
  const caption = document.querySelector('#galleryCaption');
  let current, index = 0, opener;
  function render() {
    const [file, description] = current.images[index];
    image.src = 'assets/projects/' + file;
    image.alt = current.title + ': ' + description;
    caption.textContent = `${index + 1} / ${current.images.length} — ${description}`;
  }
  function advance(direction) {
    index = (index + direction + current.images.length) % current.images.length;
    render();
  }
  document.querySelectorAll('[data-project-gallery]').forEach(button => button.addEventListener('click', () => {
    current = projects[button.dataset.projectGallery];
    index = Number(button.dataset.start || 0);
    opener = button;
    document.querySelector('#galleryTitle').textContent = current.title;
    document.querySelector('#projectDetails').replaceChildren(document.querySelector('#project-details-' + button.dataset.projectGallery).content.cloneNode(true));
    dialog.classList.toggle('is-bridge', button.dataset.projectGallery === 'bridge');
    document.querySelector('#galleryPrevious').hidden = current.images.length === 1;
    document.querySelector('#galleryNext').hidden = current.images.length === 1;
    render();
    dialog.showModal();
    dialog.scrollTop = 0;
  }));
  document.querySelector('#galleryPrevious').addEventListener('click', () => advance(-1));
  document.querySelector('#galleryNext').addEventListener('click', () => advance(1));
  document.querySelector('#closeProjectGallery').addEventListener('click', () => dialog.close());
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      advance(event.key === 'ArrowLeft' ? -1 : 1);
    }
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => opener?.focus());
})();
