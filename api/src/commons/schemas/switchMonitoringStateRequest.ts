import { z } from 'zod';

export const switchMonitoringStateParamsSchema = z
  .object({
    id: z.coerce.number().int().positive(),
  })
  .strict();

export const switchMonitoringStateRequestSchema = z
  .object({
    isMonitored: z.boolean(),
  })
  .strict();
