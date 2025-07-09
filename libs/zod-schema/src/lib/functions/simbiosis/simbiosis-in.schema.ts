import { z } from 'zod';

export const SimbiosisInputSchema = z.object({
  ranBy: z.string(),
});

export type SimbiosisInputSchemaDto = z.infer<typeof SimbiosisInputSchema>;