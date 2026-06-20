'use client';

import EntryList from '@/components/entry-list';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { useDebounce } from '@/hooks/useDebounce';
import { SearchIcon } from 'lucide-react';
import { useState } from 'react';

export default function Home() {
  const [searchParam, setSearchParam] = useState('');
  const debouncedSearchParam = useDebounce(searchParam, 300);

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 px-6 py-8">
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
        <EntryList searchParam={debouncedSearchParam} />
      </main>
    </div>
  );
}
