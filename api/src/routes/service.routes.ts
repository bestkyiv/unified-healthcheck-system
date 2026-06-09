import { Hono } from 'hono';

import { authenticateNotificationBot } from '../middleware/authenticateNotificationBot.js';
import type { ServiceController } from '../controllers/service.controller';

export const createServiceRoutes = (serviceController: ServiceController) => {
  const router = new Hono();

  router.post('/', authenticateNotificationBot, (c) =>
    serviceController.addService(c),
  );

  return router;
};
