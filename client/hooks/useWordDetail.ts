import { entriesApi } from '@/lib/api/entries';
import { userApi } from '@/lib/api/user';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface UseWordDetailReturn {
  handleFavorite: () => void;
  isFavorite: boolean;
  isPending: boolean;
}

export const useWordDetail = (word: string): UseWordDetailReturn => {
  const queryClient = useQueryClient();

  const { data: favorites, isPending: favoritesPending } = useQuery({
    queryKey: ['favorites'],
    queryFn: async () => await userApi.getFavoriteWords(),
  });

  const favoriteMutation = useMutation({
    mutationFn: entriesApi.favoriteWord,
    onSuccess: () => {
      toast.success('Word added to favorites!');
    },
    onError: error => toast.error((error as Error).message || 'Failed to add word to favorites.'),
  });

  const unfavoriteMutation = useMutation({
    mutationFn: entriesApi.unfavoriteWord,
    onSuccess: () => {
      toast.success('Word removed from favorites!');
    },
    onError: error =>
      toast.error((error as Error).message || 'Failed to remove word from favorites.'),
  });

  const isPending = favoriteMutation.isPending || unfavoriteMutation.isPending || favoritesPending;
  const isFavorite = !!favorites?.find(fav => fav.word === word);

  const handleFavorite = () => {
    if (isFavorite) {
      unfavoriteMutation.mutate(word);
    } else {
      favoriteMutation.mutate(word);
    }

    queryClient.invalidateQueries({ queryKey: ['favorites'] });
  };

  return { handleFavorite, isFavorite, isPending };
};
