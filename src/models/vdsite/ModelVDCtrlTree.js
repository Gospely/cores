import React , {PropTypes} from 'react';
import dva from 'dva';
import randomString from '../../utils/randomString.js';
import { message } from 'antd';

const methods = {
	checkName(symbols, name){

		for (var i = 0; i < symbols.length; i++) {
			if(symbols[i].name == name){
				return false;
			}
		}
		return true;
	},
	getSymbolIndexByKey(symbols, key){

		for (var i = 0; i < symbols.length; i++) {
			if(symbols[i].key == key){
				return i;
			}
		}
		return undefined;
	}
}
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
	getParentCtrlByKey(state, key, activePage) {
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
	getActiveControllerIndexAndLvlByKey(state, key, activePage) {
		let obj = {
			index: '',
			level: 1
		};
		let controllers = state.layout[activePage.key];
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
		symbols: [],
		currentSymbolKey: '',
		symbolName: '',
		popoverVisible: false,
		editPopoverVisible: false,
		keyValeUpdateVisible: false,
		keyValeCreateVisible: false,
		selectIndex: 1,
		attr: {
			html: '',
			value: ''
		},
		childrenCopy: '',
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

    	constructionMenuStyle: {
		    position: 'fixed',
		    top: '',
		    left: '',
		    display: 'none'
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

		showCtrlTreeContextMenu(state, { payload: proxy }) {
			return {...state, constructionMenuStyle: {
				position: 'fixed',
				display: 'block',
				left: proxy.event.pageX / 1.8,
				top: proxy.event.pageY - 30,
			}};
		},

		hideCtrlTreeContextMenu(state) {
			return {...state, constructionMenuStyle: {
				position: 'fixed',
				display: 'none',
				left: 0,
				top: 0,
			}};
		},

		handleCurrentSymbolKey(state, { payload: key}) {
			state.currentSymbolKey = key;
			return { ...state};
		},
		handleSymbolNameChange(state, { payload: value}) {
			state.symbolName = value;
			return { ...state};
		},
		handleAddSymbol(state) {

			if(!methods.checkName(state.symbols, state.symbolName)){
				 openNotificationWithIcon('info', '控件名已被占用');
			}else{
				var addController = {
					name: localStorage.symbolName,
					key: randomString(8, 10),
					controllers: [state.activeCtrl]
				}
				state.popoverVisible = false;
				state.symbolName = '';
				state.symbols.push(addController);
			}
			return { ...state};
		},
		handlePopoverVisbile(state, { payload: value}) {

			state.popoverVisible = value;
			return { ...state};
		},
		handleEditPopoverVisbile(state, { payload: value}) {

			state.editPopoverVisible = value;
			return { ...state};
		},
        handleUpdateVisible(state, { payload: value}){

            state.keyValeUpdateVisible = value;
			return { ...state};
        },
        handleCreateVisible(state, { payload: value}){

            state.keyValeCreateVisible = value;
			state.attr.html = '';
			state.attr.value = '';
			return { ...state};
        },
		editSymbol(state){

			if(!methods.checkName(state.symbols, state.symbolName)){
				 openNotificationWithIcon('info', '控件名已被占用');
			}else{
				var index = methods.getSymbolIndexByKey(state.symbols, state.currentSymbolKey);

				if(index == undefined){
					openNotificationWithIcon('error', '修改错误,请重试');
				}else {
					state.symbols[index].name = state.symbolName;
				}
			}
			state.symbolName = '';
			state.currentSymbolKey = '';
			state.editPopoverVisible = false;
			return { ...state};
		},
		deleteSymbol(state, { payload: key}){
			var index = methods.getSymbolIndexByKey(state.symbols, key);
			if(index == undefined){
				openNotificationWithIcon('error', '删除失败,请重试');
			}else {
				state.symbols.splice(index,1);
			}
			return {...state};
		},
		handleSelectIndex(state, { payload: index}){

			state.selectIndex = index;
			return { ...state};
		},
		handleChildrenAttrChange(state, { payload: params}){
			var currentActiveCtrl = VDTreeActions.getCtrlByKey(state, state.activeCtrl.vdid, state.activePage);
			if(params.attr.isTab){
				currentActiveCtrl.controller.children[0].children[state.selectIndex].children[0].attrs[0].children[0][params.attr.name] = params.attr.value;
			}else{
				currentActiveCtrl.controller.children[state.selectIndex].attrs[0].children[0][params.attr.name] = params.attr.value;
			}
			state.activeCtrl = currentActiveCtrl.controller;
			return { ...state};
		},
		handleAddChildrenAttr(state, { payload: params}){
			state.attr[params.name] = params.value
			return {...state};
		},
		//当前活跃控件子删除
		handleChildrenDelete(state, {payload: params}){

			var currentActiveCtrl = VDTreeActions.getCtrlByKey(state, state.activeCtrl.vdid, state.activePage);
			var children =  params.children;
			var parentCtrl = currentActiveCtrl.controller;

			var i = 0;
			function childrenDeleteBylevel(parent){
				i++;
				if(i < params.level) {
					childrenDeleteBylevel(parent.children[0]);
				}else {
					parent.children.splice(params.index,1);
					if(parent.children == null ||parent.children == undefined){
						parent.children = [];
					}
				}
			}
			childrenDeleteBylevel(parentCtrl)
			state.activeCtrl = currentActiveCtrl.controller;
			window.VDDesignerFrame.postMessage({
				VDChildrenDelete: {
					activeCtrl: children,
					attrType: params.attrType
				}
			}, '*');
			return {...state};
		},
		handleComplextChildrenDelete(state, {payload: params}){

			var currentActiveCtrl,
				target;
				console.log(params);
			const deleteChildrenByType = {
				'navbar-drop-down' (){
					target = state.activeCtrl.parent;
					var parent = VDTreeActions.getCtrlByKey(state, state.activeCtrl.parent, state.activePage).controller.parent;
					currentActiveCtrl = VDTreeActions.getCtrlByKey(state, parent, state.activePage);
					state.activeCtrl = currentActiveCtrl.controller;
				},
				'slider-delete' () {
					target = params.target,
					currentActiveCtrl = VDTreeActions.getCtrlByKey(state, params.parent, state.activePage);
					var root =  VDTreeActions.getCtrlByKey(state, currentActiveCtrl.controller.root, state.activePage).controller;

					window.VDDesignerFrame.postMessage({
						VDChildrenDelete: {
							activeCtrl: {
								vdid: root.children[0].children[params.index].vdid
							},
							attrType: params.attrType
						}
					}, '*');
					root.children[0].children.splice(params.index, 1);
					state.selectIndex = 0;
				}
			}
			deleteChildrenByType[params.type]();

			for (var i = 0; i < currentActiveCtrl.controller.children.length; i++) {

				if(currentActiveCtrl.controller.children[i].vdid == target){
					currentActiveCtrl.controller.children.splice(i,1);
				}
			}
			state.activeCtrl =  VDTreeActions.getCtrlByKey(state, state.activeCtrl.vdid, state.activePage).controller;
			window.VDDesignerFrame.postMessage({
				VDChildrenDelete: {
					activeCtrl: {
						vdid: target
					},
					attrType: params.attrType
				}
			}, '*');
			return {...state};
		},
		handleComplexChildrenAdd(state, { payload: params}){

			var currentActiveCtrl = VDTreeActions.getCtrlByKey(state, state.activeCtrl.parent, state.activePage);
			const addChildrenByType = {

				'navbar-drop-down'(){
					var parent = currentActiveCtrl.controller.children[1];
					params.children.parent = parent.vdid;
					if(parent.children) {
						parent.children.push(params.children);
					}else {
						var chidren = new Array();
						chidren.push(params.children);
						parent.children = children;
					}
					return parent;
				}
			}
			addChildrenByType[params.type]();

			window.VDDesignerFrame.postMessage({
				VDAttrRefreshed: {
					activeCtrl: state.activeCtrl,
					attr: {
						attrName: 'children',
						action: 'add',
						children: params.children,
						parent: params.children.parent
					},
					attrType: params.attrType
				}
			}, '*');
			return {...state};
		},
		//当前活跃控件 添加一个子控件
		handleChildrenAdd(state, {payload: params}){

			if(params.children.tag == 'option'){
				params.children.attrs[0].children[0].html = state.attr.html;
				params.children.attrs[0].children[0].value = state.attr.value;
			}

			params.children.root = state.activeCtrl.root;
			var currentActiveCtrl = VDTreeActions.getCtrlByKey(state, state.activeCtrl.vdid, state.activePage);
			var parentCtrl = currentActiveCtrl.controller;
			var parentCtrlVdid;
			var i = 0;
			function childrenAddBylevel(parent){
				let parentIndex = 0;
				for (var j = 0; j < params.levelsInfo.length; j++) {
					if(i == params.levelsInfo[j].level){
						parentIndex = params.levelsInfo[j].index;
					}
				}
				i++;
				if(i < params.level) {
					childrenAddBylevel(parent.children[parentIndex]);
				}else {
					parentCtrlVdid = parent.vdid;
					params.children.parent = parentCtrlVdid;
					console.log('parent');
					console.log(parentCtrlVdid);
					if(parent.children) {
						parent.children.push(params.children);
					}else {
						var chidren = new Array();
						chidren.push(params.children);
						parent.children = children;
					}
				}
			}
			childrenAddBylevel(parentCtrl);

			state.activeCtrl = currentActiveCtrl.controller;
			state.keyValeCreateVisible = false;
			window.VDDesignerFrame.postMessage({
				VDAttrRefreshed: {
					activeCtrl: state.activeCtrl,
					attr: {
						attrName: 'children',
						action: 'add',
						children: params.children,
						parent: parentCtrlVdid
					},
					attrType: params.attrType
				}
			}, '*');
			return {...state};
		},
		//当前活跃控件子控件更新
		handleChildrenUpdate(state, {payload: params}){
			state.keyValeUpdateVisible = false;
			window.VDDesignerFrame.postMessage({
				VDAttrRefreshed: {
					activeCtrl: state.activeCtrl,
					attr: {
						attrName: 'children',
						action: 'update'
					},
					attrType: params.attrType
				}
			}, '*');
			return {...state};
		},
		//修改控件的Class
		handleClassNameChange(state, { payload: params}){

			let currentActiveCtrl = VDTreeActions.getCtrlByKey(state, state.activeCtrl.vdid, state.activePage),
			i = 0,
			target;

			function changeClassNameByLevel(parent){

				let parentIndex = 0;
				for (var j = 0; j < params.levelsInfo.length; j++) {
					if(i == params.levelsInfo[j].level){
						parentIndex = params.levelsInfo[j].index;
					}
				}
				i++;
				if(i < params.level) {
					changeClassNameByLevel(parent.children[parentIndex]);
				}else {
					target = parent.children[parentIndex]
				}
			}
			changeClassNameByLevel(currentActiveCtrl.controller);
			console.log(target);
			for (var k = 0; k < target.className.length; k++) {
				if(target.className[k] == params.remove){
					target.className.splice(k,1,params.replacement)
				}
			}
			window.VDDesignerFrame.postMessage({
				VDAttrRefreshed: {
					activeCtrl: state.activeCtrl,
					attr: {
						action: 'replaceClass',
						attrName: 'classOperate',
						remove: params.remove,
						replacement: params.replacement,
						target: target,
					},
					attrType: params.attrType
				}
			}, '*');
			return {...state};
		},
		//更改当前活跃ctrl
		handleChangeCurrentCtrl(state, { payload: params}){

			var parent =  VDTreeActions.getCtrlByKey(state, state.activeCtrl.parent, state.activePage);
			console.log(parent);

			if(params.toDropDown){
				params.parent = parent.controller.parent,
				params.replacement.vdid = parent.controller.vdid;
				params.replacement.children[0].parent = parent.controller.vdid;
				parent.controller = params.replacement;
				state.activeCtrl = params.replacement.children[0];
				window.VDDesignerFrame.postMessage({
					VDAttrRefreshed: {
						activeCtrl: params.replacement,
						attr: {
							attrName: 'children',
							action: 'update'
						},
					}
				}, '*');
			}else {
				parent.controller.children.splice(0,1, params.replacement);
				state.activeCtrl = params.replacement;
				window.VDDesignerFrame.postMessage({
					VDAttrRefreshed: {
						activeCtrl: state.activeCtrl,
						attr: {
							attrName: 'replaceElem',
							parent: parent.controller.vdid
						},
					}
				}, '*');
			}

			return {...state};
		},
		handleActive(state, { payload: params }){

			//根据level获取要更改节点的父节点的数据结构
			console.log(params);
			var currentActiveCtrl = VDTreeActions.getCtrlByKey(state, state.activeCtrl.vdid, state.activePage),
			i = 0,
			target;

			function findParent(parent){

				let parentIndex = 0;
				for (var j = 0; j < params.levelsInfo.length; j++) {
					if(i == params.levelsInfo[j].level){
						parentIndex = params.levelsInfo[j].index;
					}
				}
				i++;
				if(i < params.level) {
					console.log(parentIndex);
					findParent(parent.children[parentIndex]);
				}else {


					console.log('change');
					console.log(parent);
					//切换active
					for (var j = 0; j < parent.children.length; j++) {
						for (var k = 0; k < parent.children[j].className.length; k++) {
							console.log('active');
							console.log(k);
							console.log(parent.children[j].className[k]);
							if(parent.children[j].className[k] == 'active'){
								parent.children[j].className.splice(k,1);
								if(params.action == 'next'){
									if(k + 1 == parent.children.length){
										params.index = 0;
									}else {
										params.index = k + 1;
									}
								}
								if(params.action == 'last'){
									if(k == 0){
										params.index = 0;
									}else {
										params.index = parent.children.length -1;
									}
								}
								break;
							}
						}
					}
					console.log('index');
					console.log(params.index);
					target = parent.children[params.index];
					target.className.push('active');
					console.log(parent);
				}
			}
			findParent(currentActiveCtrl.controller);
			state.activeCtrl = currentActiveCtrl.controller;
			state.selectIndex = params.index;
			window.VDDesignerFrame.postMessage({
				VDAttrRefreshed: {
					activeCtrl: target,
					attr: {
						attrName: 'children',
						action: 'changeActive',
						index: params.index,
						parent: target.parent
					},
				}
			}, '*');
			console.log(target);
			return {...state};
		},
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
			deepCopiedController.vdid = deepCopiedController.key ? (deepCopiedController.key + '-' + randomString(8, 10)) : randomString(8, 10);
			let root = deepCopiedController.vdid;

			const loopAttr = (controller, parent) => {

				let childCtrl = {},
					tmpAttr = {},
					ctrl = {};

				tmpAttr = controller.attrs;
				for(let i = 0, len = tmpAttr.length; i < len; i ++) {
					if(specialAttrList.indexOf(tmpAttr[i].key) != -1) {
						continue;
					}
					for (var j = 0; j < tmpAttr[i].children.length; j++) {
						var attr = tmpAttr[i].children[j];
						attr['id'] = randomString(8, 10);
					};
				}
				if(controller.vdid == parent.vdid){
					ctrl = {
						vdid: root,
						attrs: tmpAttr,
						tag: controller.tag,
						className: controller.className,
						customClassName: [],
						activeStyle: '',
						children: [],
						isRander: controller.isRander || '',
						ignore: controller.ignore || false,
						root: root || '',
						isRoot: true,
						unActive: controller.unActive,
						isBeforeHTMLValue: controller.isBeforeHTMLValue || false
					};
				}else{
					ctrl = {
						vdid: controller.key ? (controller.key + '-' + randomString(8, 10)) : randomString(8, 10),
						attrs: tmpAttr,
						tag: controller.tag,
						className: controller.className,
						customClassName: [],
						activeStyle: '',
						children: [],
						isRander: controller.isRander || '',
						ignore: controller.ignore || false,
						root: root || '',
						parent: parent.vdid,
						unActive: controller.unActive,
						isBeforeHTMLValue: controller.isBeforeHTMLValue || false
					};
				}

				if(controller.children) {
					for (var i = 0; i < controller.children.length; i++) {
						var currentCtrl = controller.children[i];
						childCtrl = loopAttr(currentCtrl, ctrl);
						ctrl.children.push(childCtrl);
					};
				}else {
					ctrl.children = undefined;
				}

				state.defaultSelectedKeys = [ctrl.vdid];

				return ctrl;
			}

			let tmpCtrl = loopAttr(deepCopiedController, deepCopiedController);
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

		setActivePage(state, { payload: params }) {
			state.activePage.key = params.activePage.key;

	    	window.VDDesignerFrame.postMessage({
	    		pageSelected: state.layout[params.activePage.key][0].children
	    	}, '*');
			return {...state};
		},

		setActiveCtrlInTree(state, { payload: params }) {
			state.defaultSelectedKeys = params;
			return {...state};
		},

		ctrlSelected(state, { payload: data }) {
			console.log('select');
			console.log(data);
			if(data.unActive){
				var currentActiveCtrl = VDTreeActions.getCtrlByKey(state, data.root, state.activePage);
				state.activeCtrl = currentActiveCtrl.controller;
			}else {
				state.activeCtrl = data;
			}
			var ctrlInfo = VDTreeActions.getActiveControllerIndexAndLvlByKey(state, state.activeCtrl.vdid, state.activePage);
			state.activeCtrlIndex = ctrlInfo.index;
			state.activeCtrlLvl = ctrlInfo.level;
			state.defaultSelectedKeys = [state.activeCtrl.vdid];
			return {...state};
		},
		handleAttrFormChangeA(state, { payload: params }) {

			var currentActiveCtrl = VDTreeActions.getCtrlByKey(state, state.activeCtrl.vdid, state.activePage);
			if (params.attrName === 'id') {
				currentActiveCtrl.controller.id = params.newVal;
			}
			var ctrlAttrs = currentActiveCtrl.controller.attrs;

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
		handleAttrFormChangeNotRefreshActiveCtrl(state, { payload: params}){

			var currentActiveCtrl = VDTreeActions.getCtrlByKey(state, params.target, state.activePage);
			if (params.attrName === 'id') {
				currentActiveCtrl.controller.id = params.newVal;
			}
			var attr = currentActiveCtrl.controller.attrs[0].children[params.index];
			attr.value = params.newVal;
			window.VDDesignerFrame.postMessage({
				VDAttrRefreshed: {
					activeCtrl: currentActiveCtrl.controller,
					attrType: params.attrType,
					attr: attr
				}
			}, '*');
			return {...state};
		},
		handleAttrRefreshed(state, { payload: params }) {

			//判断是否需要切换标签
			if(params.attrType.isChangeTag && params.attr.name == 'tag'){
				var currentActiveCtrl = VDTreeActions.getCtrlByKey(state, state.activeCtrl.vdid, state.activePage);
				currentActiveCtrl.controller.attrs.tag = params.attr.value;
				state.activeCtrl = currentActiveCtrl.controller;
				params.activeCtrl.tag = params.attr.value;
			}
			if(params.attr.isStyle){
				var currentActiveCtrl = VDTreeActions.getCtrlByKey(state, state.activeCtrl.vdid, state.activePage);
				state.activeCtrl.attrs[currentActiveCtrl.index].children[currentActiveCtrl.level-1].value = params.attr.value;
				params.activeCtrl.attrs[currentActiveCtrl.index].children[currentActiveCtrl.level-1].value = params.attr.value;
				state.activeCtrl = currentActiveCtrl.controller;
			}
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

		//栅格数变化
		handleColumnCountChange(state, { payload: params }) {
			let column = params.column;
			let value = params.value;

			let colClass = 'col-md-' + 12/value;

			let currentRootVdid = state.activeCtrl.root;
			let activePage = state.activePage.key;
			let ctrlTree = state.layout[activePage];

			let findCtrlByVdId = function (ctrlTree,VdId) {

				for(let i = 0; i < ctrlTree.length; i ++) {
					if (ctrlTree[i].children) {
						let ctrl = findCtrlByVdId(ctrlTree[i].children, VdId);
						if (ctrl) {
							return ctrl;
						}
					}
					if (ctrlTree[i].vdid === VdId) {
						return ctrlTree[i];
					}
				}

			}

			let currentColums = findCtrlByVdId(ctrlTree, currentRootVdid);//当前的栅格

			let currentCount = currentColums.children.length;//当前栅格里面的格子数

			let changClassName = function (currentColums, colClass) {
				for(let i = 0; i < currentColums.children.length; i ++){
					let originalClassName = currentColums.children[i].className;
					for(let j = 0; j < originalClassName.length; j ++) {
						if (originalClassName[j].indexOf('col-md-') !== -1) {
							originalClassName[j] = colClass;
						}
					}
				}
			}

			let changCount = value - currentCount;
			let deepCopiedController = VDTreeActions.deepCopyObj(column);

			if (changCount > 0) {

				const specialAttrList = ['custom-attr', 'link-setting', 'list-setting', 'heading-type', 'image-setting', 'select-setting'];

				const loopAttr = (controller) => {

					let childCtrl = {},
						tmpAttr = {},
						ctrl = {};

					tmpAttr = controller.attrs;
					for(let i = 0, len = tmpAttr.length; i < len; i ++) {
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
						ignore: controller.ignore || false,
						root: currentRootVdid || '',
						parent: currentRootVdid,
						unActive: false,
					};


					if(controller.children) {
						for (var i = 0; i < controller.children.length; i++) {
							var currentCtrl = controller.children[i];
							childCtrl = loopAttr(currentCtrl, ctrl);
							ctrl.children.push(childCtrl);
						};
					}else {
						ctrl.children = undefined;
					}

					return ctrl;
				}

				changClassName(currentColums, colClass);

				let addedColumn = [];

				for(let i = 0; i < changCount; i ++) {
					let tmpCtrl = loopAttr(deepCopiedController);
					tmpCtrl.className = ['vd-empty', colClass];
					currentColums.children.push(tmpCtrl);
					addedColumn.push(tmpCtrl)
				}

				window.VDDesignerFrame.postMessage({
					VDAttrRefreshed: {
						activeCtrl: state.activeCtrl,
						attr: {
							attrName: 'columns',
							action: 'add',
							column: addedColumn,
							parent: currentRootVdid,
							count: changCount,
							colClass: colClass
						},
						attrType: params.attrType
					}
				}, '*');
			}else {
				for(let i = 0; i < -changCount; i ++) {
					currentColums.children.pop();
				}
				changClassName(currentColums, colClass);
				window.VDDesignerFrame.postMessage({
					VDAttrRefreshed: {
						activeCtrl: state.activeCtrl,
						attr: {
							attrName: 'columns',
							action: 'delete',
							column: '',
							parent: currentRootVdid,
							count: -changCount,
							colClass: colClass
						}
					}
				}, '*');
			}

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
				message.error('请先添加控件再进行操作！');
				return {...state};
			}

			var className = '';

			if(params.push) {
				if(typeof params.value == 'string') {
					params.value = [params.value];
				}
				currentActiveCtrl.controller.customClassName.push(params.value[0]);
				currentActiveCtrl.controller.activeStyle = params.value[params.value.length - 1];
				className = params.value[0];
			}else {
				currentActiveCtrl.controller.customClassName = params.value;
				currentActiveCtrl.controller.activeStyle  = params.value[params.value.length - 1];
				className = params.value;
			}

			state.activeCtrl = currentActiveCtrl.controller;

			if(!params.dontChangeAttr) {
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
			}

			return {...state};
		},

		addPageToLayout(state, { payload: params }) {
			var pageInfo = params.page;
			state.layout[pageInfo.key] = [{
	    		className: [],
	    		id: '',
	    		tag: 'body',
	    		vdid: 'body-' + randomString(8, 10),
	    		ctrlName: 'body',
	    		children: []
	    	}];
	    	state.activePage.key = pageInfo.key;

	    	window.VDDesignerFrame.postMessage({
	    		pageSelected: state.layout[pageInfo.key][0].children
	    	}, '*');

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
