import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { HTTPException } from 'hono/http-exception';

import { prisma } from './lib/prisma.js';
import { serviceRoutes } from './routes/index.js';

export const buildApp = async () => {
  await prisma.$connect();

  const app = new Hono();
  app.use(logger());

  app.route('/api/services', serviceRoutes);

  app.onError((err, c) => {
    if (err instanceof HTTPException) {
      if (err.status >= 500) {
        return c.json(
          {
            error: 'Internal server error',
            cause:
              process.env.NODE_ENV === 'production' ? undefined : err.cause,
          },
          err.status,
        );
      }

      return c.json(
        {
          error: err.message,
          cause: process.env.NODE_ENV === 'production' ? undefined : err.cause,
        },
        err.status,
      );
    }
    return c.json({ error: 'Internal server error' }, 500);
  });

  return app;
};
