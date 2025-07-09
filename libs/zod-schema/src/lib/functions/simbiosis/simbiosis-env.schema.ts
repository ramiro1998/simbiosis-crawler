import { z } from 'zod';

export const SimbiosisEnvSchema = z.object({
  HEADED_BROWSER_MODE: z.string(),
});

export type SimbiosisEnvSchemaDto = z.infer<typeof SimbiosisEnvSchema>;