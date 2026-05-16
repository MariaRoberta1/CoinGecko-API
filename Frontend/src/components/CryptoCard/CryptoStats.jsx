import React, { memo } from 'react';
import { formatPercentage, formatVolume } from '../../utils/formatters';

/**
 * Subcomponente: CryptoStats
 * Responsabilidade: Exibir estatísticas (mudança %, volume)
 * Otimização: Memoizado para evitar re-renders desnecessários
 */
function CryptoStats({ price }) {
  if (!price) return null;

  const change = price.priceChangePercentage24h || 0;
  const isPositive = change >= 0;

  return (
    <div className="crypto-stats">
      <div className="crypto-change">
        <span
          className={`change-percentage ${isPositive ? 'positive' : 'negative'}`}
        >
          {formatPercentage(change)}
        </span>
      </div>

      {price.volume24hUsd && (
        <div className="crypto-volume">
          <span className="volume-label">Vol 24h:</span>
          <span className="volume-value">${formatVolume(price.volume24hUsd)}</span>
        </div>
      )}

      {price.marketCap && (
        <div className="crypto-market-cap">
          <span className="market-cap-label">Market Cap:</span>
          <span className="market-cap-value">${formatVolume(price.marketCap)}</span>
        </div>
      )}
    </div>
  );
}

export default memo(CryptoStats);
