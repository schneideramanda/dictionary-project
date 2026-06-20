'use server';

import { API_BASE_URL, JWT_COOKIE_NAME } from '@/lib/config';
import { cookies } from 'next/headers';

export async function favoriteAction(word: string): Promise<void> {
  const cookieStore = await cookies();
  const jwt = cookieStore.get(JWT_COOKIE_NAME)?.value;

  await fetch(`${API_BASE_URL}/entries/en/${word}/favorite`, {
    method: 'POST',
    headers: jwt ? { Cookie: `${JWT_COOKIE_NAME}=${jwt}` } : undefined,
  });
}

export async function unfavoriteAction(word: string): Promise<void> {
  const cookieStore = await cookies();
  const jwt = cookieStore.get(JWT_COOKIE_NAME)?.value;

  await fetch(`${API_BASE_URL}/entries/en/${word}/unfavorite`, {
    method: 'DELETE',
    headers: jwt ? { Cookie: `${JWT_COOKIE_NAME}=${jwt}` } : undefined,
  });
}
