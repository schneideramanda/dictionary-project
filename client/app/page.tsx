'use client';

import { Card } from '@/components/ui/card';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { useDebounce } from '@/hooks/useDebounce';
import { entriesApi } from '@/lib/api/entries';
import { useQuery } from '@tanstack/react-query';
import { ChevronRightIcon, SearchIcon } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import HomeSkeleton from './skeleton';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const [searchParam, setSearchParam] = useState('');
  const debouncedSearchParam = useDebounce(searchParam, 300);

  const { data: entries, isPending } = useQuery({
    queryKey: ['entries', debouncedSearchParam],
    queryFn: async () => await entriesApi.getEntries(debouncedSearchParam),
  });

  const arrowAnimation = {
    initial: { x: 0 },
    animate: { x: 5 },
  };

  if (isPending) return <HomeSkeleton />;

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
        <ul className="flex flex-col gap-4 mt-6">
          {entries && entries.length > 0 ? (
            entries.map((entry, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: idx * 0.1,
                }}>
                <Card
                  className="p-4 border-b border-secondary/60 cursor-pointer hover:bg-card/80"
                  onClick={() => router.push(`/entries/${entry}`)}>
                  <motion.div
                    className="flex justify-between items-center"
                    initial="initial"
                    animate="initial"
                    whileHover="animate">
                    <p className="text-lg font-medium capitalize">{entry}</p>
                    <motion.div variants={arrowAnimation}>
                      <ChevronRightIcon className="text-foreground/40 size-4" />
                    </motion.div>
                  </motion.div>
                </Card>
              </motion.li>
            ))
          ) : (
            <li className="text-muted-foreground">No entries found.</li>
          )}
        </ul>
      </main>
    </div>
  );
}
