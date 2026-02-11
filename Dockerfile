FROM node:20-alpine

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile
COPY . .


RUN pnpm install --frozen-lockfile
RUN pnpm run build
RUN pnpm prune --prod

EXPOSE 3000
CMD ["pnpm", "start"]