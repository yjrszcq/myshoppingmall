import '@/styles/common.scss'
import {createPinia} from "pinia";
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()
app.use(router)
app.use(pinia)
app.mount('#app')
app.use(ElementPlus)

pinia.use(piniaPluginPersistedstate)