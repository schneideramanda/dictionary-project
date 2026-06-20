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

const getUser = async (req, res) => {
  const userId = req.user?.id;

  const userResult = await dbQuery('SELECT name, email FROM "User" WHERE "id" = $1 LIMIT 1', [
    userId,
  ]);
  const user = userResult.rows[0];

  res.status(200).json({
    id: userId,
    name: user.name,
    email: user.email,
  });
};

const getMyHistory = async (req, res) => listUserWords(req, res, 'UserSearchHistory');

const getMyFavorites = async (req, res) => listUserWords(req, res, 'UserFavoriteWord');

export { getUser, getMyFavorites, getMyHistory };
