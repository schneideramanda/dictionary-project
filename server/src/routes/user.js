import express from 'express';
import { getUser, getMyFavorites, getMyHistory } from '../controllers/user.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/me', requireAuth, getUser);
router.get('/me/history', requireAuth, getMyHistory);
router.get('/me/favorites', requireAuth, getMyFavorites);

export default router;
