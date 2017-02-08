import React , {PropTypes} from 'react';
import dva from 'dva';

export default {
	namespace: 'cpre',
	state: {
		fullscreen: true,
		loaded: false
	},

	reducers: {
		handleFullscreenSwitchChange (state, { payload: checked }) {
			return {...state, fullscreen: checked};
		},

		setLoaded(state) {
			state.loaded = true;
			return {...state};
		},

		setLoading(state) {
			state.loaded = false;
			return {...state};
		},
		initState(state, { payload: params }) {

			state.fullscreen = params.UIState.fullscreen;
			state.loaded = params.loaded;
			return {...state};
		}

	}

}
