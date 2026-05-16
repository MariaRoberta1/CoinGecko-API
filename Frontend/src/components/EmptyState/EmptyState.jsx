import React, { memo } from 'react';
import './EmptyState.css';

/**
 * Componente: EmptyState
 * Responsabilidade: Exibir estado vazio quando não há dados
 * Otimização: Memoizado
 */
function EmptyState({ message = 'Nenhum resultado encontrado', icon = '📭' }) {
  return (
    <div className="empty-state" role="status" aria-label="Sem resultados">
      <div className="empty-icon">{icon}</div>
      <p className="empty-message">{message}</p>
    </div>
  );
}

export default memo(EmptyState);
