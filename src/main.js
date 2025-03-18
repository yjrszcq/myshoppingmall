import '@/styles/common.scss'
import {createPinia} from "pinia";
import router from './router'

import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)
app.use(router)
app.use(createPinia())
app.mount('#app')
