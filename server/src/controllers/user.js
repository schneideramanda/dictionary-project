import { query as dbQuery } from '../config/db.js';
import { parseLimit, parsePage } from '../utils/pagination.js';

const listUserWords = async (req, res, tableName) => {
  const userId = req.user?.id;
  const page = parsePage(req.query.page);
  const limit = parseLimit(req.query.limit);
  const offset = (page - 1) * limit;

  const countResult = await dbQuery(
    `SELECT COUNT(*)::int AS count FROM "${tableName}" WHERE "userId" = $1`,
    [userId],
  );

  const wordsResult = await dbQuery(
    `SELECT word, "createdAt" AS added FROM "${tableName}" WHERE "userId" = $1 ORDER BY "createdAt" DESC LIMIT $2 OFFSET $3`,
    [userId, limit, offset],
  );

  const totalDocs = Number(countResult.rows?.[0]?.count ?? 0);
  const totalPages = Math.ceil(totalDocs / limit);

  return res.json({
    results: wordsResult.rows,
    totalDocs,
    page,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  });
};

const getMyHistory = async (req, res) => listUserWords(req, res, 'UserSearchHistory');

const getMyFavorites = async (req, res) => listUserWords(req, res, 'UserFavoriteWord');

export { getMyFavorites, getMyHistory };
