import dva from 'dva';

export default {
	namespace: 'products',
	state: [],

	reducers: {

		'delete'(state, {payload: id}) {

			console.log(state, id);

			return state.filter(item => item.id !== id);
		}

	}

}