import dva from 'dva';
import request from '../utils/request.js';

export default {
	namespace: 'rightbar',
	state: {
		activeMenu: 'file'
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
		}

	}

}
