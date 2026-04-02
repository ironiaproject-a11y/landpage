import { createFlow } from './flow.js';

export class Chatbot {
  constructor({ onSendMessage = ()=>{}, onStatusChange = ()=>{} } = {}) {
    this.onSendMessage = onSendMessage;
    this.onStatusChange = onStatusChange;
    this.flow = createFlow(this);
    this.context = {};
  }

  start(){
    this.onStatusChange('Online');
    this._send({ title: 'Olá 👋', text: 'Bem-vindo à Sua origem, Seu sorriso! Sou o assistente virtual. Posso ajudar com dores, agendamentos e informações sobre tratamentos. Como posso ajudar você hoje?', suggestions: ['Dói ao mastigar','Sensibilidade ao frio','Quero agendar']});
  }

  receive(text){
    const t = String(text || '').toLowerCase();
    // prepare reply first to compute a natural typing duration
    const reply = this.flow.handle(t, this.context);

    // compute typing duration based on reply length (clamped)
    const base = 600;
    const perChar = 25;
    const max = 2500;
    const len = String(reply.text || reply.html || '').length;
    const duration = Math.min(base + perChar * len, max);

    // send typing indicator
    this._send({ typing: true });

    // after simulated typing, send the real reply
    setTimeout(()=> {
      this._send(reply);
    }, duration);
  }

  _send(payload){
    // if payload requests escalation, update status to inform user
    if (payload && payload.escalate) {
      this.onStatusChange('Solicitando atendente...');
      // keep status for a short moment then show requested
      setTimeout(() => this.onStatusChange('Atendimento solicitado'), 1800);
    }
    this.onSendMessage(payload);
  }
}