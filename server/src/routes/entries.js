import express from 'express';
import {
  favoriteEntry,
  getEntryByWord,
  listEntries,
  unfavoriteEntry,
} from '../controllers/entries.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/en', listEntries);
router.get('/en/:word', getEntryByWord);
router.post('/en/:word/favorite', requireAuth, favoriteEntry);
router.delete('/en/:word/unfavorite', requireAuth, unfavoriteEntry);

export default router;
