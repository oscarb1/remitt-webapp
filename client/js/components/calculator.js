const SERVER_PATH = '/api/v1/convert';

const currencyHumanName = {
  ARS: 'Pesos Argentinos',
  VES: 'Bolívares Venezolanos',
};

function getRequestUrl(amount, from, to) {
  return `${SERVER_PATH}/${amount}/${from}/${to}`;
}

function round(value) {
  return parseFloat(value.toFixed(5));
}

async function convert(amount, from = 'ARS', to = 'VES') {
  const response = await fetch(getRequestUrl(amount, from, to));
  const data = await response.json();

  if (data.error) {
    console.error(data.message);
    alert('Ha ocurrido un error. Por favor, intente de nuevo más tarde.');
    return null;
  }

  return round(data.result);
}

async function updateRateDetails() {
  const fromCurrency = document.querySelector('.from_currency').value;
  const toCurrency = document.querySelector('.to_currency').value;

  const rate = await convert(1, fromCurrency, toCurrency);
  document.querySelector('#rate-details').innerHTML = `<p>1 ${fromCurrency} = ${round(rate)} ${toCurrency}</p><p>1 ${toCurrency} = ${round(1 / rate)} ${fromCurrency}</p>`;
}

function switchCurrencies() {
  const from = document.querySelector('.from_currency').value;
  const to = document.querySelector('.to_currency').value;
  document.querySelector('.from_currency').value = to;
  document.querySelector('.to_currency').value = from;
}

function switchAmounts() {
  const fromAmount = document.querySelector('.from_amount').value;
  const toAmount = document.querySelector('.to_amount').value;
  document.querySelector('.from_amount').value = toAmount;
  document.querySelector('.to_amount').value = fromAmount;
}

async function updateAmounts({ reversed }) {
  const fromCurrencyElementId = reversed ? '.to_currency' : '.from_currency';
  const toCurrencyElementId = reversed ? '.from_currency' : '.to_currency';
  const fromAmountElementId = reversed ? '.to_amount' : '.from_amount';
  const toAmountElementId = reversed ? '.from_amount' : '.to_amount';

  const amount = document.querySelector(fromAmountElementId).value;
  const fromCurrency = document.querySelector(fromCurrencyElementId).value;
  const toCurrency = document.querySelector(toCurrencyElementId).value;

  if (!amount) return;

  const result = await convert(amount, fromCurrency, toCurrency);
  document.querySelector(toAmountElementId).value = result;
}

async function updateCalculator({ reversed } = {}) {
  updateAmounts({ reversed });
  updateRateDetails();
}

async function switchCalculator() {
  switchCurrencies();
  switchAmounts();
  updateRateDetails();
}

function init() {
  document.querySelectorAll('.calculator').forEach((calculator) => {
    calculator.querySelector('.from_amount').addEventListener('input', async () => {
      await updateCalculator();
    });

    calculator.querySelector('.to_amount').addEventListener('input', async () => {
      await updateCalculator({ reversed: true });
    });

    calculator.querySelector('.calculator__switch').addEventListener('click', (event) => {
      event.preventDefault();
      switchCalculator();
    });

    calculator.querySelector('.from_currency').addEventListener('change', async () => {
      await updateCalculator();
    });

    calculator.querySelector('.to_currency').addEventListener('change', async () => {
      await updateCalculator({ reversed: true });
    });

    calculator.querySelector('.calculator__form').addEventListener('submit', async (event) => {
      event.preventDefault();

      const data = new FormData(event.target);
      const fromAmount = data.get('fromAmount');
      const toAmount = data.get('toAmount');
      const fromCurrency = data.get('fromCurrency');
      const toCurrency = data.get('toCurrency');
      const fromCurrencyHuman = currencyHumanName[fromCurrency];
      const toCurrencyHuman = currencyHumanName[toCurrency];
      const requestText = 'Hola me gustaría hacer un cambio: '
                          + `%0A${fromAmount} ${fromCurrency}(${fromCurrencyHuman})%0A`
                          + `a ${toAmount} ${toCurrency}(${toCurrencyHuman})`;
      const requestUrl = `https://wa.me/541127226635?text=${requestText}`;

      window.open(requestUrl, '_blank');
    });
    updateCalculator();
  });
}

export default { init };
