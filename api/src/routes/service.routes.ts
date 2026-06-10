import { Hono } from 'hono';

import { authenticateNotificationBot } from '../middleware/authenticateNotificationBot.js';
import type { ServiceController } from '../controllers/service.controller';

export const createServiceRoutes = (serviceController: ServiceController) => {
  const router = new Hono();

  router.get('/', authenticateNotificationBot, c =>
    serviceController.listServices(c),
  );

  router.get('/status', authenticateNotificationBot, c =>
    serviceController.getServiceStatus(c),
  );

  router.post('/', authenticateNotificationBot, c =>
    serviceController.addService(c),
  );

  router.patch('/:id', authenticateNotificationBot, c =>
    serviceController.switchMonitoringState(c),
  );

  router.delete('/:id', authenticateNotificationBot, c =>
    serviceController.deleteService(c),
  );

  return router;
};
