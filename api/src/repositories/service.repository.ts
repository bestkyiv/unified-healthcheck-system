import type { PrismaClient, Service } from '../../generated/prisma/client.js';
import type {
  CreateServiceInput,
  IServiceRepository,
} from './repository.js';

export class ServiceRepository implements IServiceRepository {
  constructor(private readonly prisma: PrismaClient) {}

  findAll(): Promise<Service[]> {
    return this.prisma.service.findMany();
  }

  create({
    name,
    type,
    urlOrIdentifier,
    intervalMs,
  }: CreateServiceInput): Promise<Service> {
    return this.prisma.service.create({
      data: {
        name,
        type,
        urlOrIdentifier,
        status: 'pending',
        intervalMs,
      },
    });
  }

  switchMonitoringState(
    serviceId: number,
    isMonitored: boolean,
  ): Promise<Service> {
    return this.prisma.service.update({
      where: { id: serviceId },
      data: { isMonitored },
    });
  }

  async deleteById(serviceId: number): Promise<Service | null> {
    const service = await this.prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) return null;

    return this.prisma.service.delete({
      where: { id: serviceId },
    });
  }
}
