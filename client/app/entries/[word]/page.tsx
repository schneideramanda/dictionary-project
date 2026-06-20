'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ChevronLeftIcon } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import WordDetailSkeleton from './skeleton';
import { useEntry } from '@/hooks/useEntries';
import FavoriteButton from '@/components/favorite-button';

export default function WordDetail() {
  const { word: wordParam } = useParams();
  const router = useRouter();

  const word = (wordParam as string) ?? '';

  const { data, isLoading: entryDetailLoading } = useEntry(word);

  const isLoading = entryDetailLoading;

  if (isLoading) return <WordDetailSkeleton />;

  return (
    <div className="px-6 py-8">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ChevronLeftIcon className="text-foreground/60" />
        </Button>
        <h1 className="text-4xl font-bold capitalize">{word}</h1>
        <FavoriteButton word={word} />
      </div>
      <Separator className="my-4" />
      <motion.div
        className="flex flex-col gap-6 mt-10"
        initial={{ opacity: 0, x: -200 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ opacity: { duration: 0.8 }, x: { duration: 0.5 } }}>
        {data?.phonetics?.map((phonetic, idx) => {
          if (!phonetic.text || !phonetic.audio) return null;

          return (
            <div key={idx} className="flex items-center gap-4">
              {phonetic.text && <p className="text-lg">{phonetic.text}</p>}
              {phonetic.audio && (
                <audio controls style={{ maxHeight: 30 }}>
                  <source src={phonetic.audio} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              )}
            </div>
          );
        })}
        {data?.meanings?.map((meaning, idx) => (
          <div key={idx} className="flex flex-col gap-2">
            <h2 className="text-2xl font-semibold capitalize text-primary">
              {meaning.partOfSpeech}
            </h2>
            <div className="space-y-4">
              {meaning.definitions.map((def, defIdx) => (
                <div key={defIdx} className="flex flex-col gap-1">
                  <p>{def.definition}</p>
                  {def.example && (
                    <p className="italic text-sm text-foreground/60">&quot;{def.example}&quot;</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
