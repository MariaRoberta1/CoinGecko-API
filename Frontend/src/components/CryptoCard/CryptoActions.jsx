import React, { memo } from 'react';

/**
 * Subcomponente: CryptoActions
 * Responsabilidade: Botões de ação (atualizar, deletar)
 * Otimização: Memoizado para evitar re-renders desnecessários
 */
function CryptoActions({ isUpdating, onUpdate, onDelete }) {
  const handleUpdate = (e) => {
    e.stopPropagation();
    onUpdate();
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete();
  };

  return (
    <div className="crypto-actions">
      <button
        className="btn btn-update"
        onClick={handleUpdate}
        disabled={isUpdating}
        aria-label="Atualizar de CoinGecko"
        title="Atualizar de CoinGecko"
      >
        {isUpdating ? 'Atualizando...' : '🔄'}
      </button>
      <button
        className="btn btn-delete"
        onClick={handleDelete}
        aria-label="Deletar criptomoeda"
        title="Deletar"
      >
        🗑️
      </button>
    </div>
  );
}

export default memo(CryptoActions);
