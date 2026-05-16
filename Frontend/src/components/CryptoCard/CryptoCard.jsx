import React, { useState, useCallback, memo } from 'react';
import { useCrypto } from '../../context/CryptoContext';
import { deleteCrypto, updateFromCoinGecko } from '../../services/apiService';
import { MESSAGES } from '../../constants/app.constants';
import CryptoHeader from './CryptoHeader';
import CryptoPriceDisplay from './CryptoPriceDisplay';
import CryptoStats from './CryptoStats';
import CryptoActions from './CryptoActions';
import './CryptoCard.css';

/**
 * Componente: CryptoCard
 * Responsabilidade: Exibir informações de uma criptomoeda (card)
 * SOLID - Single Responsibility: Gerencia apenas a lógica do card
 * SOLID - Composition: Usa subcomponentes para cada seção
 * Otimização: Memoizado + subcomponentes memoizados
 */
function CryptoCard({ crypto, onSelect }) {
  const { removeCrypto, setLoading, setError } = useCrypto();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleDelete = useCallback(async () => {
    if (window.confirm(MESSAGES.CONFIRM_DELETE(crypto.name))) {
      try {
        setLoading(true);
        await deleteCrypto(crypto.id);
        removeCrypto(crypto.id);
        setError(null);
      } catch (err) {
        console.error('Erro ao deletar:', err);
        setError(`${MESSAGES.ERROR_DELETE}: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }
  }, [crypto.id, crypto.name, removeCrypto, setLoading, setError]);

  const handleUpdate = useCallback(async () => {
    try {
      setIsUpdating(true);
      setError(null);
      await updateFromCoinGecko(crypto.id);
      setError(MESSAGES.SUCCESS_UPDATE);
    } catch (err) {
      console.error('Erro ao atualizar:', err);
      setError(`${MESSAGES.ERROR_UPDATE}: ${err.message}`);
    } finally {
      setIsUpdating(false);
    }
  }, [crypto.id, setError]);

  const handleCardClick = useCallback(() => {
    onSelect?.(crypto);
  }, [crypto, onSelect]);

  return (
    <article
      className="crypto-card"
      onClick={handleCardClick}
      role="article"
      aria-label={`Criptomoeda: ${crypto.name}`}
    >
      <CryptoHeader crypto={crypto} />
      <CryptoPriceDisplay price={crypto.price} />
      <CryptoStats price={crypto.price} />
      <CryptoActions
        isUpdating={isUpdating}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </article>
  );
}

export default memo(CryptoCard);
