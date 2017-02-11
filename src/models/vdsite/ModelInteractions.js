import React , {PropTypes} from 'react';
import dva from 'dva';

export default {
	namespace: 'vdanimations',
	state: {
		
		interactionCreator: {
			modalCreator: {
				visible: false
			}
		}

	},

	reducers: {

		showInteractionCreator(state, { payload: fileList }) {
			state.interactionCreator.modalCreator.visible = true;
			return {...state};
		},

		hideInteractionCreator(state, { payload: fileList }) {
			state.interactionCreator.modalCreator.visible = false;
			return {...state};
		}
	}

}