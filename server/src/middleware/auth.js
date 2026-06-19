import jwt from 'jsonwebtoken';

const readToken = req => {
  const authHeader = req.headers.authorization;

  if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7).trim();
  }

  const cookieHeader = req.headers.cookie;

  if (typeof cookieHeader !== 'string' || !cookieHeader) {
    return null;
  }

  const jwtCookie = cookieHeader
    .split(';')
    .map(part => part.trim())
    .find(part => part.startsWith('jwt='));

  if (!jwtCookie) {
    return null;
  }

  return decodeURIComponent(jwtCookie.slice(4));
};

const resolveUserIdFromRequest = async req => {
  const token = readToken(req);

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded?.id ?? null;
  } catch {
    return null;
  }
};

const requireAuth = async (req, res, next) => {
  const userId = await resolveUserIdFromRequest(req);

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  req.user = { id: userId };
  return next();
};

export { requireAuth, resolveUserIdFromRequest };
