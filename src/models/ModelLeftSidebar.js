import dva from 'dva';

export default {
	namespace: 'sidebar',
	state: {
		modalNewAppVisible: false,
		modalSwitchAppVisible: false
	},

	reducers: {

		showModalNewApp(state) {
			console.log(state);
			return {...state, modalNewAppVisible: true};
		},

		hideModalNewApp(state) {
			return {...state, modalNewAppVisible: false};
		},

		createApp(state) {
			
		},

		showModalSwitchApp(state) {
			return {...state, modalSwitchAppVisible: true};
		},

		hideModalSwitchApp(state) {
			return {...state, modalSwitchAppVisible: false};
		},

		switchApp(state) {

		},

		selectApp(state) {

		}

	}

}