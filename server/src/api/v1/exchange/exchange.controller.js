import { BadRequestError } from '../../../lib/errors.js';
import cacheService from '../../../services/redis.js';
import ratesService from '../../../services/yadio.js';

const AVAILABLE_CURRENCIES = ['ARS', 'VES'];

function validateAmount(amount) {
  if (!amount) throw new BadRequestError('Amount is required');
  if (Number.isNaN(parseFloat(amount))) throw new BadRequestError('Amount must be a number');
  if (parseFloat(amount) < 0) throw new BadRequestError('Amount must be a positive number');

  return Math.round(parseFloat(amount));
}

function validateCurrency(currency) {
  if (!AVAILABLE_CURRENCIES.includes(currency)) {
    throw new BadRequestError(`Currency must be one of ${AVAILABLE_CURRENCIES.join(', ')}`);
  }
  return currency;
}

function validate(fromAmount, fromCurrency, toCurrency) {
  return {
    fromAmountCleaned: validateAmount(fromAmount),
    fromCurrencyCleaned: validateCurrency(fromCurrency),
    toCurrencyCleaned: validateCurrency(toCurrency),
  };
}

async function getRate(fromCurrency, toCurrency) {
  // Check if we already have the rate in cache
  const key = `${fromCurrency}-${toCurrency}`;
  const cache = await cacheService.get(key);
  if (cache) return parseFloat(cache);

  const rate = await ratesService.get(fromCurrency, toCurrency);
  await cacheService.set(key, rate);
  return rate;
}

async function convert(req, res, next) {
  const {
    amount,
    fromCurrency,
    toCurrency,
  } = req.params;

  try {
    const {
      fromAmountCleaned,
      fromCurrencyCleaned,
      toCurrencyCleaned,
    } = validate(amount, fromCurrency, toCurrency);

    const rate = await getRate(fromCurrencyCleaned, toCurrencyCleaned);
    const result = fromAmountCleaned * rate;

    return res.status(200).json({ message: 'ok', result });
  } catch (err) {
    next(err);
    return null;
  }
}

export default { convert };
