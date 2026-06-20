'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { API_BASE_URL, JWT_COOKIE_NAME } from '@/lib/config';
import { SignInForm, SignUpForm } from '@/lib/schemas/auth';

export type AuthActionState = {
  error: string | null;
};

async function applySetCookieFromResponse(res: Response) {
  const setCookie = res.headers.get('set-cookie');
  if (!setCookie) return;

  const [pair, ...attrs] = setCookie.split(';').map(s => s.trim());
  const [name, value] = pair.split('=');

  if (name !== JWT_COOKIE_NAME) return;

  const maxAgeAttr = attrs.find(a => a.toLowerCase().startsWith('max-age='));
  const expiresAttr = attrs.find(a => a.toLowerCase().startsWith('expires='));
  const isExpired = expiresAttr && new Date(expiresAttr.split('=')[1]).getTime() <= Date.now();

  const cookieStore = await cookies();

  if (isExpired || maxAgeAttr?.split('=')[1] === '0') {
    cookieStore.delete(JWT_COOKIE_NAME);
    return;
  }

  cookieStore.set(JWT_COOKIE_NAME, decodeURIComponent(value), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: maxAgeAttr ? Number(maxAgeAttr.split('=')[1]) : undefined,
  });
}

export async function signUpAction(values: SignUpForm): Promise<AuthActionState> {
  const res = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    return { error: body?.error ?? 'Sign up failed' };
  }

  await applySetCookieFromResponse(res);
  redirect('/');
}

export async function signInAction(values: SignInForm): Promise<AuthActionState> {
  const res = await fetch(`${API_BASE_URL}/auth/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    return { error: body?.error ?? 'Invalid email or password' };
  }

  await applySetCookieFromResponse(res);
  redirect('/');
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  const jwt = cookieStore.get(JWT_COOKIE_NAME)?.value;

  await fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
    headers: jwt ? { Cookie: `${JWT_COOKIE_NAME}=${jwt}` } : undefined,
  });

  cookieStore.delete(JWT_COOKIE_NAME);
  redirect('/sign-in');
}
