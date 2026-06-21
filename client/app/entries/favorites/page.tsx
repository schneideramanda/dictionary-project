'use client';

import EntryList from '@/components/entries/list';
import { Button } from '@/components/ui/button';
import { useMyFavorites } from '@/hooks/useUser';
import { ChevronLeftIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Favorites() {
  const { data, isLoading, page, setPage } = useMyFavorites();
  const router = useRouter();

  return (
    <div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.back()} aria-label="Back">
          <ChevronLeftIcon className="text-foreground/60" />
        </Button>
        <h1 className="text-xl font-medium">User Favorites Words</h1>
      </div>
      <EntryList data={data} isLoading={isLoading} page={page} setPage={setPage} includeFavorite />
    </div>
  );
}
