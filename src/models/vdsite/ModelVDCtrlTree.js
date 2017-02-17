import React , {PropTypes} from 'react';
import dva from 'dva';
import randomString from '../../utils/randomString.js';
import { message } from 'antd';

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

	getCtrlByKey(state, key, activePage) {
		let obj = {
				index: 0,
				level: 1
			},

			controllers = state.layout[activePage.key];

		const loopControllers = function (controllers, level) {
			level = level || 1;
			for(let i = 0; i < controllers.length; i ++) {
				let currentControl = controllers[i];
				if (currentControl.children) {
					loopControllers(currentControl.children, level ++);
				}
				if (currentControl.vdid == key) {
					obj.index = i;
					obj.level = level;
					obj.controller = currentControl;
					break;
				}
			}
			return obj;
		}

		return loopControllers(controllers, 1);
	},
	checkIsChangeTag(controllers) {

		var bool = false;

		for (var i = 0; i < controllers.length; i++) {

			for (var j = 0; j < controllers[i].content.length; j++) {

				for (var k = 0; k < controllers[i].content[j].details.attrs[0].children.length; k++) {
					console.log(controllers[i].content[j].details.attrs[0].children[k]);
					if(controllers[i].content[j].details.attrs[0].children[k].name == 'tag'){
						bool = true;
					}
				}
			}
		}
		return true;
	},

	getActiveControllerIndexAndLvlByKey(state, key, activePage) {
		let obj = {
			index: '',
			level: 1
		};
		let controllers = state.layout[activePage.key];
		const loopControllers = function (controllers, level) {
			level = level || 1;
			console.log(controllers);
			for(let i = 0; i < controllers.length; i ++) {
				let currentControl = controllers[i];
				if (currentControl.children) {
					loopControllers(currentControl.children, level ++);
				}
				if (currentControl.vdid == key) {
					obj.index = i;
					obj.level = level;
					break;
				}
			}
			return obj;
		}
		return loopControllers(controllers, 1);

	},

	setActiveCtrl(state, controllerIndex, controllerKey, level) {
	},

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

	    layoutState: {

	    	activeController: {
	    		index: 0,
	    		key: '',
	    		level: 3
	    	}
	    },

	    activeCtrlIndex: 0,
	    activeCtrlLvl: 1,

    	activePage: {
    		key: 'index.html'
    	},

	    activeCtrl: {
			tag: 'div',
			className: [],
			customClassName: [],
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
					console.log(tmpAttr[i]);
					if(specialAttrList.indexOf(tmpAttr[i].key) != -1) {
						continue;
					}
					for (var j = 0; j < tmpAttr[i].children.length; j++) {
						var attr = tmpAttr[i].children[j];
						attr['id'] = randomString(8, 10);
					};
				}

				ctrl = {
					vdid: controller.key ? (controller.key + '-' + randomString(8, 10)) : randomString(8, 10),
					attrs: tmpAttr,
					tag: controller.tag,
					className: controller.className,
					customClassName: [],
					activeStyle: '',
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
			var ctrlInfo = VDTreeActions.getActiveControllerIndexAndLvlByKey(state, params.ctrl.vdid, state.activePage);
			state.activeCtrlIndex = ctrlInfo.index;
			state.activeCtrlLvl = ctrlInfo.level;
			return {...state};
		},

		ctrlSelected(state, { payload: data }) {

			var ctrlInfo = VDTreeActions.getActiveControllerIndexAndLvlByKey(state, data.vdid, state.activePage);
			state.activeCtrl = data;
			state.activeCtrlIndex = ctrlInfo.index;
			state.activeCtrlLvl = ctrlInfo.level;
			return {...state};
		},
		handleAttrFormChangeA(state, { payload: params }) {

			console.log(params);
			console.log(state.activeCtrl);
			var currentActiveCtrl = VDTreeActions.getCtrlByKey(state, state.activeCtrl.vdid, state.activePage);
  			var ctrlAttrs = currentActiveCtrl.controller.attrs;

  			console.log(currentActiveCtrl, params);

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

  			state.activeCtrl = currentActiveCtrl.controller;
			return {...state};
		},

		handleAttrRefreshed(state, { payload: params }) {

			//判断是否需要切换标签
			if(params.attrType.isChangeTag && params.attr.name == 'tag'){
				console.log('changeTag');
				var currentActiveCtrl = VDTreeActions.getCtrlByKey(state, state.activeCtrl.vdid, state.activePage);
				currentActiveCtrl.controller.attrs.tag = params.attr.value;
				state.activeCtrl = currentActiveCtrl.controller;
				params.activeCtrl.tag = params.attr.value;
			}
			console.log(state.activeCtrl);
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
			console.log(params);
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
		},

		handleImageSettingBeforeUpload(state, { payload: params }) {
			params = params.splice(0, params.length);
			return {...state};
		},

		setActiveStyle(state, { payload: activeStyle }) {
			var currentActiveCtrl = VDTreeActions.getCtrlByKey(state, state.activeCtrl.vdid, state.activePage);
			currentActiveCtrl.controller.activeStyle = activeStyle;
			state.activeCtrl = currentActiveCtrl.controller;
			return {...state};
		},

		changeCustomClass(state, { payload: params }) {
			var currentActiveCtrl = VDTreeActions.getCtrlByKey(state, state.activeCtrl.vdid, state.activePage);

			if(!currentActiveCtrl.controller) {
				message.error('请先添加控件再进行操作哦！');
				return {...state};
			}

			var className = '';

			if(params.push) {
				currentActiveCtrl.controller.customClassName.push(params.value[0]);
				currentActiveCtrl.controller.activeStyle = params.value[params.value.length - 1];
				className = params.value[0];
			}else {
				currentActiveCtrl.controller.customClassName = params.value;
				currentActiveCtrl.controller.activeStyle  = params.value[params.value.length - 1];
				className = params.value;
			}

			console.log(currentActiveCtrl.controller.activeStyle);

			state.activeCtrl = currentActiveCtrl.controller;

			window.VDDesignerFrame.postMessage({
				VDAttrRefreshed: {
					activeCtrl: state.activeCtrl,
					attr: {
						attrName: 'class',
						action: 'remove',
						value: className
					},
					attrType: {
						key: 'className'
					}
				}
			}, '*');

			return {...state};
		}

	},

	effects: {

		*handleAttrFormChange({payload: params}, {call, put, select}) {

			console.log(params);
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
