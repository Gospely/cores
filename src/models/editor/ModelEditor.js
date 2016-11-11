import dva from 'dva';

export default {
	namespace: 'editor',
	state: {
		showArrow: true
	},

	reducers: {

		showArrow(state) {
			return {...state, showArrow: true};
		},

		hideArrow(state) {
			return {...state, showArrow: false};
		}

	}

}