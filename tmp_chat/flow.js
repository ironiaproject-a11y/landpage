export function createFlow(bot){
  // Richer rule + state flow to detect pains, urgency, context and book appointments.
  // clinic WhatsApp number (in international format, no + or separators)
  const CLINIC_WA = '5511999999999'; // replace with actual clinic number if needed

  return {
    handle(input, ctx){
      // normalize
      const kw = String(input || '').toLowerCase();

      // booking intent
      if (/agend|marcar|consulta|hora/.test(kw)) {
        return handleBooking(ctx);
      }

      // emergency/acute signs: bleeding, severe swelling, fever, breathing/swallowing difficulty
      if (/(sangra|sangramento|incha|inchaço|inchado|dor intensa|dor forte|febre|dificuldade para respirar|difícil engolir|engolir)/.test(kw)) {
        return {
          title: 'Sinais de emergência',
          text: 'Se há sangramento intenso, inchaço que dificulta respirar/engolir, febre alta ou dor insuportável, procure emergência imediatamente. Posso ligar para a clínica ou priorizar sua vaga — prefere isso?',
          suggestions: ['Ligar pra clínica','Marcar primeira vaga','Explicar sintomas']
        };
      }

      // duration/severity follow-up helper
      if (/(há|faz)\s*\d+|dias|semanas|meses|há pouco tempo|sumiu|melhorou|piorou/.test(kw) || /(leve|moderada|forte|insuportável|intensa)/.test(kw)) {
        // capture simple duration words
        return {
          title: 'Obrigado pela informação',
          text: 'Obrigado — isso ajuda. Para priorizar: você tem febre, inchaço visível ou secreção/pus na boca?',
          suggestions: ['Tenho febre','Há inchaço','Não, só dor']
        };
      }

      // toothache general
      if (/(dor de dente|dor no dente|toothache|doendo|dor aguda)/.test(kw)) {
        ctx.lastIssue = 'dor_de_dente';
        return {
          title: 'Dor de dente',
          text: 'A dor de dente pode ser por cárie, infecção (pulpite), fratura ou sensibilidade. Para alívio imediato: enxágue com água morna e sal, evite mastigar do lado afetado e analgésico conforme tolerância. Quer que eu agende uma avaliação ou prefere orientações para dor agora?',
          suggestions: ['Agendar avaliação','Dicas para alívio agora','Quero falar com atendente']
        };
      }

      // pain when chewing
      if (/(mastig|dor ao mastig|dói ao mastig)/.test(kw)) {
        ctx.lastIssue = 'dor_mastigar';
        return {
          title: 'Dor ao mastigar',
          text: 'Dor ao mastigar normalmente indica problema estrutural (fratura) ou cárie profunda. Evite mastigar do lado afetado e faça bochechos mornos. Deseja que eu verifique opções de horário ou envie orientações por WhatsApp?',
          suggestions: ['Ver horários','Enviar pelo WhatsApp','Dúvidas']
        };
      }

      // nocturnal/night pain and waking up
      if (/(dor à noite|acorda à noite|dor noturna|acordo com dor)/.test(kw)) {
        ctx.lastIssue = 'dor_noturna';
        return {
          title: 'Dor noturna',
          text: 'Dor que acorda à noite costuma indicar inflamação pulpar (necessidade de tratamento de canal) ou infecção. Recomendo agendar avaliação com prioridade. Deseja que eu confira horários?',
          suggestions: ['Sim, verificar horários','Quero orientações para dormir','Dúvidas']
        };
      }

      // sensitivity
      if (/sensibilidade|sensível|frio|doe com frio|sensível ao frio|sensível ao doce/.test(kw)) {
        ctx.lastIssue = 'sensibilidade';
        return {
          title: 'Sensibilidade dentária',
          text: 'Sensibilidade ao frio/doce pode vir de desgaste do esmalte, retração gengival ou restauração com fim de vida útil. Tente creme dental dessensibilizante e escova macia; podemos avaliar e aplicar flúor profissional.',
          suggestions: ['Marcar avaliação','Produtos recomendados','Dúvidas']
        };
      }

      // broken filling / lost crown
      if (/(coroa|coroa caiu|restauração caiu|obturação caiu|plomb|caiu|colocou|coroa solta|protese solta)/.test(kw)) {
        ctx.lastIssue = 'restauracao_solta';
        return {
          title: 'Restauração / prótese solta',
          text: 'Se uma restauração ou coroa caiu, guarde o fragmento e evite mastigar. Trazer o fragmento pode facilitar a reparação. Deseja agendar urgente para recolocação?',
          suggestions: ['Agendar urgente','Como guardar o fragmento','Dúvidas']
        };
      }

      // implant / peri-implantitis pain
      if (/(implante|dor no implante|peri-implantite|parafuso solto)/.test(kw)) {
        ctx.lastIssue = 'implante';
        return {
          title: 'Problema com implante',
          text: 'Dor ao redor de um implante pode ser sinal de inflamação peri-implantar ou sobrecarga. É importante avaliar em breve para evitar perda. Posso priorizar seu atendimento ou enviar instruções para higiene local?',
          suggestions: ['Agendar avaliação','Instruções de higiene','Dúvidas']
        };
      }

      // post-op pain (recent extraction or surgery)
      if (/(extração recente|operação|sair sangue pós|pós-operatório|pós operatório|fora|dentro de pouco tempo.*extração)/.test(kw)) {
        ctx.lastIssue = 'pos_op';
        return {
          title: 'Pós-operatório',
          text: 'Para dor pós-operatória siga as orientações do cirurgião: gelo nas primeiras 24h (externo), evitar cuspir e esforço, e analgesia conforme receitado. Se houver sangramento ativo, febre ou pus, procure contato urgente.',
          suggestions: ['Preciso de ajuda agora','Agendar revisão','Dúvidas']
        };
      }

      // loose tooth (adult)
      if (/(dente mole|dente solto|mole|solto|bate)/.test(kw)) {
        ctx.lastIssue = 'dente_mole';
        return {
          title: 'Dente solto',
          text: 'Dente solto em adulto pode indicar doença periodontal avançada, trauma ou problemas de suporte ósseo. Evite mexer no dente e agende avaliação para investigar e tratar o mais rápido possível.',
          suggestions: ['Agendar avaliação','O que evitar fazer','Dúvidas']
        };
      }

      // crowding / orthodontic concerns
      if (/(apinhamento|apinhado|sorriso torto|alinhamento|aparelho ortodôntico|aparelho|ortodontia)/.test(kw)) {
        ctx.lastIssue = 'ortodontia';
        return {
          title: 'Ortodontia / alinhamento',
          text: 'Temos opções de ortodontia convencional e alinhadores. Posso agendar uma avaliação para plano de tratamento e orçamento. Quer marcar uma avaliação gratuita (triagem)?',
          suggestions: ['Sim, agendar triagem','Quero orçamento','Dúvidas']
        };
      }

      // cosmetic: whitening, veneers
      if (/(clareamento|faceta|veneers|facetas|estética|sorriso bonito|estético)/.test(kw)) {
        ctx.lastIssue = 'estetica';
        return {
          title: 'Estética dentária',
          text: 'Oferecemos clareamento, facetas e restaurações estéticas. Uma avaliação define opções e custos. Deseja agendar para avaliação estética?',
          suggestions: ['Agendar avaliação estética','Ver opções de tratamento','Dúvidas']
        };
      }

      // halitosis
      if (/(halitose|mau hálito|mau halito|cheiro ruim)/.test(kw)) {
        ctx.lastIssue = 'mau_halito';
        return {
          title: 'Mau hálito (halitose)',
          text: 'Mau hálito pode vir de placa, cáries, gengivite ou problemas sistêmicos. Inicialmente escove língua, use fio dental e enxágue; podemos marcar limpeza e avaliação para descobrir a causa.',
          suggestions: ['Agendar limpeza','Produtos recomendados','Dúvidas']
        };
      }

      // price / treatment info
      if (/preço|valor|quanto custa|custa/.test(kw)) {
        return {
          title: 'Informações de preço',
          text: 'Os valores dependem do diagnóstico. Posso agendar uma avaliação para orçamento personalizado ou enviar uma estimativa por WhatsApp se preferir.',
          suggestions: ['Agendar avaliação','Enviar estimativa por WhatsApp','Não, obrigado']
        };
      }

      // how it works / treatments overview
      if (/como funciona|tratament|tratamento|o que fazem/.test(kw)) {
        return {
          title: 'Tratamentos oferecidos',
          html: '<strong>Oferecemos:</strong><ul><li>Restaurações e tratamentos de canal</li><li>Limpeza, tratamento periodontal</li><li>Clareamento e estética</li><li>Implantes e próteses</li><li>Ortodontia e alinhadores</li></ul>',
          suggestions: ['Agendar avaliação','Dúvidas']
        };
      }

      // anxiety / fear of dentist
      if (/(medo|ansiedade|fobia|tenso|nervoso|sinto medo)/.test(kw)) {
        return {
          title: 'Medo de dentista',
          text: 'Entendo. Muitos pacientes sentem ansiedade. Temos atendimento acolhedor, explicamos passo a passo e podemos oferecer estratégias para conforto (sedação leve quando indicado). Quer falar com nosso atendente sobre isso?',
          suggestions: ['Falar com atendente','Quero marcar com cuidado','Dúvidas']
        };
      }

      // pediatric concerns
      if (/(criança|filho|bebê|dente de leite|dente de criança|cárie infantil)/.test(kw)) {
        ctx.lastIssue = 'pediatria';
        return {
          title: 'Atendimento infantil',
          text: 'Atendemos crianças com abordagem tranquila e preventiva. Para emergências pediátricas (queda com sangramento, dente perdido), procure atendimento urgente. Deseja agendar consulta infantil?',
          suggestions: ['Agendar para criança','Dicas para escovação infantil','Dúvidas']
        };
      }

      // human attendant / escalate to human
      if (/(atendente|falar com atendente|atendimento humano|humano|falar com humano)/.test(kw)) {
        return {
          title: 'Atendimento humano',
          text: 'Posso encaminhar para um atendente humano. Deseja solicitação imediata ou preferir que entrem em contato mais tarde?',
          suggestions: ['Solicitar agora','Prefiro horário','Dúvidas']
        };
      }

      if (/solicitar atendimento agora|solicitar atendimento|solicitar atendente|solicitar atendimento já/.test(kw)) {
        return {
          title: 'Encaminhando para atendente',
          text: 'Certo — estou encaminhando seu pedido para um atendente humano. A equipe receberá a solicitação e entrará em contato em breve. Deseja enviar seu nome e telefone para agilizar?',
          suggestions: ['Enviar nome e telefone','Não, obrigado'],
          escalate: true
        };
      }

      // confirm booking options
      if (/marcar primeira vaga|marcar vaga|marcar urgência|marcar avaliação|agendar avaliação|sim, agendar|sim agendar|sim, agendar avaliação/.test(kw)) {
        return confirmBooking();
      }

      // user confirms contact via whatsapp or asks to send number
      if (/sim, ativar contato|sim, entrar em contato|entrar em contato/.test(kw)) {
        return {
          title: 'Encaminhado',
          text: 'Ok — sua solicitação foi encaminhada. A equipe da clínica entrará em contato em breve. Deseja receber confirmação por WhatsApp (enviar número)?',
          suggestions: ['Enviar número','Não obrigado']
        };
      }

      if (/enviar número|meu número|whats|whatsapp|(\d{8,})/.test(kw)) {
        return {
          title: 'Recebido',
          text: 'Obrigado — registramos seu contato. A clínica ligará/mandará mensagem em breve. Posso mais alguma coisa?',
          suggestions: ['Não, obrigado','Sim, outra dúvida']
        };
      }

      // WhatsApp booking: improved text includes lastIssue and preferred time if provided
      if (/(enviar pelo whatsapp|enviar pelo whats|enviar pelo zap|whatsapp|whats|zap)/.test(kw)) {
        const issueLabel = ctx.lastIssue ? ctx.lastIssue.replace(/_/g,' ') : 'agendamento';
        // try to capture a preferred time from context if present (naive)
        const prefTimeMatch = (ctx.preferredTime || '').toString();
        const preText = `Olá! Gostaria de agendar uma avaliação na clínica "Sua origem, Seu sorriso". Motivo: ${issueLabel}. ${prefTimeMatch ? 'Preferência de horário: ' + prefTimeMatch + '.' : ''} Pode confirmar horários disponíveis e orientações, por favor?`;
        const url = `https://wa.me/${CLINIC_WA}?text=${encodeURIComponent(preText)}`;
        return {
          title: 'Enviar pelo WhatsApp',
          html: `Clique para abrir o WhatsApp e enviar sua solicitação: <a href="${url}" target="_blank" rel="noopener noreferrer">Abrir WhatsApp</a>`,
          text: '',
          suggestions: ['Enviei pelo WhatsApp','Quero outra opção']
        };
      }

      // fallback - small help + suggestions
      return {
        title: 'Posso ajudar com:',
        text: 'Se preferir, diga resumidamente qual é o problema (ex: "dor ao mastigar", "sensibilidade", "quero agendar"). Posso fazer triagem e agendar.',
        suggestions: ['Dói ao mastigar','Sensibilidade ao frio','Quero agendar','Tenho inchaço']
      };
    }
  };
}

function handleBooking(ctx){
  // expanded booking prompts ask for preferred time and urgency
  return {
    title: 'Agendamento',
    text: 'Perfeito — posso agendar uma avaliação. Informe um dia da semana e horário aproximado (ex: terça de manhã) e se precisa prioridade.',
    suggestions: ['Terça de manhã','Quarta à tarde','Sexta de manhã','Preciso urgente','Enviar pelo WhatsApp']
  };
}

function confirmBooking(){
  return {
    title: 'Confirmar agendamento',
    text: 'Agendei uma pré-reserva. Nosso atendente confirmará o horário em até 24h. Deseja que eu registre seu nome, telefone e preferência de horário para agilizar?',
    suggestions: ['Sim, registrar nome e telefone','Não, obrigado','Enviar pelo WhatsApp']
  };
}