
import {
	createSSRApp
} from "vue";
import uviewPlus from 'uview-plus'
import App from "./App.vue";
import {
	createPinia
} from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
uni.$zp = {
	config: {
		'default-page-size': 20,
	}
}
export function createApp() {
	const app = createSSRApp(App);
	app.use(uviewPlus).use(pinia)
	return {
		app,
	};
}
