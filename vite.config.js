import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

import {  VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uni(),
    VitePWA({
			registerType: 'autoUpdate',
      devOptions:{  // 想在开发环境看效果就打开
        enabled: true
      },
			workbox: {
				globPatterns: ['**/*.{js,css,html,ico,png,svg}']
			},
			includeAssets: ['favicon.ico', 'logo.png'],
			manifest: {
				name: 'X',
				short_name: 'x',
				description: 'A short-video app',
				theme_color: '#ffffff',
				icons: [{
						src: '/static/icon/pwa-192x192.png',
						sizes: '192x192',
						type: 'image/png'
					},
					{
						src: '/static/icon/pwa-512x512.png',
						sizes: '512x512',
						type: 'image/png'
					}
				]
			}
		})
  ],
  css: {
    preprocessorOptions: {
      scss: {
        // 取消sass废弃API的报警
        silenceDeprecations: ['legacy-js-api', 'color-functions', 'import'],
      },
    },
  },
  server: {
    port: 8080
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
