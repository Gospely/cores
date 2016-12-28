import dva from 'dva';
import request from '../utils/request.js';

export default {
	namespace: 'rightbar',
	state: {
		activeMenu: localStorage.activeMenu || 'setting'
	},

	subscriptions: {
		setup({ dispatch, history }) {

		}
	},

	effects: {


	},

	reducers: {

		initState(state, { payload: params }) {
			state.activeMenu = params.UIState.activeMenu;
			return {...state};
		}

	}

}
