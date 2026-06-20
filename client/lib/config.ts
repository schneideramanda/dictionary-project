export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5001';

if (typeof window !== 'undefined') {
  throw new Error('lib/config.ts must not be imported from client code');
}

export const JWT_COOKIE_NAME = 'jwt';
