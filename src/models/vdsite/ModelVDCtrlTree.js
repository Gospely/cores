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
						title: '基础设置',
						key: 'basic',
						children: [{
							name: 'id',
							desc: 'id',
							type: 'input',
							value: '',
							id: '5443'
						}, {
							name: 'class',
							desc: '可见屏幕',
							type: 'multipleSelect',
							value: ['visible-lg-block', 'visible-md-block', 'visible-sm-block', 'visible-xs-block'],
							children: [{
								name: '大屏幕(桌面 (≥1200px))',
								value: 'visible-lg-block'
							}, {
								name: '中等屏幕(桌面 (≥992px))',
								value: 'visible-md-block'					
							}, {
								name: '小屏幕(平板 (≥768px))',
								value: 'visible-sm-block'
							}, {
								name: '超小屏幕(手机 (<768px))',
								value: 'visible-xs-block'
							}],
							id: ''
						}]
					}],
	    			children: [{
	    				tag: 'h1',
	    				className: [],
	    				vdid: '098',
			    		ctrlName: 'heading',
	    				id: '',
						attrs: [{
							title: '基础设置',
							key: 'basic',
							children: [{
								name: 'id',
								desc: 'id',
								type: 'input',
								value: '',
								id: '5443'
							}, {
								name: 'class',
								desc: '可见屏幕',
								type: 'multipleSelect',
								value: ['visible-lg-block', 'visible-md-block', 'visible-sm-block', 'visible-xs-block'],
								children: [{
									name: '大屏幕(桌面 (≥1200px))',
									value: 'visible-lg-block'
								}, {
									name: '中等屏幕(桌面 (≥992px))',
									value: 'visible-md-block'					
								}, {
									name: '小屏幕(平板 (≥768px))',
									value: 'visible-sm-block'
								}, {
									name: '超小屏幕(手机 (<768px))',
									value: 'visible-xs-block'
								}],
								id: ''
							}]
						}]
	    			}]
	    		}, {
	    			tag: 'p',
	    			className: ['ant-tabs-tab'],
		    		ctrlName: 'paragraph',
	    			vdid: '789',
	    			id: '',
					attrs: [{
						title: '基础设置',
						key: 'basic',
						children: [{
							name: 'id',
							desc: 'id',
							type: 'input',
							value: '',
							id: '5443'
						}, {
							name: 'class',
							desc: '可见屏幕',
							type: 'multipleSelect',
							value: ['visible-lg-block', 'visible-md-block', 'visible-sm-block', 'visible-xs-block'],
							children: [{
								name: '大屏幕(桌面 (≥1200px))',
								value: 'visible-lg-block'
							}, {
								name: '中等屏幕(桌面 (≥992px))',
								value: 'visible-md-block'					
							}, {
								name: '小屏幕(平板 (≥768px))',
								value: 'visible-sm-block'
							}, {
								name: '超小屏幕(手机 (<768px))',
								value: 'visible-xs-block'
							}],
							id: ''
						}]
					}]
	    		}]
	    	}],
	    },

	    activeCtrl: {
			tag: 'div',
			className: ['designer-wrapper', 'designer-header', 'vd-right-panel'],
    		vdid: '456',
			id: '',
    		ctrlName: 'div-block',
			attrs: [{
				title: '基础设置',
				key: 'basic',
				children: [{
					name: 'id',
					desc: 'id',
					type: 'input',
					value: '',
					id: '5443'
				}, {
					name: 'class',
					desc: '可见屏幕',
					type: 'multipleSelect',
					value: ['visible-lg-block', 'visible-md-block', 'visible-sm-block', 'visible-xs-block'],
					children: [{
						name: '大屏幕(桌面 (≥1200px))',
						value: 'visible-lg-block'
					}, {
						name: '中等屏幕(桌面 (≥992px))',
						value: 'visible-md-block'					
					}, {
						name: '小屏幕(平板 (≥768px))',
						value: 'visible-sm-block'
					}, {
						name: '超小屏幕(手机 (<768px))',
						value: 'visible-xs-block'
					}],
					id: ''
				}]
			}, {
				title: '自定义属性',
				key: 'custom-attr',
				children: []
			}],
			children: [{
				tag: 'h1',
				className: [],
				vdid: '098',
	    		ctrlName: 'heading',
				id: '',
				attrs: [{
					title: '基础设置',
					key: 'basic',
					children: [{
						name: 'id',
						desc: 'id',
						type: 'input',
						value: '',
						id: '5443'
					}, {
						name: 'class',
						desc: '可见屏幕',
						type: 'multipleSelect',
						value: ['visible-lg-block', 'visible-md-block', 'visible-sm-block', 'visible-xs-block'],
						children: [{
							name: '大屏幕(桌面 (≥1200px))',
							value: 'visible-lg-block'
						}, {
							name: '中等屏幕(桌面 (≥992px))',
							value: 'visible-md-block'					
						}, {
							name: '小屏幕(平板 (≥768px))',
							value: 'visible-sm-block'
						}, {
							name: '超小屏幕(手机 (<768px))',
							value: 'visible-xs-block'
						}],
						id: ''
					}]
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
		},

		generateCtrlTree(state, { payload: ctrl }) {
			console.log(ctrl);
			return {...state};	
		}		

	}

}