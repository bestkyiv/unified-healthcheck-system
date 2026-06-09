import { serviceRepository } from '../repositories/index.js';
import { ServiceManagementService } from './serviceManagement.service.js';

export const serviceManagementService = new ServiceManagementService(
  serviceRepository,
);
