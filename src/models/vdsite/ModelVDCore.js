import React , {PropTypes} from 'react';
import dva from 'dva';

export default {
	namespace: 'vdcore',
	state: {
		customAttr: {
			visible: false
		}
	},

	reducers: {

		handlePreview(state, { payload: params }) {
			state.previewImage = params.previewImage;
			state.previewVisible = params.previewVisible;
			return {...state};
		},

		handleChange(state, { payload: fileList }) {
			state.fileList = fileList;
			return {...state};
		},

		handleCancel(state) {
			state.previewVisible = false;
			return {...state};
		}		

	}

}