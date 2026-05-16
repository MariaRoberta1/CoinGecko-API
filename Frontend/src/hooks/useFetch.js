/**
 * Hook customizado: useFetch
 * Responsabilidade: Abstrair chamadas de API com cache, retry e erro
 * Uso: const { data, loading, error } = useFetch(url, options);
 */
import { useState, useEffect, useCallback } from 'react';

export const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    method = 'GET',
    headers = {},
    body = null,
    timeout = 10000,
    retryAttempts = 0,
    retryDelay = 1000,
  } = options;

  const fetchData = useCallback(async () => {
    let attempts = 0;
    const maxAttempts = retryAttempts + 1;

    while (attempts < maxAttempts) {
      try {
        setLoading(true);
        setError(null);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            ...headers,
          },
          body: body ? JSON.stringify(body) : null,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        setData(result);
        setLoading(false);
        return;
      } catch (err) {
        attempts++;

        if (attempts < maxAttempts) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        } else {
          setError(err.message || 'Erro ao buscar dados');
          setLoading(false);
        }
      }
    }
  }, [url, method, headers, body, timeout, retryAttempts, retryDelay]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
};
