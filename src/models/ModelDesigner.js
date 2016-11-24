import dva from 'dva';

export default {
	namespace: 'designer',
	state: {
		deviceList: [
			{
				name: 'iPhone',
				width: 375,
				height: 667
			},
			{
				name: 'iPad',
				width: 200,
				heifht: 300
			},
			{
				name: 'Android Phone',
				width: 245,
				heifht: 456
			},
			{
				name: 'Android Tablet',
				width: 456,
				heifht: 367
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