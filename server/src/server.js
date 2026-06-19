import express from 'express';
import { config } from 'dotenv';
import { connectDB, disconnectDB } from './config/db.js';
import { ensureAppSchema } from './config/schema.js';
import { disconnectRedis } from './config/redis.js';
import cors from 'cors';

import entriesRouter from './routes/entries.js';
import authRouter from './routes/auth.js';
import userRouter from './routes/user.js';

config();

try {
  await connectDB();
  await ensureAppSchema();
} catch (error) {
  console.error(`Startup failed: ${error.message}`);
  process.exit(1);
}

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

// Body parsing middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/entries', entriesRouter);
app.use('/auth', authRouter);
app.use('/user', userRouter);

app.get('/', (req, res) => {
  res.json({
    message: 'English Dictionary',
  });
});

const PORT = 5001;
const server = app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});

// Handle unhandled promise rejections (e.g., database connection errors)
process.on('unhandledRejection', err => {
  console.error('Unhandled Rejection:', err);
  server.close(async () => {
    await disconnectDB();
    await disconnectRedis();
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', async err => {
  console.error('Uncaught Exception:', err);
  await disconnectDB();
  await disconnectRedis();
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(async () => {
    await disconnectDB();
    await disconnectRedis();
    process.exit(0);
  });
});
