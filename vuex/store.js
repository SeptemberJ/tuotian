import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		fuserno: ''
	},     
	mutations: {       
		updateUserInfo(state, fuserno) {
			state.fuserno = fuserno
		}
	}
})
export default store