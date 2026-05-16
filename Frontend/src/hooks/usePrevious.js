/**
 * Hook customizado: usePrevious
 * Responsabilidade: Rastrear valor anterior de uma propriedade
 * Uso: const previousValue = usePrevious(value);
 */
import { useEffect, useRef } from 'react';

export const usePrevious = (value) => {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};
