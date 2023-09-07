import dotenv from 'dotenv';

dotenv.config();

const URL = process.env.YADIO_URL;

async function get(fromCurrency, toCurrency) {
  const response = await fetch(`${URL}/1/${fromCurrency}/${toCurrency}?json=true`);
  const data = await response.json();

  if (data.error) {
    throw new Error(data.error);
  }
  return parseFloat(data.rate);
}

export default { get };
