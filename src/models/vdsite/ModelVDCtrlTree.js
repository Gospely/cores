import React , {PropTypes} from 'react';
import dva from 'dva';
import randomString from '../../utils/randomString.js';

const VDTreeActions = {
	deepCopyObj(obj, result) {
		result = result || {};
		for(let key in obj) {
			if (typeof obj[key] === 'object') {
				result[key] = (obj[key].constructor === Array)? []: {};
				VDTreeActions.deepCopyObj(obj[key], result[key]);
			}else {
				result[key] = obj[key];
			}
		}
		return result;
	},

	getActiveCtrl(state) {
		return state.activeCtrl;
	},

	setActiveCtrl() {

	}
}

export default {
	namespace: 'vdCtrlTree',
	state: {
	    defaultExpandedKeys: ["body-main", '456', '789'],
	    defaultSelectedKeys: [""],

	    layout: {
	    	'index.html': [{
	    		className: ['body'],
	    		id: '',
	    		tag: 'body',
	    		vdid: 'body-main',
	    		ctrlName: 'body',
	    		children: []
	    	}],
	    },

	    activeCtrlIndex: 0,

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
					valueList: [{
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
				children: [{
					key: '123',
					value: '34'
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
						valueList: [{
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
			
			let controller = ctrl.details;

			const specialAttrList = ['custom-attr', 'link-setting', 'list-setting', 'heading-type', 'image-setting', 'select-setting'];

			let deepCopiedController = VDTreeActions.deepCopyObj(controller);

			const loopAttr = (controller) => {

				let childCtrl = {},
					tmpAttr = {},
					ctrl = {};

				tmpAttr = controller.attrs;
				for(let i = 0, len = tmpAttr.length; i < len; i ++) {
					var currentAttrWithHeader = tmpAttr[i];
					if(specialAttrList.indexOf(currentAttrWithHeader.key) != -1) {
						continue;
					}
					for (var j = 0; j < currentAttrWithHeader.children.length; j++) {
						var attr = currentAttrWithHeader.children[j];
						attr['id'] = randomString(8, 10);
					};
				}

				ctrl = {
					vdid: controller.key ? (controller.key + '-' + randomString(8, 10)) : randomString(8, 10),
					attrs: tmpAttr,
					tag: controller.tag,
					className: controller.className,
					customClassName: [],
					children: [],
					isRander: controller.isRander || '',
					ignore: controller.ignore || false
				};

				if(controller.children) {
					for (var i = 0; i < controller.children.length; i++) {
						var currentCtrl = controller.children[i];
						childCtrl = loopAttr(currentCtrl);
						ctrl.children.push(childCtrl);
					};
				}else {
					ctrl.children = undefined;
				}

				return ctrl;
			}

			let tmpCtrl = loopAttr(deepCopiedController);
			let activeCtrl = VDTreeActions.getActiveCtrl(state);

			VDDesignerFrame.postMessage({
    			ctrlTreeGenerated: {
    				controller: tmpCtrl,
    				activeCtrl
    			}
			}, '*');

			return {...state};	
		},

		handleElemAdded(state, { payload: params }) {
			state.layout[params.activePage][0].children.push(params.ctrl);
			state.activeCtrl = params.ctrl;
			state.activeCtrlIndex = state.layout[params.activePage][0].children.length - 1;
			return {...state};
		},

		ctrlSelected(state, { payload: data }) {
			state.activeCtrl = data;
			state.activeCtrlIndex = 0;
			return {...state};
		},

		handleAttrFormChangeA(state, { payload: params }) {
			var currentActiveCtrl = state.layout[params.activePage][0].children[state.activeCtrlIndex];
  			var ctrlAttrs = currentActiveCtrl.attrs;

  			for (var i = 0; i < ctrlAttrs.length; i++) {
  				for (var j = 0; j < ctrlAttrs[i].children.length; j++) {
  					var attr = ctrlAttrs[i].children[j];
  					var flag = false;
	  				if(attr.name == params.attrName) {
	  					attr.value = params.newVal;
	  					flag = true;
	  					break;
	  				}
	  				if(flag) {
	  					break;
	  				}
  				};
  			};

			return {...state};
		},

		handleAttrRefreshed(state, { payload: params }) {
			window.VDDesignerFrame.postMessage({
				VDAttrRefreshed: params
			}, '*');
			return {...state};
		},

		handleCustomAttrRemoved(state, { payload: params }) {
			var attrName = state.activeCtrl.attrs[params.attrTypeIndex].children[params.index].key;
			state.activeCtrl.attrs[params.attrTypeIndex].children.splice(params.index, 1);
			window.VDDesignerFrame.postMessage({
				VDAttrRefreshed: {
					activeCtrl: state.activeCtrl,
					attr: {
						attrName: attrName,
						action: 'remove'
					},
					attrType: params.attrType
				}
			}, '*');
			return {...state};
		},

		handleCustomAttrInputChange(state, { payload: params }) {

			state.activeCtrl.attrs[params.attrTypeIndex].children[params.customAttrIndex][params.attrName] = params.value

			window.VDDesignerFrame.postMessage({
				VDAttrRefreshed: {
					activeCtrl: state.activeCtrl,
					attr: {
						value: params.value,
						index: params.index,
						attrName: params.attrName,
						attrTypeIndex: params.attrTypeIndex,
						action: 'modify'
					},
					attrType: params.attrType
				}
			}, '*');

			return {...state};
		},

		saveCustomAttr(state, { payload: params }) {

			state.activeCtrl.attrs[params.attrTypeIndex].children.push({
				key: params.key,
				value: params.value
			});

			window.VDDesignerFrame.postMessage({
				VDAttrRefreshed: {
					activeCtrl: state.activeCtrl,
					attr: {
						value: {
							key: params.key,
							value: params.value
						},
						action: 'add'
					},
					attrType: params.attrType
				}
			}, '*');

			return {...state};
		},

		modifyCustomAttr(state, { payload: params }) {

			return {...state};
		}

	},

	effects: {

		*handleAttrFormChange({payload: params}, {call, put, select}) {
  			var activePage = yield select(state => state.vdpm.activePage);

  			yield put({
  				type: 'handleAttrFormChangeA',
  				payload: {
  					newVal: params.newVal,
  					attrName: params.attrName,
  					activePage: activePage
  				}
  			})

		}

	}

}