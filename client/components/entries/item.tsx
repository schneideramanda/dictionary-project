'use client';

import { motion } from 'framer-motion';
import { ChevronRightIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { WordEntry } from '@/types/api';
import { format as formatDate } from 'date-fns';
import { Card } from '../ui/card';
import FavoriteButton from '../favorite-button';

interface EntryItemProps {
  entry: string | WordEntry;
  idx: number;
  includeFavorite?: boolean;
}

export default function EntryItem({ entry, idx, includeFavorite = false }: EntryItemProps) {
  const router = useRouter();

  const arrowAnimation = {
    initial: { x: 0 },
    animate: { x: 5 },
  };

  const itemDetails = {
    word: typeof entry === 'string' ? entry : entry.word,
    date: typeof entry === 'string' ? null : formatDate(entry.added, 'hh:ss'),
  };

  return (
    <motion.li
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: idx * 0.1,
      }}>
      <Card
        className="p-4 border-b border-secondary/60 cursor-pointer dark:hover:bg-card/80 bg-primary/20 hover:bg-primary/10 dark:bg-card"
        onClick={() => router.push(`/entries/${itemDetails.word}`)}>
        <motion.div
          className="flex justify-between items-center"
          initial="initial"
          animate="initial"
          whileHover="animate">
          <div className="flex flex-col gap-1">
            <p className="text-lg font-medium capitalize">{itemDetails?.word}</p>
            {itemDetails?.date && <p className="text-sm text-foreground/60">{itemDetails.date}</p>}
          </div>
          <div className="flex items-center gap-2">
            {includeFavorite && <FavoriteButton word={itemDetails?.word} />}
            <motion.div variants={arrowAnimation}>
              <ChevronRightIcon className="text-foreground/40 size-4" />
            </motion.div>
          </div>
        </motion.div>
      </Card>
    </motion.li>
  );
}
