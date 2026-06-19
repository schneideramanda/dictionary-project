import bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';
import { query } from '../config/db.js';
import { generateToken } from '../utils/generateToken.js';

const signUp = async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await query('SELECT id FROM "User" WHERE email = $1 LIMIT 1', [email]);

  if (userExists.rowCount > 0) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const userResult = await query(
    'INSERT INTO "User" (id, name, email, password, "createdAt") VALUES ($1, $2, $3, $4, NOW()) RETURNING id, name, email',
    [randomUUID(), name, email, hashedPassword],
  );

  const user = userResult.rows[0];

  const token = generateToken(user.id, res);

  res.status(201).json({
    id: user.id,
    name,
    token,
  });
};

const signIn = async (req, res) => {
  const { email, password } = req.body;

  const userResult = await query(
    'SELECT id, email, password FROM "User" WHERE email = $1 LIMIT 1',
    [email],
  );
  const user = userResult.rows[0];

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = generateToken(user.id, res);

  res.status(200).json({
    id: user.id,
    name: user.name,
    token,
  });
};

const logout = async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully',
  });
};

export { signUp, signIn, logout };
