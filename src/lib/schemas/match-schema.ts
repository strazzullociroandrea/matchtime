import { z } from "zod";

export const MatchSchema = z.object({
  giornata: z.string(),
  numero: z.string(),
  data: z.string(),
  ora: z.string(),
  casa: z.string(),
  trasferta: z.string(),
  indirizzo: z.string(),
  done: z.boolean(),
  thisWeek: z.boolean(),
  isHome: z.boolean(),
  status: z.enum(["Conclusa", "Prossima", "In programma", "Rinviata"]),
});

export type PartitaVolley = z.infer<typeof MatchSchema>;
