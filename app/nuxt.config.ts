// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/colors.scss" as *;'
        }
      }
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:5555/',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, '')
        }
      }
    }
  },
  css: ['@/assets/global.scss'],
  modules: ['@vueuse/nuxt', '@element-plus/nuxt'],
  elementPlus: { /** Options */ },
  
})
