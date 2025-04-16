import './assets/main.scss'

import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import store from './stores'
import i18n from "./core/plugins/i18n";

const app = createApp(App)

app.use(store)
app.use(router)
app.use(i18n).provide("$t", app.config.globalProperties.$t);

app.mount('#app')
