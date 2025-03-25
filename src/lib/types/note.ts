import { z } from 'zod';

// Note/Activity schema and type
export const noteSchema = z.object({
  id: z.string(),
  text: z.string(),
  author: z.string(),
  createdAt: z.string(),
});

export type Note = z.infer<typeof noteSchema>; 