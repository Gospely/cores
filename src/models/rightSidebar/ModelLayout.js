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

	subscriptions: {
		setup({ dispatch, history }) {
	      	history.listen(({ pathname }) => {
          		dispatch({
            		type: 'changeColumnsType'
          		});
	      	});
		}
	},

	reducers: {
		handleClick (state, {payload: key}) {
			console.log('handleClick');
			console.log(key);
			return {...state, current: key};
		},

		changeColumnsType (state) {
			if(window.GospelDesignerPreviewer) {
				state.columnsType = [{
					name: 'single',
					alias: '单栏布局'
				}, {
					name: 'vertical-dbl',
					alias: '垂直双栏布局'
				}]
			}

			return {...state};
		}
	}

}
