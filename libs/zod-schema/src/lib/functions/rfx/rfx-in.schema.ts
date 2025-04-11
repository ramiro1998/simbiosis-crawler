import { z } from 'zod';

export const RfxInputSchema = z.object({
  ranBy: z.string(),
});

export type RfxInputSchemaDto = z.infer<typeof RfxInputSchema>;