// @ts-check
import { defineConfig } from 'astro/config';
import path from 'path';

import node from '@astrojs/node';

import tailwindcss from '@tailwindcss/vite'

// https://astro.build/config
export default defineConfig({
  adapter: node({
    mode: 'standalone'
  }),
  output: 'server',
    server: {
    port: 4321,
    host: true,
  },
  vite: {
    logLevel: 'info',

    resolve: {
      alias: {
        '@': path.resolve('./src')
      }
    },

    ssr: {
      noExternal: ['gsap', 'particles.js']
    },

    define: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    },

    server: {
      watch: {
        usePolling: true
      }
    },

    plugins: [tailwindcss()]
  }
});