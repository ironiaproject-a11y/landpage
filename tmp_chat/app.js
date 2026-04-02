import { Chatbot } from './chatbot.js';

const messagesEl = document.getElementById('messages');
const form = document.getElementById('composer');
const input = document.getElementById('input');
const status = document.getElementById('status');
const quick1 = document.getElementById('quick-1');
const quick2 = document.getElementById('quick-2');
const quick3 = document.getElementById('quick-3');

const bot = new Chatbot({
  onSendMessage: renderBotMessage,
  onStatusChange: s => status.textContent = s
});

// initial greeting
bot.start();

form.addEventListener('submit', e => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  appendUser(text);
  input.value = '';
  bot.receive(text);
});

quick1.addEventListener('click', () => {
  const t = quick1.textContent;
  appendUser(t);
  bot.receive(t);
});
quick2.addEventListener('click', () => {
  const t = quick2.textContent;
  appendUser(t);
  bot.receive(t);
});
quick3.addEventListener('click', () => {
  const t = quick3.textContent;
  appendUser(t);
  bot.receive(t);
});

function appendUser(text){
  const li = document.createElement('li');
  li.className = 'msg user';
  li.textContent = text;
  messagesEl.appendChild(li);
  scrollBottom();
}

function renderBotMessage(payload){
  // If a typing indicator is active, remove it before rendering the real message
  if (messagesEl._typingEl) {
    if (messagesEl._typingInterval) clearInterval(messagesEl._typingInterval);
    messagesEl.removeChild(messagesEl._typingEl);
    messagesEl._typingEl = null;
    messagesEl._typingInterval = null;
  }

  // handle typing indicator separately
  if (payload.typing) {
    const li = document.createElement('li');
    li.className = 'msg bot typing';
    const body = document.createElement('div');
    body.textContent = 'Digitando';
    li.appendChild(body);

    // animate simple dots
    let dots = 0;
    messagesEl.appendChild(li);
    messagesEl._typingEl = li;
    messagesEl._typingInterval = setInterval(() => {
      dots = (dots + 1) % 4;
      body.textContent = 'Digitando' + '.'.repeat(dots);
      scrollBottom();
    }, 400);
    scrollBottom();
    return;
  }

  const li = document.createElement('li');
  li.className = 'msg bot';
  if (payload.title) {
    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.textContent = payload.title;
    li.appendChild(meta);
  }
  const body = document.createElement('div');
  body.innerHTML = payload.html || escapeHtml(payload.text || '');
  li.appendChild(body);

  if (payload.suggestions?.length){
    const sugWrap = document.createElement('div');
    sugWrap.style.marginTop = '8px';
    payload.suggestions.forEach(s => {
      const btn = document.createElement('button');
      btn.className = 'suggestion';
      btn.type = 'button';
      btn.textContent = s;
      btn.addEventListener('click', () => {
        appendUser(s);
        bot.receive(s);
      });
      sugWrap.appendChild(btn);
    });
    li.appendChild(sugWrap);
  }

  messagesEl.appendChild(li);
  scrollBottom();
}

function scrollBottom(){
  requestAnimationFrame(()=> messagesEl.scrollTop = messagesEl.scrollHeight);
}

function escapeHtml(s){
  return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
}