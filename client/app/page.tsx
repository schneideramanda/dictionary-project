'use client';

import EntryList from '@/components/entry-list';
import { Button } from '@/components/ui/button';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { useDebounce } from '@/hooks/useDebounce';
import { useEntries } from '@/hooks/useEntries';
import { HistoryIcon, SearchIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {
  const [searchParam, setSearchParam] = useState('');
  const debouncedSearchParam = useDebounce(searchParam, 300);

  const router = useRouter();

  const { data, isLoading, page, setPage } = useEntries({
    search: debouncedSearchParam,
  });

  useEffect(() => {
    setPage(1);
  }, [debouncedSearchParam, setPage]);

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="flex items-center gap-2">
          <InputGroup className="h-10">
            <InputGroupInput
              placeholder="Search..."
              value={searchParam}
              onChange={e => setSearchParam(e.target.value)}
            />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
          </InputGroup>
          <Button
            variant="ghost"
            onClick={() => router.push('/entries/history')}
            aria-label="History">
            <HistoryIcon />
          </Button>
        </div>
        <EntryList data={data} isLoading={isLoading} page={page} setPage={setPage} />
      </main>
    </div>
  );
}
