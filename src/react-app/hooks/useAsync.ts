import { useCallback, useEffect, useState } from 'react';

interface AsyncState<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
}

export function useAsync<T>(asyncFunction: () => Promise<T>, dependencies: unknown[] = []) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    error: null,
    loading: true,
  });

  const execute = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const data = await asyncFunction();
      setState({ data, error: null, loading: false });
    } catch (error) {
      setState({
        data: null,
        error: error instanceof Error ? error : new Error('Unknown error'),
        loading: false,
      });
    }
  }, [asyncFunction, ...dependencies]);

  useEffect(() => {
    execute();
  }, [execute]);

  return {
    ...state,
    execute,
  };
}
