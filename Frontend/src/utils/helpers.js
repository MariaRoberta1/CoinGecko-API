/**
 * Funções utilitárias gerais
 * Responsabilidade: Prover helpers reutilizáveis
 */

/**
 * Aguarda N milissegundos
 */
export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Remove duplicatas de array
 */
export const removeDuplicates = (array, key) => {
  const seen = new Set();
  return array.filter((item) => {
    const id = key ? item[key] : item;
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
};

/**
 * Ordena array de criptomoedas
 */
export const sortCryptos = (cryptos, sortBy = 'name', order = 'asc') => {
  const sorted = [...cryptos].sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];

    if (sortBy === 'price') {
      aVal = a.price?.priceUsd || 0;
      bVal = b.price?.priceUsd || 0;
    }

    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }

    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });

  return sorted;
};

/**
 * Filtra criptomoedas por termo de busca
 */
export const filterCryptos = (cryptos, searchTerm) => {
  if (!searchTerm || searchTerm.trim() === '') return cryptos;

  const term = searchTerm.toLowerCase();
  return cryptos.filter((crypto) =>
    crypto.name?.toLowerCase().includes(term) ||
    crypto.symbol?.toLowerCase().includes(term) ||
    crypto.id?.toLowerCase().includes(term)
  );
};

/**
 * Agrupa criptomoedas por letra inicial
 */
export const groupByFirstLetter = (cryptos) => {
  return cryptos.reduce((groups, crypto) => {
    const letter = (crypto.name?.[0] || '?').toUpperCase();
    if (!groups[letter]) {
      groups[letter] = [];
    }
    groups[letter].push(crypto);
    return groups;
  }, {});
};

/**
 * Pagina array
 */
export const paginate = (array, pageNumber, pageSize) => {
  const startIndex = (pageNumber - 1) * pageSize;
  return array.slice(startIndex, startIndex + pageSize);
};

/**
 * Combina dois arrays de criptomoedas (mantém mais recente)
 */
export const mergeAndDedupeCryptos = (array1, array2) => {
  const map = new Map();

  [...array1, ...array2].forEach((crypto) => {
    const existing = map.get(crypto.id);
    if (!existing || new Date(crypto.lastUpdated) > new Date(existing.lastUpdated)) {
      map.set(crypto.id, crypto);
    }
  });

  return Array.from(map.values());
};

/**
 * Clona objeto de criptomoeda profundamente
 */
export const cloneCrypto = (crypto) => {
  return JSON.parse(JSON.stringify(crypto));
};
