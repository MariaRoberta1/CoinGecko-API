/**
 * Validadores de dados
 * Responsabilidade: Validar entrada de dados
 */

/**
 * Valida se é um número positivo
 */
export const isPositiveNumber = (value) => {
  const num = parseFloat(value);
  return !isNaN(num) && num > 0;
};

/**
 * Valida ID de criptomoeda
 */
export const isValidCryptoId = (id) => {
  return id && typeof id === 'string' && id.trim().length > 0;
};

/**
 * Valida símbolo de criptomoeda
 */
export const isValidSymbol = (symbol) => {
  return symbol && typeof symbol === 'string' && symbol.trim().length > 0;
};

/**
 * Valida objeto de criptomoeda
 */
export const isValidCrypto = (crypto) => {
  return crypto && 
         isValidCryptoId(crypto.id) && 
         isValidSymbol(crypto.symbol) && 
         crypto.name;
};

/**
 * Valida objeto de preço
 */
export const isValidPrice = (price) => {
  return price && 
         (isPositiveNumber(price.priceUsd) || 
          isPositiveNumber(price.priceEur) || 
          isPositiveNumber(price.priceBrl));
};

/**
 * Valida termo de busca
 */
export const isValidSearchTerm = (term) => {
  return term && typeof term === 'string' && term.trim().length >= 1;
};

/**
 * Valida array de criptomoedas
 */
export const isValidCryptoArray = (cryptos) => {
  return Array.isArray(cryptos) && cryptos.length > 0;
};
