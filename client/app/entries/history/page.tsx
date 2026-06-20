'use client';

import EntryList from '@/components/entry-list';
import { Button } from '@/components/ui/button';
import { useMyHistory } from '@/hooks/useUser';
import { ChevronLeftIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function History() {
  const { data, isLoading, page, setPage } = useMyHistory();
  const router = useRouter();

  return (
    <div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ChevronLeftIcon className="text-foreground/60" />
        </Button>
        <h1 className="text-xl font-medium">User Word History</h1>
      </div>
      <EntryList data={data} isLoading={isLoading} page={page} setPage={setPage} />
    </div>
  );
}
