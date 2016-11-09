import dva from 'dva';

export default {
	namespace: 'sidebar',
	state: {
		modalNewAppVisible: false
	},

	reducers: {

		showModalNewApp(state) {
			console.log(state);
			return {...state, modalNewAppVisible: true};
		},

		hideModalNewApp(state) {
			return {...state, modalNewAppVisible: false};
		} 

	}

}