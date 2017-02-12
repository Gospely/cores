import React , {PropTypes} from 'react';
import dva from 'dva';

export default {
	namespace: 'vdCtrlTree',
	state: {
	    defaultExpandedKeys: ["123", '456', '789'],
	    defaultSelectedKeys: [""],

	    layout: {
	    	'index.html': [{
	    		className: ['body'],
	    		id: '',
	    		tag: 'body',
	    		vdid: '123',
	    		children: [{
	    			tag: 'div',
	    			className: ['nav'],
		    		vdid: '456',
	    			id: '',
	    			attr: [],
	    			children: [{
	    				tag: 'h1',
	    				className: [],
	    				vdid: '098',
	    				id: '',
	    				attr: []
	    			}]
	    		}, {
	    			tag: 'p',
	    			className: ['title'],
	    			vdid: '789',
	    			id: '',
	    			attr: []
	    		}]
	    	}]
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