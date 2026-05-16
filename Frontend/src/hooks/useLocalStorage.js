/**
 * Hook customizado: useLocalStorage
 * Responsabilidade: Persistir estado em localStorage com sincronização automática
 * Uso: const [value, setValue] = useLocalStorage('key', defaultValue);
 */
import { useState, useEffect } from 'react';

export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Erro ao ler localStorage para chave '${key}':`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Erro ao salvar em localStorage para chave '${key}':`, error);
    }
  };

  return [storedValue, setValue];
};
