import { z } from 'zod';

export const serviceStatusQuerySchema = z
  .object({
    type: z.enum(['website', 'telegramBot']),
    urlOrIdentifier: z.string().min(1).max(500),
  })
  .strict();

export type ServiceStatusQuery = z.infer<typeof serviceStatusQuerySchema>;
