import { motion } from 'framer-motion';
import { ChevronRightIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Card } from './ui/card';

interface EntryItemProps {
  entry: string;
  idx: number;
}

export default function EntryItem({ entry, idx }: EntryItemProps) {
  const router = useRouter();

  const arrowAnimation = {
    initial: { x: 0 },
    animate: { x: 5 },
  };

  return (
    <motion.li
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: idx * 0.1,
      }}>
      <Card
        className="p-4 border-b border-secondary/60 cursor-pointer dark:hover:bg-card/80 bg-primary/20 hover:bg-primary/10 dark:bg-card"
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
  );
}
