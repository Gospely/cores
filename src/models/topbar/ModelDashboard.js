import dva from 'dva';

export default {
	namespace: 'dashboard',
	
	state: {
		visible: true
	},

	reducers: {

		hide(state) {
			state.visible = false;
			return {...state};
		}

	}
}
