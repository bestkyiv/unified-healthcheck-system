import { Context } from 'hono';

import validateRequest from '../lib/validateRequest';

import type { ServiceManagementService } from '../services/serviceManagement.service';

import { addServiceRequestSchema } from '../commons/schemas/addServiceRequest';

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
}
