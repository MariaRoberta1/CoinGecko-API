import React, { memo } from 'react';
import { formatUSD, formatEUR, formatBRL } from '../../utils/formatters';

/**
 * Subcomponente: CryptoPriceDisplay
 * Responsabilidade: Exibir preços em múltiplas moedas
 * Otimização: Memoizado para evitar re-renders desnecessários
 */
function CryptoPriceDisplay({ price }) {
  if (!price) {
    return <div className="crypto-prices">Sem dados de preço</div>;
  }

  return (
    <div className="crypto-prices">
      <div className="price-item">
        <span className="price-label">USD</span>
        <span className="price-value">{formatUSD(price.priceUsd)}</span>
      </div>
      <div className="price-item">
        <span className="price-label">EUR</span>
        <span className="price-value">{formatEUR(price.priceEur)}</span>
      </div>
      <div className="price-item">
        <span className="price-label">BRL</span>
        <span className="price-value">{formatBRL(price.priceBrl)}</span>
      </div>
    </div>
  );
}

export default memo(CryptoPriceDisplay);
