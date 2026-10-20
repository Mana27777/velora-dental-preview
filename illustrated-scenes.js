import './illustrated-scenes.css';

const sprite = import.meta.env.BASE_URL + 'illustrations/velora-escenas.svg';

function illustration(symbol, label, variant = '') {
  const figure = document.createElement('figure');
  figure.className = ('velora-illustration ' + variant).trim();
  figure.innerHTML = '<svg viewBox="0 0 240 190" role="img" aria-label="' + label + '" focusable="false"><use href="' + sprite + '#' + symbol + '"></use></svg>';
  return figure;
}

function insertOnce(selector, symbol, label, placement = 'beforeend', variant = '') {
  const target = document.querySelector(selector);
  if (!target || target.querySelector(':scope > .velora-illustration')) return;
  target.insertAdjacentElement(placement, illustration(symbol, label, variant));
}

export function mountIllustratedScenes() {
  insertOnce('#opciones .education-copy', 'missing-tooth', 'Ilustración esquemática de una pieza ausente entre dientes vecinos.', 'beforeend', 'options-illustration');
  const steps = document.querySelectorAll('#proceso .steps li');
  const stepArt = [
    ['conversation', 'Ilustración conceptual de una conversación de valoración.'],
    ['calendar', 'Ilustración conceptual para coordinar una valoración.'],
    ['care-path', 'Ilustración conceptual de alternativas explicadas por un profesional.'],
  ];
  steps.forEach((step, index) => {
    if (stepArt[index] && !step.querySelector('.velora-illustration')) {
      step.insertBefore(illustration(stepArt[index][0], stepArt[index][1], 'step-illustration'), step.querySelector('h3'));
    }
  });
  insertOnce('#preguntas > div:first-child', 'tooth-question', 'Ilustración educativa de un diente junto a un globo de consulta.', 'beforeend', 'faq-illustration');
  insertOnce('#consulta', 'calendar', 'Ilustración conceptual de una agenda para solicitar una valoración.', 'afterbegin', 'booking-illustration');
}
