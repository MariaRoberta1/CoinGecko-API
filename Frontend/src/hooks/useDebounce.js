/**
 * Hook customizado: useDebounce
 * Responsabilidade: Debounce de valores em tempo real
 * Uso: const debouncedSearch = useDebounce(searchTerm, 300);
 */
import { useState, useEffect } from 'react';

export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};
