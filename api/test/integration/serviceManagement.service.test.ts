import { $ } from 'bun';

import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import type { Hono } from 'hono';

import { buildApp } from '../../src/app.js';
import { prisma } from '../../src/lib/prisma.js';

const authHeaders = {
  'x-api-key': process.env.BOT_TO_API_KEY,
};

describe('ServiceManagementService integration tests', () => {
  let app: Hono;

  beforeAll(async () => {
    if (process.env.NODE_ENV !== 'test') {
      throw new Error('Refusing to wipe database: NODE_ENV is not "test"');
    }

    await $`bun --bun prisma migrate reset --force`;
    app = await buildApp();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/services', () => {
    test('201 - adds a service', async () => {
      const payload = {
        name: 'new_bot',
        type: 'telegramBot',
        urlOrIdentifier: 'add-service-bot',
      };

      const res = await app.request('/api/services', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: authHeaders,
      });

      expect(res.status).toBe(201);

      const service = await prisma.service.findUnique({
        where: {
          type_urlOrIdentifier: {
            type: 'telegramBot',
            urlOrIdentifier: payload.urlOrIdentifier,
          },
        },
      });

      expect(service).not.toBeNull();
    });

    test('400 - invalid request body', async () => {
      const res = await app.request('/api/services', {
        method: 'POST',
        body: JSON.stringify({
          // missing required `name` field
          type: 'telegramBot',
          urlOrIdentifier: 'bad-body-bot',
        }),
        headers: authHeaders,
      });

      expect(res.status).toBe(400);
    });

    test('409 - service already exists', async () => {
      const payload = {
        name: 'duplicate bot',
        type: 'telegramBot',
        urlOrIdentifier: 'duplicate-bot',
      };

      await prisma.service.create({
        data: {
          name: payload.name,
          type: 'telegramBot',
          urlOrIdentifier: payload.urlOrIdentifier,
          status: 'pending',
        },
      });

      const res = await app.request('/api/services', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: authHeaders,
      });

      expect(res.status).toBe(409);
    });

    test('401 - no API key', async () => {
      const res = await app.request('/api/services', {
        method: 'POST',
        body: JSON.stringify({
          name: 'bot',
          type: 'telegramBot',
          urlOrIdentifier: 'no-key-bot',
        }),
        headers: { 'content-type': 'application/json' },
      });

      expect(res.status).toBe(401);
    });

    test('401 - invalid API key', async () => {
      const res = await app.request('/api/services', {
        method: 'POST',
        body: JSON.stringify({
          name: 'bot',
          type: 'telegramBot',
          urlOrIdentifier: 'wrong-key-bot',
        }),
        headers: {
          'content-type': 'application/json',
          'x-api-key': 'totally-wrong-key',
        },
      });

      expect(res.status).toBe(401);
    });
  });

  describe('PATCH /api/services/:id', () => {
    test('200 - switches monitoring state', async () => {
      const service = await prisma.service.create({
        data: {
          name: 'patch-bot',
          type: 'telegramBot',
          urlOrIdentifier: 'patch-200-bot',
          status: 'pending',
        },
      });

      const res = await app.request(`/api/services/${service.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ isMonitored: true }),
        headers: authHeaders,
      });

      expect(res.status).toBe(200);

      const updated = await prisma.service.findUnique({
        where: { id: service.id },
      });
      expect(updated?.isMonitored).toBe(true);
    });

    test('400 - invalid request body', async () => {
      const service = await prisma.service.create({
        data: {
          name: 'patch-bad-body-bot',
          type: 'telegramBot',
          urlOrIdentifier: 'patch-400-bot',
          status: 'pending',
        },
      });

      const res = await app.request(`/api/services/${service.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          // missing required `isMonitored` field
        }),
        headers: authHeaders,
      });

      expect(res.status).toBe(400);
    });

    test('404 - service does not exist', async () => {
      const res = await app.request('/api/services/999999', {
        method: 'PATCH',
        body: JSON.stringify({ isMonitored: true }),
        headers: authHeaders,
      });

      expect(res.status).toBe(404);
    });
  });

  describe('GET /api/services', () => {
    test('200 - returns list of services', async () => {
      await prisma.service.create({
        data: {
          name: 'list-bot',
          type: 'telegramBot',
          urlOrIdentifier: 'list-200-bot',
          status: 'pending',
        },
      });

      const res = await app.request('/api/services', {
        method: 'GET',
        headers: authHeaders,
      });

      expect(res.status).toBe(200);

      const body = await res.json() as unknown[];
      expect(Array.isArray(body)).toBe(true);
      expect(body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/services/status', () => {
    test('200 - returns service status', async () => {
      await prisma.service.create({
        data: {
          name: 'status-bot',
          type: 'telegramBot',
          urlOrIdentifier: 'status-200-bot',
          status: 'pending',
        },
      });

      const res = await app.request(
        '/api/services/status?type=telegramBot&urlOrIdentifier=status-200-bot',
        { method: 'GET', headers: authHeaders },
      );

      expect(res.status).toBe(200);
    });

    test('400 - invalid query params', async () => {
      const res = await app.request(
        '/api/services/status?type=invalidType&urlOrIdentifier=some-bot',
        { method: 'GET', headers: authHeaders },
      );

      expect(res.status).toBe(400);
    });

    test('404 - service does not exist', async () => {
      const res = await app.request(
        '/api/services/status?type=telegramBot&urlOrIdentifier=status-404-bot',
        { method: 'GET', headers: authHeaders },
      );

      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/services/:id', () => {
    test('200 - deletes a service', async () => {
      const service = await prisma.service.create({
        data: {
          name: 'delete-bot',
          type: 'telegramBot',
          urlOrIdentifier: 'delete-200-bot',
          status: 'pending',
        },
      });

      const res = await app.request(`/api/services/${service.id}`, {
        method: 'DELETE',
        headers: authHeaders,
      });

      expect(res.status).toBe(200);

      const deleted = await prisma.service.findUnique({
        where: { id: service.id },
      });
      expect(deleted).toBeNull();
    });

    test('400 - invalid id param', async () => {
      const res = await app.request('/api/services/abc', {
        method: 'DELETE',
        headers: authHeaders,
      });

      expect(res.status).toBe(400);
    });

    test('404 - service does not exist', async () => {
      const res = await app.request('/api/services/999999', {
        method: 'DELETE',
        headers: authHeaders,
      });

      expect(res.status).toBe(404);
    });
  });
});
