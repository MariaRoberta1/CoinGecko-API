import React, { useEffect, useState, useCallback, memo } from 'react';
import { useCrypto } from '../../context/CryptoContext';
import { getAllCryptos, getTopCryptos } from '../../services/apiService';
import { MESSAGES } from '../../constants/app.constants';
import CryptoCard from '../CryptoCard/CryptoCard';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import EmptyState from '../EmptyState/EmptyState';
import './CryptoList.css';

/**
 * Componente: CryptoList
 * Responsabilidade: Listar e exibir criptomoedas com gerenciamento de modo de visualização
 * SOLID - Single Responsibility: Apenas gerencia lista
 * SOLID - Composition: Composto por CryptoCard e componentes de estado
 * Otimização: Memoizado para evitar re-renders
 */
function CryptoList({ onSelectCrypto }) {
  const {
    state: { cryptos, searchResults, loading, error },
    setCryptos,
    setLoading,
    setError,
  } = useCrypto();

  const [viewMode, setViewMode] = useState('all'); // 'all' ou 'top'

  // Carrega criptomoedas iniciais
  useEffect(() => {
    loadCryptos();
  }, []);

  const loadCryptos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllCryptos();
      setCryptos(data || []);
    } catch (err) {
      console.error('Erro ao carregar criptomoedas:', err);
      setError(`${MESSAGES.ERROR_LOADING}: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [setCryptos, setLoading, setError]);

  const loadTopCryptos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTopCryptos();
      setCryptos(data || []);
    } catch (err) {
      console.error('Erro ao carregar top criptomoedas:', err);
      setError(`Erro ao carregar top criptos: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [setCryptos, setLoading, setError]);

  const handleViewChange = useCallback(
    async (mode) => {
      setViewMode(mode);
      if (mode === 'top') {
        await loadTopCryptos();
      } else {
        await loadCryptos();
      }
    },
    [loadCryptos, loadTopCryptos]
  );

  const handleRefresh = useCallback(() => {
    if (viewMode === 'top') {
      loadTopCryptos();
    } else {
      loadCryptos();
    }
  }, [viewMode, loadCryptos, loadTopCryptos]);

  // Determina quais criptomoedas exibir (resultados de busca ou lista completa)
  const displayedCryptos = searchResults.length > 0 ? searchResults : cryptos;

  return (
    <div className="crypto-list-container">
      <div className="list-header">
        <h2>Criptomoedas</h2>
        <div className="view-controls">
          <button
            className={`view-btn ${viewMode === 'all' ? 'active' : ''}`}
            onClick={() => handleViewChange('all')}
            aria-label="Visualizar todas as criptomoedas"
          >
            Todas
          </button>
          <button
            className={`view-btn ${viewMode === 'top' ? 'active' : ''}`}
            onClick={() => handleViewChange('top')}
            aria-label="Visualizar top 10 criptomoedas"
          >
            Top 10
          </button>
          <button
            className="view-btn refresh-btn"
            onClick={handleRefresh}
            disabled={loading}
            aria-label="Recarregar lista"
            title="Recarregar"
          >
            🔄 {loading ? 'Atualizando...' : 'Recarregar'}
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message" role="alert">
          ⚠️ {error}
        </div>
      )}

      {loading && <LoadingSpinner message={MESSAGES.LOADING} />}

      {!loading && displayedCryptos.length === 0 && (
        <EmptyState
          message={
            searchResults.length === 0
              ? MESSAGES.EMPTY_SEARCH
              : 'Nenhuma criptomoeda encontrada'
          }
        />
      )}

      <div className="crypto-list" role="grid">
        {displayedCryptos.map((crypto) => (
          <CryptoCard
            key={crypto.id}
            crypto={crypto}
            onSelect={onSelectCrypto}
          />
        ))}
      </div>

      {displayedCryptos.length > 0 && (
        <div className="list-footer">
          Total: <strong>{displayedCryptos.length}</strong> criptomoeda(s)
        </div>
      )}
    </div>
  );
}

export default memo(CryptoList);
