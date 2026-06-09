import { Hono } from 'hono';

import type { ServiceController } from '../controllers/service.controller';

export const createServiceRoutes = (serviceController: ServiceController) => {
  const router = new Hono();

  router.post('/', (c) => serviceController.addService(c));

  return router;
};
