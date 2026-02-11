import {z} from "zod";

const envSchema = z.object({
    NODE_ENV: z.enum(["production", "development"]),
    URL_DOWNLOAD_SITE: z.string(),
    CATEGORY_TARGET: z.string(),
    TEAM_CATEGORY: z.string()
});

export const env = process.env.SKIP_ENV_VALIDATION
    ? (envSchema.partial().parse(process.env) as z.infer<typeof envSchema>)
    : envSchema.parse(process.env);

