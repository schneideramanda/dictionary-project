import { query as dbQuery } from '../config/db.js';
import { getRedisClient } from '../config/redis.js';
import { randomUUID } from 'node:crypto';
import { resolveUserIdFromRequest } from '../middleware/auth.js';
import { parseLimit, parsePage } from '../utils/pagination.js';
import { normalizeQuery, normalizeWord } from '../utils/formatters.js';

const CACHE_TTL_SECONDS = 60 * 60 * 24;

const sendWithHeaders = (res, statusCode, payload, cacheState, startedAt) => {
  const elapsedMs = Number(process.hrtime.bigint() - startedAt) / 1e6;

  res.setHeader('x-cache', cacheState);
  res.setHeader('x-response-time', `${elapsedMs.toFixed(2)}ms`);
  return res.status(statusCode).json(payload);
};

const recordSearchHistory = async (userId, word) => {
  if (!userId || !word) {
    return;
  }

  await dbQuery(
    'INSERT INTO "UserSearchHistory" (id, "userId", word, "createdAt") VALUES ($1, $2, $3, NOW())',
    [randomUUID(), userId, word],
  );
};

const addFavoriteWord = async (userId, word) => {
  await dbQuery(
    'INSERT INTO "UserFavoriteWord" (id, "userId", word, "createdAt") VALUES ($1, $2, $3, NOW()) ON CONFLICT ("userId", word) DO NOTHING',
    [randomUUID(), userId, word],
  );
};

const removeFavoriteWord = async (userId, word) => {
  await dbQuery('DELETE FROM "UserFavoriteWord" WHERE "userId" = $1 AND word = $2', [userId, word]);
};

const buildSearchClause = searchQuery => {
  if (!searchQuery) {
    return {
      countSql: 'SELECT COUNT(*)::int AS count FROM "Word"',
      countParams: [],
      listSql: 'SELECT text FROM "Word" ORDER BY text ASC LIMIT $1 OFFSET $2',
      listParamsBuilder: (limit, offset) => [limit, offset],
    };
  }

  return {
    countSql: 'SELECT COUNT(*)::int AS count FROM "Word" WHERE LOWER(text) LIKE $1',
    countParams: [`${searchQuery}%`],
    listSql:
      'SELECT text FROM "Word" WHERE LOWER(text) LIKE $1 ORDER BY text ASC LIMIT $2 OFFSET $3',
    listParamsBuilder: (limit, offset) => [`${searchQuery}%`, limit, offset],
  };
};

const listEntries = async (req, res) => {
  const searchQuery = normalizeQuery(req.query.search ?? req.query.q);
  const page = parsePage(req.query.page);
  const limit = parseLimit(req.query.limit);
  const offset = (page - 1) * limit;

  const { countSql, countParams, listSql, listParamsBuilder } = buildSearchClause(searchQuery);

  const [countResult, wordsResult] = await Promise.all([
    dbQuery(countSql, countParams),
    dbQuery(listSql, listParamsBuilder(limit, offset)),
  ]);

  const totalDocs = Number(countResult.rows?.[0]?.count ?? 0);
  const totalPages = Math.ceil(totalDocs / limit);

  return res.json({
    results: wordsResult.rows.map(word => word.text),
    totalDocs,
    page,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  });
};

const favoriteEntry = async (req, res) => {
  const userId = req.user?.id;
  const word = normalizeWord(req.params.word);

  if (!word) {
    return res.status(400).json({ error: 'Word is required' });
  }

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  await addFavoriteWord(userId, word);

  return res.status(200).json({ message: 'Word added to favorites' });
};

const unfavoriteEntry = async (req, res) => {
  const userId = req.user?.id;
  const word = normalizeWord(req.params.word);

  if (!word) {
    return res.status(400).json({ error: 'Word is required' });
  }

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  await removeFavoriteWord(userId, word);

  return res.status(200).json({ message: 'Word removed from favorites' });
};

const getEntryByWord = async (req, res) => {
  const startedAt = process.hrtime.bigint();
  const word = req.params.word?.trim();
  const normalizedWord = normalizeQuery(word);
  const userId = await resolveUserIdFromRequest(req);

  if (!word) {
    return sendWithHeaders(res, 400, { error: 'Word is required' }, 'BYPASS', startedAt);
  }

  if (userId) {
    try {
      await recordSearchHistory(userId, normalizedWord);
    } catch (error) {
      console.warn(`Search history write failed for ${normalizedWord}: ${error.message}`);
    }
  }

  const cacheKey = `dictionary:en:${normalizedWord}`;
  const redisClient = await getRedisClient();
  let cacheState = redisClient ? 'MISS' : 'BYPASS';

  if (redisClient) {
    try {
      const cachedValue = await redisClient.get(cacheKey);

      if (cachedValue) {
        const cachedEntry = JSON.parse(cachedValue);
        return sendWithHeaders(res, cachedEntry.statusCode, cachedEntry.body, 'HIT', startedAt);
      }
    } catch (error) {
      console.warn(`Redis read failed for ${cacheKey}: ${error.message}`);
      cacheState = 'BYPASS';
    }
  }

  const upstreamUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`;

  try {
    const upstreamResponse = await fetch(upstreamUrl);
    const responseText = await upstreamResponse.text();

    let responseBody;
    try {
      responseBody = JSON.parse(responseText);
    } catch {
      responseBody = { raw: responseText };
    }

    if (redisClient && (upstreamResponse.ok || upstreamResponse.status === 404)) {
      try {
        await redisClient.set(
          cacheKey,
          JSON.stringify({
            statusCode: upstreamResponse.status,
            body: responseBody,
          }),
          {
            EX: CACHE_TTL_SECONDS,
          },
        );
      } catch (error) {
        console.warn(`Redis write failed for ${cacheKey}: ${error.message}`);
      }
    }

    return sendWithHeaders(res, upstreamResponse.status, responseBody, cacheState, startedAt);
  } catch (error) {
    console.error(`Dictionary proxy failed for ${word}: ${error.message}`);
    return sendWithHeaders(
      res,
      502,
      { error: 'Unable to reach the dictionary API' },
      'BYPASS',
      startedAt,
    );
  }
};

export { favoriteEntry, getEntryByWord, listEntries, unfavoriteEntry };
