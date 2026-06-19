import 'dotenv/config';
import { randomUUID } from 'node:crypto';
import { connectDB, disconnectDB, query } from '../src/config/db.js';

const WORDS_URL = 'https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt';
const BATCH_SIZE = 5000;

const chunk = (items, size) => {
  const groups = [];

  for (let index = 0; index < items.length; index += size) {
    groups.push(items.slice(index, index + size));
  }

  return groups;
};

const main = async () => {
  await connectDB();
  console.log(`Downloading words from ${WORDS_URL}`);

  const response = await fetch(WORDS_URL);

  if (!response.ok) {
    throw new Error(`Failed to download word list: ${response.status} ${response.statusText}`);
  }

  const content = await response.text();
  const words = [
    ...new Set(
      content
        .split(/\r?\n/)
        .map(word => word.trim())
        .filter(Boolean),
    ),
  ];

  console.log(`Fetched ${words.length} unique words`);

  await query('TRUNCATE TABLE "Word" RESTART IDENTITY CASCADE');

  for (const batch of chunk(words, BATCH_SIZE)) {
    const valuePlaceholders = [];
    const params = [];

    batch.forEach((text, index) => {
      const baseIndex = index * 2;
      valuePlaceholders.push(`($${baseIndex + 1}, $${baseIndex + 2}, NOW())`);
      params.push(randomUUID(), text);
    });

    await query(
      `INSERT INTO "Word" (id, text, "createdAt") VALUES ${valuePlaceholders.join(', ')} ON CONFLICT (text) DO NOTHING`,
      params,
    );
    console.log(`Imported ${batch.length} words`);
  }

  console.log('Word import complete');
};

main()
  .catch(error => {
    console.error('Word import failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectDB();
  });
