import type { Service, ServiceType } from '../../generated/prisma/client.js';

export interface CreateServiceInput {
  name: string;
  type: ServiceType;
  urlOrIdentifier: string;
  intervalMs?: number;
}

export interface IServiceRepository {
  findAll(): Promise<Service[]>;
  create(input: CreateServiceInput): Promise<Service>;
  switchMonitoringState(
    serviceId: number,
    isMonitored: boolean,
  ): Promise<Service>;
  deleteById(serviceId: number): Promise<Service | null>;
}
