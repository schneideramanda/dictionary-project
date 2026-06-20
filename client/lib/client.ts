import type { ApiErrorBody } from '@/types/api';

export class ClientApiError extends Error {
  status: number;
  body: ApiErrorBody | null;

  constructor(status: number, body: ApiErrorBody | null) {
    super(body?.error ?? `Request failed with status ${status}`);
    this.name = 'ClientApiError';
    this.status = status;
    this.body = body;
  }
}

export async function clientApiFetch<T>(
  path: string,
  options: Omit<RequestInit, 'body'> & { body?: unknown } = {},
): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body !== undefined) {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(`/api${path}`, {
    ...options,
    headers,
    credentials: 'include',
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    let body: ApiErrorBody | null = null;
    try {
      body = await res.json();
    } catch {
      // ignore
    }
    throw new ClientApiError(res.status, body);
  }

  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

export const fetcher = <T>(path: string) => clientApiFetch<T>(path);
