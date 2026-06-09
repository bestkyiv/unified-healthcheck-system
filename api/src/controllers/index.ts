import { serviceManagementService } from '../services/index.js';
import { ServiceController } from './service.controller.js';

export const serviceController = new ServiceController(serviceManagementService);
