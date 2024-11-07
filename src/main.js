
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import navbar from './components/navbar.vue'
const app = createApp(App)

app.use(router)

app.mount('#app')
