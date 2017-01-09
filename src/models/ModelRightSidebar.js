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

		setActiveMenu (state, {payload: name}) {
			state.activeMenu = name;
			return {...state};
		},

		handleTabChanged(state, {payload: name}) {
			state.activeMenu = name;
			return {...state};
		},
		initState(state, { payload: params }) {
			console.log('rightbar initState');
			console.log(params);
			state.activeMenu = params.UIState.activeMenu;
			return {...state};
		}

	}

}
