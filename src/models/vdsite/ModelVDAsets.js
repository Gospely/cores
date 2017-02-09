import React , {PropTypes} from 'react';
import dva from 'dva';

export default {
	namespace: 'vdassets',
	state: {
	    previewVisible: false,
	    previewImage: '',
	    fileList: [{
	      	uid: -1,
	      	name: 'xxx.png',
	      	status: 'done',
	      	url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
	    }]
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