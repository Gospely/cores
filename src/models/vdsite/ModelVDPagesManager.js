import React , {PropTypes} from 'react';
import dva from 'dva';

export default {
	namespace: 'vdpm',
	state: {
		currentActivePageListItem: 'sub1'
	},

	reducers: {

		setCurrentActivePageListItem(state, { payload: key }) {
			state.currentActivePageListItem = key;
			return {...state};
		},
	}

}