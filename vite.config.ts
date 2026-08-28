import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'node:path';

// PWA via generateSW (design.md §7): precache the app shell + bundled data.
// There are NO network calls in this app, so no runtime caching rules are
// needed — the default precache of built JS/CSS/HTML + public assets is enough
// for full offline function (Requirement 7.4, 7.5).
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      strategies: 'generateSW',
      includeAssets: [
        'icons/app_icon_leaf.png',
        'icons/app_icon_badge.png',
        'splash/splash_screen.png',
        'species/*.png',
        'map/*.png',
      ],
      manifest: {
        name: 'Mandai WildDex & Ranger Expeditions',
        short_name: 'WildDex',
        description:
          'Explore Mandai wildlife, scan species into your WildDex, complete ranger quests, and collect a souvenir journal.',
        theme_color: '#0f3d2e',
        background_color: '#082018',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        icons: [
          // Real supplied art (public/icons). Declared at both common sizes;
          // the source is a high-res square so browsers downscale cleanly.
          // A production build would emit exact 192/512 + maskable variants.
          {
            src: '/icons/app_icon_leaf.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icons/app_icon_leaf.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icons/app_icon_badge.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,woff2}'],
      },
      // Enables the SW in `vite preview`/dev testing without extra steps.
      devOptions: { enabled: false },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
