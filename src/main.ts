import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedState from 'pinia-plugin-persistedstate'
import router from '@/router'
import i18n from '@/i18n'
import '@/style.css'
import App from '@/App.vue'

const pinia = createPinia()
pinia.use(piniaPluginPersistedState)

const app = createApp(App)
app.use(router)
app.use(pinia)
app.use(i18n)
app.mount('#app')
