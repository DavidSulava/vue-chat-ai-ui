import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const {VITE_API_URL} = loadEnv(mode, process.cwd(), '');
    const isDev = mode === 'development';

    return {
        plugins: [vue(), tailwindcss()],
        base: isDev? '/' : '/vue-chat-ai-ui/',
        resolve: {
            alias: {
                '@': resolve(__dirname, 'src'),
                '#root': resolve(__dirname),
            }
        },
        server: {
            proxy: {
                '/api': {
                    target: VITE_API_URL,
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api/, ''),
                },
            }
        }
    };
});
