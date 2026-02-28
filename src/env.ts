import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["production", "development"]),
  DOWNLOAD_PATH: z.string(),
  CATEGORY: z.string(),
  TEAM: z.string(),
  URL_DOWNLOAD_SITE: z.string(),
  HOME_PLACE: z.string(),
  NEXT_PUBLIC_VAPID_PUBLIC_KEY: z.string(),
  VAPID_PRIVATE_KEY: z.string(),
});

export const env = process.env.SKIP_ENV_VALIDATION
  ? (envSchema.partial().parse(process.env) as z.infer<typeof envSchema>)
  : envSchema.parse(process.env);
