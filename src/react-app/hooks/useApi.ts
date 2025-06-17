import { useState } from 'react';

interface ApiState<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

export function useApi<T = unknown>() {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    error: null,
    loading: false,
  });

  const request = async (
    url: string,
    options: RequestInit = {},
  ): Promise<T> => {
    setState({ data: null, error: null, loading: true });

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setState({ data, error: null, loading: false });
      return data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      setState({ data: null, error: errorMessage, loading: false });
      throw error;
    }
  };

  const get = (url: string) => request(url, { method: 'GET' });
  const post = (url: string, body?: unknown) =>
    request(url, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  const put = (url: string, body?: unknown) =>
    request(url, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  const del = (url: string) => request(url, { method: 'DELETE' });

  return {
    ...state,
    request,
    get,
    post,
    put,
    delete: del,
  };
}
