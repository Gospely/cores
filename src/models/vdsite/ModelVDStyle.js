import React , {PropTypes} from 'react';
import dva from 'dva';

export default {
	namespace: 'vdstyles',
	state: {

		stylesList: [],

		
	},

	reducers: {

		setCurrentActivePageListItem(state, { payload: key }) {
			state.currentActivePageListItem = key;
			return {...state};
		}

	}

}