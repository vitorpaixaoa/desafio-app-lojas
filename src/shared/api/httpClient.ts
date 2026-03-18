import { API_BASE_URL } from '@/shared/constants/api';
import { runtimeRequest } from '@/mocks/runtimeApi';

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

type RequestOptions = {
  method?: RequestMethod;
  body?: unknown;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const method = options.method ?? 'GET';

  // Expo Go runtime: usa mock local em memória para evitar chamadas reais de rede.
  if (__DEV__ && !process.env.JEST_WORKER_ID) {
    const result = runtimeRequest(method, path, options.body);

    if (result.status >= 400) {
      throw new Error(result.message || 'Erro na requisição');
    }

    if (result.status === 204) {
      return undefined as T;
    }

    return result.data as T;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Erro na requisição');
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export const httpClient = {
  get: <T>(path: string) => request<T>(path, { method: 'GET' }),
  post: <T>(path: string, body: unknown) => request<T>(path, { method: 'POST', body }),
  put: <T>(path: string, body: unknown) => request<T>(path, { method: 'PUT', body }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};
