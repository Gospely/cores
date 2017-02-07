import React , {PropTypes} from 'react';
import dva from 'dva';

export default {
	namespace: 'cpre',
	state: {
		fullscreen: true
	},

	reducers: {
		handleFullscreenSwitchChange (state, { payload: checked }) {
			return {...state, fullscreen: checked};
		}
	}

}
