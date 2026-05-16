import React, { useState, useCallback } from 'react';
import { useCrypto } from '../../context/CryptoContext';
import { useDebounce } from '../../hooks';
import { searchCryptos } from '../../services/apiService';
import { isValidSearchTerm } from '../../utils/validators';
import { DEBOUNCE_DELAY } from '../../constants/app.constants';
import './SearchBar.css';

/**
 * Componente: SearchBar
 * Responsabilidade: Permitir busca de criptomoedas com debounce
 * SOLID - Single Responsibility: Apenas gerencia busca
 * Otimização: Usa debounce para reduzir chamadas de API
 */
function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, DEBOUNCE_DELAY);
  const { setSearchResults, setLoading, setError } = useCrypto();

  // Efeito de debounce separado usando callback
  const executeSearch = useCallback(async (term) => {
    if (!isValidSearchTerm(term)) {
      setSearchResults([]);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const results = await searchCryptos(term);
      setSearchResults(results || []);
    } catch (error) {
      console.error('Erro ao buscar criptomoedas:', error);
      setError(`Erro ao buscar: ${error.message}`);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, [setSearchResults, setLoading, setError]);

  // Executa busca quando termo debouncado muda
  React.useEffect(() => {
    executeSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm, executeSearch]);

  const handleChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleClear = useCallback(() => {
    setSearchTerm('');
    setSearchResults([]);
    setError(null);
  }, [setSearchResults, setError]);

  return (
    <div className="search-bar">
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar criptomoeda (ex: Bitcoin, BTC)..."
          value={searchTerm}
          onChange={handleChange}
          className="search-input"
          aria-label="Buscar criptomoeda"
        />
        {searchTerm && (
          <button
            className="search-clear"
            onClick={handleClear}
            aria-label="Limpar busca"
            title="Limpar"
          >
            ✕
          </button>
        )}
        <span className="search-icon">🔍</span>
      </div>
    </div>
  );
}

export default SearchBar;
