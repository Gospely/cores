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
	    		ctrlName: 'body',
	    		children: [{
	    			tag: 'div',
	    			className: ['designer-wrapper', 'designer-header', 'vd-right-panel'],
		    		vdid: '456',
	    			id: '',
		    		ctrlName: 'div-block',
					attrs: [{
						basic: {
							title: '基础设置',
							children: [{
								name: 'id',
								desc: 'id',
								type: 'input',
								value: ''
							}: {
								name: 'class',
								desc: '可见屏幕',
								type: 'multipleSelect',
								value: '',
								children: [1, 2, 3, 4]
							}]
						}
					}],
	    			children: [{
	    				tag: 'h1',
	    				className: [],
	    				vdid: '098',
			    		ctrlName: 'heading',
	    				id: '',
						attrs: [{
							basic: {
								title: '基础设置',
								children: [{
									name: 'id',
									desc: 'id',
									type: 'input',
									value: ''
								}, {
									name: 'class',
									desc: '可见屏幕',
									type: 'multipleSelect',
									value: '',
									children: [1, 2, 3, 4]
								}]
							}
						}]
	    			}]
	    		}, {
	    			tag: 'p',
	    			className: ['ant-tabs-tab'],
		    		ctrlName: 'paragraph',
	    			vdid: '789',
	    			id: '',
					attrs: [{
						basic: {
							title: '基础设置',
							children: [{
								name: 'id',
								desc: 'id',
								type: 'input',
								value: ''
							}, {
								name: 'class',
								desc: '可见屏幕',
								type: 'multipleSelect',
								value: '',
								children: [1, 2, 3, 4]
							}]
						}
					}]
	    		}]
	    	}]
	    },

	    activeCtrl: {
			tag: 'div',
			className: ['designer-wrapper', 'designer-header', 'vd-right-panel'],
    		vdid: '456',
			id: '',
    		ctrlName: 'div-block',
			attrs: [{
				basic: {
					title: '基础设置',
					children: [{
						name: 'id',
						desc: 'id',
						type: 'input',
						value: ''
					}, {
						name: 'class',
						desc: '可见屏幕',
						type: 'multipleSelect',
						value: '',
						children: [1, 2, 3, 4]
					}]
				}
			}],
			children: [{
				tag: 'h1',
				className: [],
				vdid: '098',
	    		ctrlName: 'heading',
				id: '',
				attrs: [{
					basic: {
						title: '基础设置',
						children: [{
							name: 'id',
							desc: 'id',
							type: 'input',
							value: ''
						}, {
							name: 'class',
							desc: '可见屏幕',
							type: 'multipleSelect',
							value: '',
							children: [1, 2, 3, 4]
						}]
					}
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