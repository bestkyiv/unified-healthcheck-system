import { serviceController } from '../controllers/index.js';
import { createServiceRoutes } from './service.routes.js';

export const serviceRoutes = createServiceRoutes(serviceController);
