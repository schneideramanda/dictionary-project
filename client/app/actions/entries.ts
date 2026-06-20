'use server';

import { serverApiFetch } from '@/lib/server';

export async function favoriteAction(word: string): Promise<void> {
  await serverApiFetch(`/entries/en/${word}/favorite`, {
    method: 'POST',
  });
}

export async function unfavoriteAction(word: string): Promise<void> {
  await serverApiFetch(`/entries/en/${word}/unfavorite`, {
    method: 'DELETE',
  });
}
