import { z } from 'zod';

export const RfxOutputSchema = z.object({
  ceoImgUrl: z.string().url(),
});

export type RfxOutputSchemaDto = z.infer<typeof RfxOutputSchema>;