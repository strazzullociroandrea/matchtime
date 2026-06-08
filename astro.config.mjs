import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import PWA from '@vite-pwa/astro';

export default defineConfig({
  output: 'server',
  adapter: cloudflare({
    mode: 'directory',
  }),
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [
      react(),
      PWA({
        registerType: 'autoUpdate',
        includeAssets: ['logo.png', 'favicon.svg', 'apple-touch-icon.png', 'mask-icon.svg'],
        manifest: {
          name: 'Match Time',
          short_name: 'Match Time',
          description: 'Gestione e consultazione partite di pallavolo',
          theme_color: '#FFFFFF',
          display: 'standalone',
          start_url: '/',
          icons: [
            { src: 'logo.png', sizes: '192x192', type: 'image/png' },
            { src: 'logo.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
          ]
        },
        workbox: {
          navigateFallback: '/',
          navigateFallbackDenylist: [/^\/api/],
          globPatterns: ['**/*.{css,js,html,svg,png,ico,txt}']
        }
      })
    ]
});