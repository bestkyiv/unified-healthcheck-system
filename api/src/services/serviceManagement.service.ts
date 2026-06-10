import { HTTPException } from 'hono/http-exception';
import { Prisma } from '../../generated/prisma/client.js';

import type { ServiceResponseDto } from '../commons/dto/serviceResponse.dto';
import type { IServiceRepository } from '../repositories/repository';
import type { AddServiceRequest } from '../commons/schemas';

export class ServiceManagementService {
  constructor(private readonly serviceRepository: IServiceRepository) {}

  async addService({
    name,
    type,
    urlOrIdentifier,
    intervalMs,
  }: AddServiceRequest): Promise<Partial<ServiceResponseDto>> {
    try {
      const service = await this.serviceRepository.create({
        name,
        type,
        urlOrIdentifier,
        intervalMs,
      });
      return {
        id: service.id,
        name: service.name,
        type: service.type,
        urlOrIdentifier: service.urlOrIdentifier,
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new HTTPException(409, {
          message: 'Service already exists',
        });
      }
      throw error;
    }
  }

  async switchMonitoringState(serviceId: number, state: boolean) {
    try {
      const service = await this.serviceRepository.switchMonitoringState(
        serviceId,
        state,
      );
      return {
        id: service.id,
        name: service.name,
        type: service.type,
        urlOrIdentifier: service.urlOrIdentifier,
        isMonitored: service.isMonitored,
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new HTTPException(404, {
          message: 'Service not found',
        });
      }

      throw error;
    }
  }
}
