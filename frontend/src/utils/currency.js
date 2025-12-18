export const DEFAULT_EXCHANGE_RATES = {
  USD: 1,
  BDT: 1,
  USD_TO_BDT: 110
};

const SYMBOLS = {
  BDT: '\u09F3',
  USD: '$'
};

const NBSP = '\u202F';

const formatWithGrouping = (value, locale = 'en-IN') =>
  new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);

export const formatPrice = (amount, options = {}) => {
  if (typeof amount !== 'number' || Number.isNaN(amount)) {
    return {
      convertedValue: 0,
      formatted: '-',
      formattedLabel: '-'
    };
  }

  const {
    currency = 'BDT',
    rate = DEFAULT_EXCHANGE_RATES[currency] ?? 1,
    locale
  } = options;

  const convertedValue = amount * rate;
  const roundedConverted = Math.round(convertedValue);
  const symbol = SYMBOLS[currency] || `${currency} `;

  const groupingLocale = locale || (currency === 'BDT' ? 'en-IN' : 'en-US');
  const groupedValue = formatWithGrouping(roundedConverted, groupingLocale);

  const formatted = `${symbol}${symbol ? NBSP : ''}${groupedValue}`.trim();
  const formattedLabel = `${currency.toUpperCase()} ${groupedValue}`.trim();

  return {
    convertedValue,
    formatted,
    formattedLabel
  };
};

export const formatBDT = (amount, options = {}) =>
  formatPrice(amount, { currency: 'BDT', ...options });

export const formatUSD = (amount, options = {}) =>
  formatPrice(amount, { currency: 'USD', ...options });
