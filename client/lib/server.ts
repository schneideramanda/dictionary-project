import 'server-only';
import { cookies } from 'next/headers';
import { API_BASE_URL, JWT_COOKIE_NAME } from './config';
import { ApiErrorBody } from '@/types/api';

export class ApiError extends Error {
  status: number;
  body: ApiErrorBody | null;

  constructor(status: number, body: ApiErrorBody | null) {
    super(body?.error ?? `Request failed with status ${status}`);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

type ServerFetchOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
};

export async function serverApiFetch<T>(
  path: string,
  options: ServerFetchOptions = {},
): Promise<T> {
  const cookieStore = await cookies();
  const jwt = cookieStore.get(JWT_COOKIE_NAME)?.value;

  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  if (jwt) {
    headers.set('Cookie', `jwt=${jwt}`);
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    cache: options.cache ?? 'no-store',
  });

  if (!res.ok) {
    let body: ApiErrorBody | null = null;
    try {
      body = await res.json();
    } catch {
      // non-JSON error body, ignore
    }
    throw new ApiError(res.status, body);
  }

  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

export function forwardSetCookie(expressRes: Response, nextRes: Response) {
  const setCookie = expressRes.headers.get('set-cookie');
  if (setCookie) {
    nextRes.headers.append('Set-Cookie', setCookie);
  }
}
