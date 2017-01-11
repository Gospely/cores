import dva from 'dva';

export default {
	namespace: 'dashboard',

	state: {
		visible: false
	},

	reducers: {

		hide(state) {
			state.visible = false;
			return {...state};
		},

		show(state) {
			state.visible = true;
			return {...state};
		}

	}
}
