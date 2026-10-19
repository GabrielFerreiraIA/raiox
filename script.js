const accessKey = 'jc123';
const storageKey = 'multiplix-jc-access';
const loginForm = document.getElementById('login-form');
const passwordInput = document.getElementById('password');
const loginError = document.getElementById('login-error');

function unlockPage() {
  document.documentElement.classList.remove('locked');
  document.documentElement.classList.add('unlocked');
  loginError.textContent = '';
  passwordInput.value = '';
}

function lockPage() {
  document.documentElement.classList.remove('unlocked');
  document.documentElement.classList.add('locked');
  window.scrollTo(0, 0);
  passwordInput.focus();
}

try {
  if (sessionStorage.getItem(storageKey) === 'yes') unlockPage();
} catch (_) {
  // O acesso pela senha continua disponível se o navegador bloquear o armazenamento.
}

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (passwordInput.value.trim().toLowerCase() === accessKey) {
    try { sessionStorage.setItem(storageKey, 'yes'); } catch (_) {}
    unlockPage();
  } else {
    loginError.textContent = 'Senha incorreta. Confira e tente novamente.';
    passwordInput.select();
  }
});

document.getElementById('logout').addEventListener('click', () => {
  try { sessionStorage.removeItem(storageKey); } catch (_) {}
  lockPage();
});

const stages = [
  {
    kicker: 'ETAPA 01 / ORIGEM',
    title: 'A entrada do funil é multicanal.',
    description: 'A prospecção usa ligação, WhatsApp e e-mail. O LinkedIn foi descrito sobretudo como fonte para encontrar empresas e contatos, que depois são abordados em outros canais.',
    evidence: 'João explicou que o LinkedIn gera contatos para ligações e conversas; José descreveu a prospecção direta.',
    measure: 'Separar origem do lead de canal de contato evita atribuir à ligação uma oportunidade que começou em outra fonte.'
  },
  {
    kicker: 'ETAPA 02 / TENTATIVAS',
    title: 'A primeira camada de atividade não aparece inteira.',
    description: 'Na reunião, a gestão informou acompanhar contatos qualificados, mas não apresentou o total de ligações e tentativas sem resposta. Sem esse denominador, a taxa de conexão fica invisível.',
    evidence: 'João disse que a definição de qualificado foi alterada porque tentativas sem conversa estavam entrando no indicador.',
    measure: 'Registrar tentativas e contatos efetivos separadamente, por vendedor, lista e canal. Assim é possível distinguir problema de alcance de problema de abordagem.'
  },
  {
    kicker: 'ETAPA 03 / CONVERSA QUALIFICADA',
    title: 'O volume informado está perto de um quarto da meta.',
    description: 'José informou meta de 12 contatos qualificados ao dia e média aproximada de três. Na JC, “qualificado” foi usado para uma conversa efetiva, mesmo que a resposta seja negativa.',
    evidence: 'José reconheceu que os dois vendedores não batem a meta e que a média aproximada pode até estar superestimada em alguns dias.',
    measure: 'Confirmar no CRM se meta e média usam a mesma base por vendedor; depois acompanhar o percentual que avança para reunião e usar a mesma definição de contato para todos.'
  },
  {
    kicker: 'ETAPA 04 / REUNIÃO E PROPOSTA',
    title: 'Há etapas definidas, mas faltam taxas para avaliá-las.',
    description: 'José descreveu contato, reunião ou visita, apresentação do portfólio, proposta, negociação e fechamento. A reunião de diagnóstico não trouxe a quantidade ou taxa de avanço de cada fase.',
    evidence: 'No dia da conversa, Davi estava em reunião e Jéssica preparava uma proposta decorrente de uma reunião anterior.',
    measure: 'Medir reuniões realizadas, propostas enviadas, tempo de avanço e motivo de perda antes de atribuir toda a dificuldade a preço ou perfil.'
  },
  {
    kicker: 'ETAPA 05 / VENDA NOVA',
    title: 'A produção de novos contratos pelo time é o alerta.',
    description: 'José relatou cerca de dez meses sem novas vendas originadas pelo time comercial. Isso não significa ausência de negócios na JC: houve recorrência, novas demandas de clientes existentes, indicações e contatos dos sócios.',
    evidence: 'João e José diferenciaram a produção do comercial dos negócios vindos da carteira e de relacionamentos já existentes.',
    measure: 'Atribuir cada venda à sua origem e acompanhar o funil de aquisição nova separadamente da receita recorrente e da expansão de carteira.'
  }
];

const tabs = [...document.querySelectorAll('.step')];
const panel = document.getElementById('stage-panel');
function selectStage(index, focus = false) {
  const data = stages[index];
  tabs.forEach((tab, position) => {
    const active = position === index;
    tab.classList.toggle('active', active);
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
  });
  panel.setAttribute('aria-labelledby', `tab-${index}`);
  document.getElementById('stage-kicker').textContent = data.kicker;
  document.getElementById('stage-title').textContent = data.title;
  document.getElementById('stage-description').textContent = data.description;
  document.getElementById('stage-evidence').textContent = data.evidence;
  document.getElementById('stage-measure').textContent = data.measure;
  if (focus) tabs[index].focus();
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectStage(index));
  tab.addEventListener('keydown', (event) => {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    selectStage(next, true);
  });
});

document.querySelectorAll('.pillar-list details').forEach((detail) => {
  detail.addEventListener('toggle', () => {
    if (!detail.open) return;
    document.querySelectorAll('.pillar-list details').forEach((other) => {
      if (other !== detail) other.open = false;
    });
  });
});

document.querySelectorAll('.scenario-switch button').forEach((button) => {
  button.addEventListener('click', () => {
    const volume = Number(button.dataset.volume);
    document.querySelectorAll('.scenario-switch button').forEach((other) => {
      const active = other === button;
      other.classList.toggle('active', active);
      other.setAttribute('aria-pressed', String(active));
    });
    document.getElementById('scenario-contacts').textContent = String(volume);
    document.getElementById('scenario-meetings').textContent = (volume * 0.1).toLocaleString('pt-BR', {maximumFractionDigits: 1});
    document.getElementById('scenario-proposals').textContent = (volume * 0.01).toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2});
  });
});
