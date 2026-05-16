/**
 * Constantes da aplicação
 * Responsabilidade: Centralizar valores hardcoded (URLs, timeouts, etc)
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8080/api/v1',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

// Endpoints
export const ENDPOINTS = {
  CRYPTOCURRENCIES: '/cryptocurrencies',
  CRYPTO_BY_ID: (id) => `/cryptocurrencies/${id}`,
  CRYPTO_BY_SYMBOL: (symbol) => `/cryptocurrencies/symbol/${symbol}`,
  SEARCH: '/cryptocurrencies/search',
  TOP: '/cryptocurrencies/top',
  UPDATE: (id) => `/cryptocurrencies/${id}/update`,
};

// Debounce timeout (ms)
export const DEBOUNCE_DELAY = 300;

// Cache durations (ms)
export const CACHE_DURATION = {
  CRYPTOS_LIST: 5 * 60 * 1000, // 5 minutos
  SINGLE_CRYPTO: 2 * 60 * 1000, // 2 minutos
  SEARCH_RESULTS: 1 * 60 * 1000, // 1 minuto
};

// Sort options
export const SORT_OPTIONS = {
  NAME: 'name',
  SYMBOL: 'symbol',
  PRICE_USD: 'priceUsd',
  MARKET_CAP_RANK: 'marketCapRank',
};

// View modes
export const VIEW_MODES = {
  GRID: 'grid',
  LIST: 'list',
};

// Messages
export const MESSAGES = {
  LOADING: 'Carregando...',
  ERROR_LOADING: 'Erro ao carregar criptomoedas',
  ERROR_DELETE: 'Erro ao deletar criptomoeda',
  ERROR_UPDATE: 'Erro ao atualizar de CoinGecko',
  SUCCESS_DELETE: 'Criptomoeda deletada com sucesso!',
  SUCCESS_UPDATE: 'Criptomoeda atualizada com sucesso!',
  EMPTY_SEARCH: 'Nenhuma criptomoeda encontrada',
  CONFIRM_DELETE: (name) => `Tem certeza que deseja deletar ${name}?`,
};

// Number of results
export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  MAX_RESULTS: 100,
};
