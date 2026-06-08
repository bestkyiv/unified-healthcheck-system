import { Hono } from 'hono';
import { logger } from 'hono/logger';

import { prisma } from './lib/prisma';

const buildApp = async () => {
  await prisma.$connect();

  const app = new Hono();
  app.use(logger());

  const shutdown = async () => {
    await prisma.$disconnect();
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  return app;
};

export default await buildApp();
