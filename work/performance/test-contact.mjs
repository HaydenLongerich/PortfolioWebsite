import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('../apex/dist/contact.js',import.meta.url),'utf8');
const {buildEmailDraft,CONTACT_EMAIL}=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
test('draft is addressed to the supplied contact email',()=>{
 const url=new URL(buildEmailDraft({name:'Alex',email:'alex@example.com',topic:'Project idea',message:'Hello Hayden'}));
 assert.equal(url.protocol,'mailto:');assert.equal(url.pathname,CONTACT_EMAIL);assert.equal(CONTACT_EMAIL,'longeri@uwindsor.ca');
 assert.equal(url.searchParams.get('subject'),'Portfolio — Project idea');assert.equal(url.searchParams.get('body'),'Hi Hayden,\n\nHello Hayden\n\nAlex\nalex@example.com');
});
test('special characters, unicode and multiline messages remain intact',()=>{
 const message='A & B? #1 + 50%\nLet’s build something ↗';
 const url=new URL(buildEmailDraft({name:'Renée',email:'r+test@example.com',topic:'Work opportunity',message}));
 assert.ok(url.searchParams.get('body').includes(message));assert.ok(url.searchParams.get('body').includes('r+test@example.com'));assert.equal([...url.searchParams.keys()].length,2);
});
test('subject cannot introduce additional mail headers',()=>{
 const url=new URL(buildEmailDraft({name:'Alex',email:'alex@example.com',topic:'Hello\r\nBcc: other@example.com',message:'Hi'}));
 assert.ok(!/[\r\n]/.test(url.searchParams.get('subject')));assert.equal(url.searchParams.get('bcc'),null);
});
