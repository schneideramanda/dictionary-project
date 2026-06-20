'use client';

import { StarIcon } from 'lucide-react';
import { Button } from './ui/button';
import { MouseEvent, useTransition } from 'react';
import { useMyFavorites } from '@/hooks/useUser';
import { favoriteAction, unfavoriteAction } from '@/app/actions/entries';

interface FavoriteButtonProps {
  word: string;
}

export default function FavoriteButton({ word }: FavoriteButtonProps) {
  const [isPending, startTransition] = useTransition();

  const {
    data: favorites,
    isLoading: favoritesLoading,
    mutate: mutateFavorites,
  } = useMyFavorites();

  const isFavorite = !!favorites?.results.find(favorite => favorite.word === word);

  const handleFavorite = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (isFavorite) {
      startTransition(async () => {
        await unfavoriteAction(word);
      });
    } else {
      startTransition(async () => {
        await favoriteAction(word);
      });
    }
    mutateFavorites(undefined, { revalidate: true });
  };

  const isLoading = favoritesLoading || isPending;

  return (
    <Button variant="ghost" size="icon" disabled={isLoading} onClick={e => handleFavorite(e)}>
      <StarIcon
        fill={isFavorite ? 'yellow' : 'transparent'}
        className={`size-6 ${isFavorite ? 'text-foreground/60 dark:text-transparent' : ''}`}
      />
    </Button>
  );
}
