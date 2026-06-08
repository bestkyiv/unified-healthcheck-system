import { prisma } from '../lib/prisma';
import { ServiceRepository } from './service.repository';

export const serviceRepository = new ServiceRepository(prisma);
