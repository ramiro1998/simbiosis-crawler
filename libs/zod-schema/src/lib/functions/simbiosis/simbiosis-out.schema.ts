import { z } from 'zod';

export const SimbiosisOutputSchema = z.object({
  status: z.string(),
  message: z.string(),
});

export type SimbiosisOutputSchemaDto = z.infer<typeof SimbiosisOutputSchema>;
