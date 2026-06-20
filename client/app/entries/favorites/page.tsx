'use client';

import EntryList from '@/components/entry-list';
import { Button } from '@/components/ui/button';
import { useMyFavorites } from '@/hooks/useUser';
import { ChevronLeftIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Favorites() {
  const { data, isLoading, page, setPage } = useMyFavorites();
  const router = useRouter();

  return (
    <div className="px-6 py-8">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ChevronLeftIcon className="text-foreground/60" />
        </Button>
        <h1 className="text-xl font-medium">User Favorites Words</h1>
      </div>
      <EntryList data={data} isLoading={isLoading} page={page} setPage={setPage} includeFavorite />
    </div>
  );
}
