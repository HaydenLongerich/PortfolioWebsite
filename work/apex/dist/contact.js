export const CONTACT_EMAIL = 'longeri@uwindsor.ca';
export function buildEmailDraft({name, email, topic, message}) {
 const cleanTopic = String(topic || 'Let’s connect').replace(/[\r\n]+/g,' ').trim();
 const subject = `Portfolio — ${cleanTopic}`;
 const body = `Hi Hayden,\n\n${String(message).trim()}\n\n${String(name).trim()}\n${String(email).trim()}`;
 return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
function setupContact() {
 const copyButton=document.querySelector('#copyContactEmail'),copyStatus=document.querySelector('#copyContactStatus');
 let timer;
 copyButton?.addEventListener('click',async()=>{
  clearTimeout(timer);
  try {await navigator.clipboard.writeText(CONTACT_EMAIL);copyStatus.textContent='Email copied';copyButton.setAttribute('aria-label','Email address copied');timer=setTimeout(()=>{copyStatus.textContent='';copyButton.setAttribute('aria-label','Copy email address');},3000);}
  catch {copyStatus.textContent=`Couldn’t copy — you can select ${CONTACT_EMAIL} above`;}
 });
 const form=document.querySelector('#contactForm'),status=document.querySelector('#contactFormStatus');
 form?.addEventListener('submit',event=>{
  event.preventDefault();
  if(!form.reportValidity())return;
  const data=new FormData(form);
  const message=String(data.get('message')||'').trim(),name=String(data.get('name')||'').trim();
  if(!name||!message){status.textContent='Please add your name and a message';return;}
  window.location.href=buildEmailDraft({name,email:data.get('email'),topic:data.get('topic'),message});
  status.textContent='If a draft doesn’t open, use the email link on this page';
 });
 const fields=document.querySelector('#contactFields');if(fields)fields.disabled=false;
}
if(typeof document!=='undefined')setupContact();
