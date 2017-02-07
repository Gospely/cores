import React , {PropTypes} from 'react';
import dva from 'dva';

export default {
	namespace: 'index',
	state: {

		debugType: localStorage.debugType || 'common'

	},

	reducers: {

		changeDebugType(state, { payload: type }) {
			state.debugType = type;
			return {...state};
		},

		toggleCommonPreviewer(state) {
			if(state.debugType == 'previewer') {
				state.debugType = 'noPreviewer';
			}else {
				state.debugType = 'previewer';
			}
			return {...state};
		}

	}

}