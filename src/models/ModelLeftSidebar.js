import dva from 'dva';

export default {
	namespace: 'sidebar',
	state: {
		modalNewAppVisible: false
	},

	reducers: {

		'showModalNewApp'(state, {payload: id}) {
			return state.modalNewAppVisible = true;
		}

	}

}