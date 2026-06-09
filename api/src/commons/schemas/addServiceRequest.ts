import { z } from 'zod';

export const addServiceRequestSchema = z
  .object({
    name: z.string().min(1).max(255),
    type: z.enum(['website', 'telegramBot']),
    urlOrIdentifier: z.string().min(1).max(500),
    intervalMs: z.number().int().positive().optional(),
  })
  .strict();

export type AddServiceRequest = z.infer<typeof addServiceRequestSchema>;
