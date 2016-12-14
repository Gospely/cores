import dva from 'dva';

export default {
	namespace: 'layout',
	state: {
		current: 'single',
		columnsType: [{
			name: 'single',
			alias: '单栏布局'
		}, {
			name: 'vertical-dbl',
			alias: '垂直双栏布局'
		}, {
			name: 'horizontal-dbl',
			alias: '水平双栏布局'
		}, {
			name: 'grid',
			alias: '网格布局'
		}]
	},

	reducers: {
		handleClick (state, {payload: key}) {

			console.log(key);
			console.log("===========handleClick==============");
			return {...state, current: key};
		}
	}

}
