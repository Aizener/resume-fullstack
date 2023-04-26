import { createApp } from 'vue';
import 'normalize.css/normalize.css';
import './style.scss';
import App from './App.vue';
import 'element-plus/dist/index.css';
import router from '@/router';
import 'element-plus/es/components/message/style/css';
import 'element-plus/es/components/message-box/style/css';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { useGlobalDirectives } from './directives';

const app = createApp(App);

app
  .use(createPinia().use(piniaPluginPersistedstate))
  .use(router)
  .use(useGlobalDirectives)
  .mount('#app');
