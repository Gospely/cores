import dva from 'dva';

export default {
	namespace: 'layout',
	state: {
		current: 'single'
	},

	reducers: {
		handleClick (state, {payload: key}) {
			return {...state, current: key};
		}
	}

}