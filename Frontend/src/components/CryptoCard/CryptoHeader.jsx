import React, { memo } from 'react';

/**
 * Subcomponente: CryptoHeader
 * Responsabilidade: Exibir cabeçalho do card (imagem, nome, símbolo, ranking)
 * Otimização: Memoizado para evitar re-renders desnecessários
 */
function CryptoHeader({ crypto }) {
  return (
    <div className="crypto-header">
      <div className="crypto-info">
        {crypto.imageUrl && (
          <img
            src={crypto.imageUrl}
            alt={crypto.name}
            className="crypto-image"
            loading="lazy"
          />
        )}
        <div className="crypto-details">
          <h3 className="crypto-name">{crypto.name}</h3>
          <p className="crypto-symbol">{(crypto.symbol || '').toUpperCase()}</p>
          {crypto.marketCapRank && (
            <p className="crypto-rank">#{crypto.marketCapRank}</p>
          )}
        </div>
      </div>
      {crypto.marketCapRank && (
        <div className="crypto-rank-badge">#{crypto.marketCapRank}</div>
      )}
    </div>
  );
}

export default memo(CryptoHeader);
