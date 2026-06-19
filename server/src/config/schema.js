import { query } from './db.js';

const ensureAppSchema = async () => {
  await query(`
    CREATE TABLE IF NOT EXISTS "UserFavoriteWord" (
      id UUID PRIMARY KEY,
      "userId" TEXT NOT NULL,
      word TEXT NOT NULL,
      "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE ("userId", word)
    );
  `);

  await query(`
    CREATE INDEX IF NOT EXISTS "UserFavoriteWord_userId_createdAt_idx"
      ON "UserFavoriteWord" ("userId", "createdAt" DESC);
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS "UserSearchHistory" (
      id UUID PRIMARY KEY,
      "userId" TEXT NOT NULL,
      word TEXT NOT NULL,
      "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await query(`
    CREATE INDEX IF NOT EXISTS "UserSearchHistory_userId_createdAt_idx"
      ON "UserSearchHistory" ("userId", "createdAt" DESC);
  `);
};

export { ensureAppSchema };
