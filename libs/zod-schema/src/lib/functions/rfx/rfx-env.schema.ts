import { z } from 'zod';

export const RfxEnvSchema = z.object({
  HEADED_BROWSER_MODE: z.string(),
});

export type RfxEnvSchemaDto = z.infer<typeof RfxEnvSchema>;