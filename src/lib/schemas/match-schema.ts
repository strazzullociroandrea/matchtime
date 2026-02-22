import { z } from "zod";

export const MatchSchema = z.object({
  day: z.string(),
  number: z.string(),
  date: z.string(),
  hour: z.string(),
  home: z.string(),
  guest: z.string(),
  place: z.string(),
  isHome: z.boolean(),
  status: z.enum(["Conclusa", "Prossima", "In programma", "Rinviata"]),
});

export type PartitaVolley = z.infer<typeof MatchSchema>;
