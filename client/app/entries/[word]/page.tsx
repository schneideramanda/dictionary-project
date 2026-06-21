'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeftIcon, Volume2Icon } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import WordDetailSkeleton from './skeleton';
import { useEntry } from '@/hooks/useEntries';
import FavoriteButton from '@/components/favorite-button';
import { WordEntryDetail, Phonetic } from '@/types/api';
import { cn } from '@/lib/utils';

const POS_STYLES: Record<string, string> = {
  interjection: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-200',
  noun: 'bg-violet-100 text-violet-900 dark:bg-violet-900/40 dark:text-violet-200',
  verb: 'bg-indigo-100 text-indigo-900 dark:bg-indigo-900/40 dark:text-indigo-200',
  adjective: 'bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200',
  adverb: 'bg-rose-100 text-rose-900 dark:bg-rose-900/40 dark:text-rose-200',
};
const POS_FALLBACK = 'bg-secondary text-secondary-foreground';

function PosPill({ partOfSpeech }: { partOfSpeech: string }) {
  const style = POS_STYLES[partOfSpeech.toLowerCase()] ?? POS_FALLBACK;
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-mono font-medium capitalize',
        style,
      )}>
      {partOfSpeech}
    </span>
  );
}

export default function WordDetail() {
  const { word: wordParam } = useParams();
  const router = useRouter();

  const word = (wordParam as string) ?? '';

  const { data, isLoading: entryDetailLoading } = useEntry(word);

  const isLoading = entryDetailLoading;

  if (isLoading) return <WordDetailSkeleton />;

  const entries: WordEntryDetail[] = Array.isArray(data) ? data : data ? [data] : [];

  const phoneticsWithAudio: Phonetic[] = Array.from(
    new Map(
      entries
        .flatMap(entry => entry.phonetics ?? [])
        .filter(p => p.text && p.audio)
        .map(p => [p.text, p] as [string, Phonetic]),
    ).values(),
  );
  const primaryPhonetic = phoneticsWithAudio[0];

  const allPartsOfSpeech = Array.from(
    new Set(entries.flatMap(entry => entry.meanings?.map(m => m.partOfSpeech) ?? [])),
  );

  function playAudio(audioUrl: string) {
    const audio = new Audio(audioUrl);
    audio.play();
  }

  return (
    <div className="rounded-2xl bg-card border border-border shadow-lg overflow-hidden">
      <div className="flex items-center justify-between  px-5 py-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()} aria-label="Back">
          <ChevronLeftIcon />
        </Button>
        <div className="flex items-center gap-2">
          <FavoriteButton word={word} />
        </div>
      </div>

      <div className="px-6 py-6 sm:px-8 sm:py-8">
        {entries.length === 0 ? (
          <p className="text-center text-muted-foreground py-10">
            No definitions found for this word.
          </p>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}>
            {primaryPhonetic && (
              <p className="text-xs font-mono tracking-widest text-muted-foreground uppercase mb-1">
                Pronunciation
              </p>
            )}

            <div className="flex items-baseline gap-4 flex-wrap mb-5">
              <h1 className="font-serif text-4xl md:text-6xl font-medium capitalize tracking-tight">
                {word}
              </h1>
              {primaryPhonetic && (
                <div className="flex items-center gap-2">
                  <span className="text-base text-muted-foreground font-mono">
                    {primaryPhonetic.text}
                  </span>
                  <button
                    type="button"
                    onClick={() => playAudio(primaryPhonetic.audio)}
                    aria-label="Play pronunciation"
                    className="text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300">
                    <Volume2Icon size={18} />
                  </button>
                </div>
              )}
            </div>

            {allPartsOfSpeech.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {allPartsOfSpeech.map(pos => (
                  <PosPill key={pos} partOfSpeech={pos} />
                ))}
              </div>
            )}

            <div className="border-t border-border pt-6 flex flex-col gap-6">
              {entries.map((entry, entryIdx) => (
                <div key={entryIdx} className="flex flex-col gap-6">
                  {entries.length > 1 && (
                    <p className="text-xs font-mono uppercase tracking-wide text-muted-foreground">
                      Sense {entryIdx + 1}
                    </p>
                  )}

                  {entry.meanings?.map((meaning, meaningIdx) => (
                    <div key={meaningIdx} className="flex flex-col gap-3">
                      <PosPill partOfSpeech={meaning.partOfSpeech} />
                      <div className="space-y-4">
                        {meaning.definitions.map((def, defIdx) => (
                          <div key={defIdx} className="flex flex-col gap-1">
                            <p className="text-base leading-relaxed">{def.definition}</p>
                            {def.example && (
                              <p className="italic text-sm text-muted-foreground">
                                &quot;{def.example}&quot;
                              </p>
                            )}
                          </div>
                        ))}
                        {(meaning.synonyms?.length ?? 0) > 0 && (
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium text-foreground/80">Synonyms: </span>
                            {meaning.synonyms.join(', ')}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
