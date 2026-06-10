import { describe, expect, test } from 'bun:test';
import type { Service } from '../../generated/prisma/client.js';

import type { IServiceRepository } from '../../src/repositories/repository.js';
import { ServiceManagementService } from '../../src/services/serviceManagement.service.js';

const createService = (overrides: Partial<Service> = {}): Service =>
  ({
    id: 1,
    name: 'Example service',
    type: 'website',
    urlOrIdentifier: 'https://example.com',
    telegramBotId: null,
    isMonitored: true,
    status: 'up',
    intervalMs: 60_000,
    lastCheckedAt: new Date('2026-06-10T12:00:00.000Z'),
    lastHeartbeatAt: new Date('2026-06-10T12:01:00.000Z'),
    createdAt: new Date('2026-06-10T11:00:00.000Z'),
    updatedAt: new Date('2026-06-10T12:02:00.000Z'),
    ...overrides,
  }) as Service;

const createRepository = (
  overrides: Partial<IServiceRepository> = {},
): IServiceRepository => ({
  findAll: async () => [],
  create: async () => createService(),
  switchMonitoringState: async () => createService(),
  deleteById: async () => createService(),
  findByUrlOrIdentifier: async () => null,
  ...overrides,
});

describe('ServiceManagementService', () => {
  test('listServices returns normalized service DTOs', async () => {
    const repository = createRepository({
      findAll: async () => [
        createService(),
        createService({
          id: 2,
          type: 'telegramBot',
          urlOrIdentifier: 'my_bot',
          status: 'pending',
          lastHeartbeatAt: null,
        }),
      ],
    });
    const service = new ServiceManagementService(repository);

    const result = await service.listServices();

    expect(result).toEqual([
      {
        id: 1,
        name: 'Example service',
        type: 'website',
        urlOrIdentifier: 'https://example.com',
        isMonitored: true,
        status: 'up',
        lastCheckedAt: new Date('2026-06-10T12:00:00.000Z'),
        lastHeartbeatAt: new Date('2026-06-10T12:01:00.000Z'),
      },
      {
        id: 2,
        name: 'Example service',
        type: 'telegramBot',
        urlOrIdentifier: 'my_bot',
        isMonitored: true,
        status: 'pending',
        lastCheckedAt: new Date('2026-06-10T12:00:00.000Z'),
        lastHeartbeatAt: null,
      },
    ]);
  });

  test('getServiceStatus returns a matching service', async () => {
    const repository = createRepository({
      findByUrlOrIdentifier: async (type, urlOrIdentifier) =>
        createService({ type, urlOrIdentifier, status: 'down' }),
    });
    const service = new ServiceManagementService(repository);

    const result = await service.getServiceStatus({
      type: 'telegramBot',
      urlOrIdentifier: 'healthcheck_bot',
    });

    expect(result).toEqual({
      id: 1,
      name: 'Example service',
      type: 'telegramBot',
      urlOrIdentifier: 'healthcheck_bot',
      isMonitored: true,
      status: 'down',
      lastCheckedAt: new Date('2026-06-10T12:00:00.000Z'),
      lastHeartbeatAt: new Date('2026-06-10T12:01:00.000Z'),
    });
  });
});
