import dva from 'dva';

export default {
	namespace: 'designer',
	state: {
		deviceList: [
			{
				name: 'iPhone',
				width: 200,
				heifht: 300
			},
			{
				name: 'iPad',
				width: 200,
				heifht: 300
			},
			{
				name: 'Android Phone',
				width: 200,
				heifht: 300
			},
			{
				name: 'Android Tablet',
				width: 200,
				heifht: 300
			}
		],

		defaultDevice: 0
	},

	subscriptions: {

	},

	effects: {

	},

	reducers: {

		handleDeviceSelected(state, { payload: key}) {
			state.defaultDevice = key;
			return {...state};
		}

	}

}