/**
 * Formatadores de dados
 * Responsabilidade: Transformar dados brutos em formato legível
 */

/**
 * Formata preço em USD
 */
export const formatUSD = (price) => {
  if (!price || isNaN(price)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

/**
 * Formata preço em EUR
 */
export const formatEUR = (price) => {
  if (!price || isNaN(price)) return '€0.00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

/**
 * Formata preço em BRL
 */
export const formatBRL = (price) => {
  if (!price || isNaN(price)) return 'R$0.00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

/**
 * Formata volume em milhões/bilhões
 */
export const formatVolume = (volume) => {
  if (!volume || isNaN(volume)) return '$0.00';
  
  if (volume >= 1e9) {
    return (volume / 1e9).toFixed(2) + 'B';
  }
  if (volume >= 1e6) {
    return (volume / 1e6).toFixed(2) + 'M';
  }
  if (volume >= 1e3) {
    return (volume / 1e3).toFixed(2) + 'K';
  }
  return volume.toFixed(2);
};

/**
 * Formata percentual com cores
 */
export const formatPercentage = (value) => {
  if (!value || isNaN(value)) return '0.00%';
  const formatted = Math.abs(value).toFixed(2);
  return `${value >= 0 ? '▲' : '▼'} ${formatted}%`;
};

/**
 * Formata market cap de forma legível
 */
export const formatMarketCap = (marketCap) => {
  if (!marketCap || isNaN(marketCap)) return 'N/A';
  
  if (marketCap >= 1e12) {
    return '$' + (marketCap / 1e12).toFixed(2) + 'T';
  }
  if (marketCap >= 1e9) {
    return '$' + (marketCap / 1e9).toFixed(2) + 'B';
  }
  if (marketCap >= 1e6) {
    return '$' + (marketCap / 1e6).toFixed(2) + 'M';
  }
  return '$' + marketCap.toFixed(2);
};

/**
 * Formata data/hora
 */
export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

/**
 * Formata símbolo (para maiúsculas)
 */
export const formatSymbol = (symbol) => {
  return (symbol || '').toUpperCase();
};

/**
 * Trunca texto com ellipsis
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
