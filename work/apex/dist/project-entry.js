// Apply before first paint so the entrance pose is never shown while loading.
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.classList.add('projects-loading');
  // Keep content available if the main animation script cannot load.
  setTimeout(() => document.documentElement.classList.remove('projects-loading'), 4000);
}
