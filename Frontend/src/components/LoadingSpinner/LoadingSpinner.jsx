import React, { memo } from 'react';
import './LoadingSpinner.css';

/**
 * Componente: LoadingSpinner
 * Responsabilidade: Exibir estado de carregamento com spinner
 * Otimização: Memoizado
 */
function LoadingSpinner({ message = 'Carregando...' }) {
  return (
    <div className="loading" role="status" aria-label="Carregando">
      <div className="spinner"></div>
      <p>{message}</p>
    </div>
  );
}

export default memo(LoadingSpinner);
