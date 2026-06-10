import { z } from 'zod';

export const switchMonitoringStateRequestSchema = z
  .object({
    isMonitored: z.boolean(),
  })
  .strict();
