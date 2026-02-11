FROM node:20-alpine

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY . .
COPY next.config.ts tsconfig.json ./
COPY tailwind.config.ts postcss.config.mjs ./
COPY components.json biome.json ./
COPY app ./app
COPY components ./components
COPY lib ./lib
COPY server ./server
COPY data ./data
COPY .env .env

RUN pnpm install --frozen-lockfile
RUN pnpm run build
RUN pnpm prune --prod

EXPOSE 3000
CMD ["pnpm", "start"]