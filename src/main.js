import {
	createSSRApp
} from "vue";
import uviewPlus from 'uview-plus'
import App from "./App.vue";
import {
	createPinia
} from 'pinia'
import piniaPluginPersist from 'pinia-plugin-persist'
const pinia = createPinia()
pinia.use(piniaPluginPersist)
uni.$zp = {
	config: {
		//配置分页默认pageSize为15
		'default-page-size': 20,
		//...
	}
}
export function createApp() {
	const app = createSSRApp(App);
	app.use(uviewPlus).use(pinia)
	return {
		app,
	};
}
