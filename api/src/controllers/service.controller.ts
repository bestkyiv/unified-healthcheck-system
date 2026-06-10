import { Context } from 'hono';

import validateRequest from '../lib/validateRequest';

import type { ServiceManagementService } from '../services/serviceManagement.service';

import {
  addServiceRequestSchema,
  switchMonitoringStateParamsSchema,
  switchMonitoringStateRequestSchema,
} from '../commons/schemas';

export class ServiceController {
  constructor(
    private readonly serviceManagementService: ServiceManagementService,
  ) {}

  async addService(c: Context) {
    const { name, type, urlOrIdentifier, intervalMs } = await validateRequest(
      c.req,
      addServiceRequestSchema,
    );

    const data = await this.serviceManagementService.addService({
      name,
      type,
      urlOrIdentifier,
      intervalMs,
    });

    return c.json(data, 201);
  }

  async switchMonitoringState(c: Context) {
    const { id } = await validateRequest(
      c.req,
      switchMonitoringStateParamsSchema,
      'Invalid route params',
      'params',
    );
    const { isMonitored } = await validateRequest(
      c.req,
      switchMonitoringStateRequestSchema,
    );

    const data = await this.serviceManagementService.switchMonitoringState(
      id,
      isMonitored,
    );

    return c.json(data, 200);
  }
}
