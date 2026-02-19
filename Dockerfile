FROM node:20-slim

RUN apt-get update && apt-get install -y \
    wget gnupg ca-certificates libnss3 libatk1.0-0 libatk-bridge2.0-0 \
    libcups2 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 \
    libxrandr2 libgbm1 libpango-1.0-0 libcairo2 libasound2 \
    --no-install-recommends && rm -rf /var/lib/apt/lists/*
 
RUN groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
    && mkdir -p /home/pptruser/Downloads \
    && chown -R pptruser:pptruser /home/pptruser

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY --chown=pptruser:pptruser package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

RUN npx puppeteer browsers install chrome

COPY --chown=pptruser:pptruser . .

RUN pnpm run build

USER pptruser

EXPOSE 3000
CMD ["pnpm", "start"]