import { z } from "zod";

export const MatchSchema = z.object({
  Giornata: z.string() || z.number(),
  Numero: z.string().or(z.number()),
  Data: z.string(),
  Ora: z.string(),
  Casa: z.string(),
  Trasferta: z.string(),
  Indirizzo: z.string(),
  Done: z.boolean(),
  ThisWeek: z.boolean(),
  IsHome: z.boolean(),
});

export type PartitaVolley = z.infer<typeof MatchSchema>;
