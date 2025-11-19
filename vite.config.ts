import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    // Load environment variables from the root directory
    const {VITE_API_URL} = loadEnv(mode, process.cwd(), '');

    // Use the loaded variables in your config
    return {
        plugins: [vue(), tailwindcss()],
        base: '/vue-chat-ai-ui',
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
