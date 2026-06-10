import { HTTPException } from 'hono/http-exception';
import { Prisma } from '../../generated/prisma/client.js';
import type { Service } from '../../generated/prisma/client.js';

import type { ServiceResponseDto } from '../commons/dto/serviceResponse.dto';
import type { IServiceRepository } from '../repositories/repository';
import type { AddServiceRequest, ServiceStatusQuery } from '../commons/schemas';

export class ServiceManagementService {
  constructor(private readonly serviceRepository: IServiceRepository) {}

  private mapServiceToResponseDto(service: Service): ServiceResponseDto {
    return {
      id: service.id,
      name: service.name,
      type: service.type,
      urlOrIdentifier: service.urlOrIdentifier,
      isMonitored: service.isMonitored,
      status: service.status,
      lastCheckedAt: service.lastCheckedAt,
      lastHeartbeatAt: service.lastHeartbeatAt,
    };
  }

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
      const serviceDto = this.mapServiceToResponseDto(service);

      return {
        id: serviceDto.id,
        name: serviceDto.name,
        type: serviceDto.type,
        urlOrIdentifier: serviceDto.urlOrIdentifier,
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

  async switchMonitoringState(
    serviceId: number,
    state: boolean,
  ): Promise<Partial<ServiceResponseDto>> {
    try {
      const service = await this.serviceRepository.switchMonitoringState(
        serviceId,
        state,
      );
      const serviceDto = this.mapServiceToResponseDto(service);

      return {
        id: serviceDto.id,
        name: serviceDto.name,
        type: serviceDto.type,
        urlOrIdentifier: serviceDto.urlOrIdentifier,
        isMonitored: serviceDto.isMonitored,
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

  async listServices(): Promise<ServiceResponseDto[]> {
    const services = await this.serviceRepository.findAll();

    return services.map(service => this.mapServiceToResponseDto(service));
  }

  async getServiceStatus({
    type,
    urlOrIdentifier,
  }: ServiceStatusQuery): Promise<ServiceResponseDto> {
    const service = await this.serviceRepository.findByUrlOrIdentifier(
      type,
      urlOrIdentifier,
    );

    if (!service) {
      throw new HTTPException(404, {
        message: 'Service not found',
      });
    }

    return this.mapServiceToResponseDto(service);
  }

  async deleteService(serviceId: number): Promise<Partial<ServiceResponseDto>> {
    try {
      const service = await this.serviceRepository.deleteById(serviceId);
      const serviceDto = this.mapServiceToResponseDto(service);

      return {
        id: serviceDto.id,
        name: serviceDto.name,
        type: serviceDto.type,
        urlOrIdentifier: serviceDto.urlOrIdentifier,
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
