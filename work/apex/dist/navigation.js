const reduced=matchMedia('(prefers-reduced-motion: reduce)');

const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('.side-nav');

menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',open);menu.textContent=open?'Close −':'Menu +';nav.classList.toggle('open',open)});

document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav?.classList.contains('open'))menu.click()});

nav?.addEventListener('click',e=>{if(e.target.closest('a')&&nav.classList.contains('open'))menu.click()});



document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',b===button));document.querySelectorAll('[data-project]').forEach(card=>{card.hidden=button.dataset.filter!=='all'&&card.dataset.project!==button.dataset.filter})}));

