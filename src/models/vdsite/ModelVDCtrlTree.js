import React , {PropTypes} from 'react';
import dva from 'dva';

export default {
	namespace: 'vdCtrlTree',
	state: {
	    defaultExpandedKeys: ["0-0"],
	    defaultSelectedKeys: ['0-0'],
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