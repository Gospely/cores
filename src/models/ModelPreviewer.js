import dva from 'dva';
export default {
	namespace: 'previewer',
	state: {
		siteValue: ''
	},

	subscriptions: {

	},

	effects: {

	},

	reducers: {
		handleInputChange(state,{payload: val}) {
			return {...state, siteValue: val};
		}
	}
}