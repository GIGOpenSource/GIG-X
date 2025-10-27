import { defineConfig, loadEnv } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import { VitePWA } from 'vite-plugin-pwa'
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd())
  return {
    plugins: [
      uni(),
      VitePWA({
        registerType: 'autoUpdate',
        devOptions: {  // 想在开发环境看效果就打开（会导致开发环境缓存，看不到效果）
          enabled: false
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
           maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MB
        },
        includeAssets: ['favicon.ico', 'logo.png'],
        manifest: {
          name: env.VITE_API_NAME,
          short_name: env.VITE_API_SHORT_NAME,
          description: env.VITE_API_DESCRIPTION,
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
      // 开发服务器配置
      host: '0.0.0.0', // 允许外部访问
      port: 3000, // 开发服务器端口
      // 代理配置解决跨域问题
      proxy: {
        // 代理所有以 /api 开头的请求
        '/api': {
          target: 'https://collide.mnvjdhsl.com', // 后端服务器地址，与config.js保持一致
          changeOrigin: true, // 是否更换源
          secure: false, // 如果目标服务器无 HTTPS，需关闭安全验证
          rewrite: (path) => path.replace(/^\/api/, '/api'), // 保留 /api 前缀
          // 配置请求头
          configure: (proxy, options) => {
            proxy.on('proxyReq', (proxyReq, req, res) => {
              // 添加跨域相关头部
              proxyReq.setHeader('Access-Control-Allow-Origin', '*');
              proxyReq.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
              proxyReq.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, token, is-dev');
            });
          }
        }
      }
    },
    resolve: {
      alias: {
        '@': '/src'
      }
    },
    esbuild: {
      drop: ['console', 'debugger'],
    },
  }
})
