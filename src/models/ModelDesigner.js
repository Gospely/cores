import dva from 'dva';
import { message } from 'antd';
import randomString from '../utils/randomString';

const layoutAction = {
	getActivePage (layout, index) {
		return layout[index];
	},

	getActiveControllerByKey (page, key) {

		var ct;

		for (var i = 0; i < page.length; i++) {
			var ctrl = page[i];

			if(ctrl.children) {
				layoutAction.getActiveControllerByKey(ctrl.children);
			}

			if(typeof ctrl.key == key) {
				ct = ctrl;
				break;
			}
		};

		return ct;
		// return layout[activePageIndex].children[activeControllerIndex];
	},

	setActivePage (layoutState, pageIndex, pageKey) {
		layoutState.activePage.index = pageIndex;
		layoutState.activePage.key = pageKey;
		layoutState.activeKey = pageKey;
		layoutState.expandedKeys.push(pageKey);
		layoutState.activeType = 'page';
	},

	setActiveController (layoutState, controllerIndex, controllerKey) {
		layoutState.activeController.index = controllerIndex;
		layoutState.activeController.key = controllerKey;
		layoutState.activeKey = controllerKey;
		layoutState.expandedKeys.push(controllerKey);
		layoutState.activeType = 'controller';
	},

	getController(controllersList, controller) {
		var ct;
		controllersList.map( (ctrl) => {
			if(ctrl.type == controller) {
				ct = ctrl;
				return ctrl;
			}
		});

		return ct;
	},

	getPageIndexByKey(layout, key) {
		var index;
		layout.map( (page, i) => {
			if(page.key == key) {
				index = i;
				return index;
			}
		})
		return index;
	},

	getControllerIndexByKey(controllersList, key) {
		var index;
		controllersList.map( (controller, i) => {
			if(controller.key == key) {
				index = i;
				return index;
			}
		})
		return index;		
	}
}

export default {
	namespace: 'designer',
	state: {
		deviceList: [
			{
				name: 'iPhone',
				width: 375,
				height: 667
			},
			{
				name: 'iPad',
				width: 1024,
				height: 768
			},
			{
				name: '安卓手机',
				width: 360,
				height: 640
			}
		],

		defaultDevice: 0,

		publicAttrs: [

		],

		publicEvents: [

		],

		layout: [

			{
				type: 'page',
				key: 'page-123',
				isLeaf: false,
				attr: {

					title: {
						type: 'input',
						attrType: 'text',
						title: '页面名称',
						isClassName: false,
						isHTML: false,
						'_value': '主页面'
					},

					color: {
						type: 'input',
						attrType: 'color',
						title: '背景颜色',
						isClassName: false,
						isHTML: false,
						'_value': '#f8f8f8'
					},
					images: {
						type: 'input',
						attrType: 'text',
						title: '背景图片',
						isClassName: false,
						isHTML: false,
						'_value': '#ff4ff'
					},

					padding: {
						type: 'input',
						attrType: 'number',
						title: '内边距',
						isClassName: false,
						isHTML: false,
						'_value': '20'
					},
					scrolling: {
						type: 'toggle',
						title: '是否滚动',
						isClassName: false,
						isHTML: false,
						'_value': true
					},
					class: {
						type: 'input',
						attrType: 'text',
						title: '类名',
						isClassName: true,
						isHTML: false,
						'_value': 'weui-cell__bd'
					},

					routingURL: {
						type: 'input',
						attrType: 'text',
						title: '路由',
						isClassName: false,
						isHTML: false,
						'_value': '/fuck'
					},

					icon: {
						type: 'select',
						title: '图标',
						value: ['weui', 'fuck'],
						isClassName: false,
						isHTML: false,
						'_value': 'weui'
					}

				},

				children: [],

			},

		],

		layoutState: {
			activePage: {
				index: 0,
				key: 'page-123'
			},

			activeController: {
				index: 0,
				key: ''
			},

			activeKey: 'page-123',
			activeType: 'page',
			expandedKeys: []
		},

		controllersList: [
			{
				name: '按钮组',
				type: 'button-bar',
				attr: {}
			},
			{
				name: '页面',
				type: 'page',
				attr: {
					title: {
						type: 'input',
						attrType: 'text',
						title: '页面名称',
						isClassName: false,
						isHTML: false,
						_value: ''
					},

					color: {
						type: 'input',
						attrType: 'color',
						title: '背景颜色',
						isClassName: false,
						isHTML: false,
						_value: ''
					},
					images: {
						type: 'input',
						attrType: 'text',
						title: '背景图片',
						isClassName: false,
						isHTML: false,
						_value: ''
					},

					padding: {
						type: 'input',
						attrType: 'number',
						title: '内边距',
						isClassName: false,
						isHTML: false,
						_value: ''
					},
					scrolling: {
						type: 'toggle',
						title: '是否滚动',
						isClassName: false,
						isHTML: false,
						_value: ''
					},
					class: {
						type: 'input',
						attrType: 'text',
						title: '类名',
						isClassName: false,
						isHTML: false,
						_value: ''
					},

					routingURL: {
						type: 'input',
						attrType: 'text',
						title: '路由',
						isClassName: false,
						isHTML: false,
						_value: ''
					},

					icon: {
						type: 'select',
						title: '图标',
						value: ['weui', 'fuck'],
						isClassName: false,
						isHTML: false,
						_value: ''
					}

				},
				backend: true
			},
			{
				name: '按钮',
				type: 'button',
				attr: {
					value: {
						type: 'input',
						title: '值',
						isClassName: false,
						isHTML: true,
						_value: ''
					},
					disabled: {
						type: 'toggle',
						title: '禁止',
						value: ['weui-btn_disabled weui-btn_plain-disabled'],
						isClassName: true,
						isHTML: false,
						_value: ''
					},
					class: {
						type: 'select',
						title: '按钮类型',
						value: ['weui-btn_primary', 'weui-btn_default', 'weui-btn_warn', 'weui-btn_plain-default', 'weui-btn_plain-primary', 'weui-vcode-btn'],
						isClassName: true,
						isHTML: false,
						_value: ''
					},
					mini: {
						type: 'toggle',
						title: '迷你按钮',
						value: ['weui-btn_mini'],
						isClassName: true,
						isHTML: false,
						_value: ''
					}
				},
				tag: ['button', 'button'],
				baseClassName: 'weui-btn',
				wrapper: ''
			},
			{
				name: '表单',
				type: 'form',
				attr: {},
				baseClassName: 'weui-cells weui-cells_form',
				tag: 'div',
				children: {
					baseClassName: 'weui-cell',
					tag: 'div',
					type: {
						vcode: {
							type: 'toggle',
							title: '三栏',
							value: ['weui-cell_vcode'],
							isClassName: true,
							isHTML: false,
							_value: ''
						},

						warning: {
							type: 'toggle',
							title: '报错',
							value: ['weui-cell_warn'],
							isClassName: true,
							isHTML: false,
							_value: ''
						}
					},
					children: [{
						tag: 'div',
						baseClassName: 'weui-cell__hd',
						children: [{
							tag: 'label',
							baseClassName: 'weui-label',
							attr: {
								value: {
									type: 'input',
									title: '提示信息',
									isClassName: false,
									isHTML: true,
									_value: ''
								}
							}
						}]
					}, {
						tag: 'div',
						baseClassName: 'weui-cell__bd',
						children: []
					}, {
						tag: 'div',
						baseClassName: 'weui-cell__ft',
						children: []
					}]
				}
			},
			{
				name: '输入框',
				type: 'input',
				attr: {
					value: {
						type: 'input',
						title: '内容',
						isClassName: false,
						isHTML: false,
						_value: ''
					},
					disabled: {
						type: 'toggle',
						title: '禁止',
						value: [],
						isClassName: true,
						isHTML: false,
						_value: ''
					},
					type: {
						type: 'select',
						title: '类型',
						isClassName: false,
						isHTML: false,
						value: ['number', 'color', 'range', 'text', 'datetime-local', 'date', 'password', 'email', 'tel'],
						_value: ''
					},
					placeholder: {
						type: 'input',
						title: '占位符',
						isClassName: false,
						isHTML: false,
						_value: ''
					},
					pattern: {
						type: 'input',
						title: '正则',
						isClassName: false,
						isHTML: false,
						_value: ''
					}
				},
				tag: ['div'],
				baseClassName: 'weui-input',
				wrapper: ''
			},
			{
				name: '文本域',
				type: 'textarea',
				attr: {
					counter: {
						type: 'toggle',
						title: '显示计字器',
						isClassName: false,
						isHTML: false,
						_value: '',
						value: {
							name: '计字器',
							tag: 'div',
							baseClassName: 'weui-textarea-counter',
							children: [{
								tag: 'span',
								attr: {
									type: 'input',
									title: '从',
									isClassName: false,
									isHTML: true,
									_value: ''
								}
							}, {
								tag: 'span',
								attr: {
									type: 'input',
									title: '到',
									isClassName: false,
									isHTML: true,
									_value: ''
								}
							}]
						}
					}
				},
				baseClassName: 'weiui-textarea',
				tag: 'textarea'
			},
			{
				name: '单选框',
				type: 'radio',
				attr: {
					name: {
						type: 'input',
						title: '名称',
						isClassName: false,
						isHTML: false,
						_value: ''
					}
				},
				tag: 'input',
				type: 'radio',
				baseClassName: 'weui-check'
			},
			{
				name: '开关',
				type: 'toggle',
				attr: {
					checked: {
						type: 'toggle',
						title: '选中',
						isClassName: false,
						isHTML: false,
						_value: ''
					}
				},
				tag: 'input',
				type: 'checkbox',
				baseClassName: 'weui-switch'
			},
			{
				name: '卡片',
				type: 'card',
				attr: {}
			},
			{
				name: '复选框',
				type: 'checkbox',
				attr: {
					name: {
						type: 'input',
						title: '名称',
						isClassName: false,
						isHTML: false,
						_value: ''
					},
					checked: {
						type: 'toggle',
						title: '选中',
						isClassName: false,
						isHTML: false,
						_value: ''
					}
				},
				tag: 'input',
				type: 'checkbox'
			},
			{
				name: '头部',
				type: 'header',
				attr: {}
			},
			{
				name: '底部',
				type: 'footer',
				attr: {}
			},
			{
				name: '标题',
				type: 'heading',
				tag: 'div',
				baseClassName: 'weui-cells__title',
				attr: {
					value: {
						type: 'input',
						title: '标题',
						isClassName: false,
						isHTML: true,
						_value: ''
					}
				}
			},
			{
				name: '底部说明',
				type: 'heading',
				tag: 'div',
				baseClassName: 'weui-cells__tips',
				attr: {
					value: {
						type: 'input',
						title: '说明',
						isClassName: false,
						isHTML: true,
						_value: ''
					}
				}
			},
			{
				name: '代码',
				type: 'html',
				attr: {}
			},
			{
				name: '图片',
				type: 'image',
				attr: {}
			},
			{
				name: '分割',
				type: 'list-item-divider',
				attr: {}
			},
			{
				name: '列表',
				type: 'list',
				attr: {
					linked: {
						type: 'toggle',
						title: '跳转',
						isClassName: true,
						value: ['weui-cell_access'],
						isHTML: false,
						_value: ''
					}
				},
				tag: 'div',
				baseClassName: 'weui-cells',
				children: [{
					tag: 'div',
					baseClassName: 'weui-cell',
					children: [{
						tag: 'div',
						baseClassName: 'weui-cell__hd',
						children: []
					}, {
						tag: 'div',
						baseClassName: 'weui-cell__bd',
						children: []
					}, {
						tag: 'div',
						baseClassName: 'weui-cell__ft',
						children: []
					}]
				}]
			},
			{
				name: '地图',
				type: 'map',
				attr: {}
			},
			{
				name: '段落',
				type: 'markdown',
				attr: {}
			},
			{
				name: '滑块',
				type: 'range',
				attr: {
					value: {
						type: 'input',
						title: '值',
						isClassName: false,
						isHTML: false,
						isSetWidth: true,
						_value: ''
					}
				},
				tag: 'div',
				baseClassName: 'weui-slider',
				children: [{
					tag: 'div',
					baseClassName: 'weui-slider__inner',
					children: [{
						tag: 'div',
						baseClassName: 'weui-slider__track',
						children: []
					}, {
						tag: 'div',
						baseClassName: 'weui-slider__handler',
						children: []
					}]
				}]
			},
			{
				name: '搜索框',
				type: 'search',
				attr: {}
			},
			{
				name: '选择框',
				type: 'select',
				attr: {
					name: {
						type: 'input',
						title: '名称',
						isClassName: false,
						isHTML: false,
						_value: ''
					}
				},
				tag: 'select',
				children: [{
					tag: 'option',
					attr: {
						value: {
							type: 'input',
							title: '值',
							isClassName: false,
							isHTML: false,
							_value: ''
						},

						html: {
							type: 'input',
							title: '显示值',
							isClassName: false,
							isHTML: true,
							_value: ''
						}
					}
				}],
				baseClassName: 'weui-select'
			},
			{
				name: '幻灯片',
				type: 'slider',
				attr: {}
			},
			{
				name: '空白分割',
				type: 'spacer',
				attr: {}
			},
			{
				name: '搜索框',
				type: 'search',
				attr: {}
			},
			{
				name: '视频',
				type: 'video',
				attr: {}
			},
			{
				name: '列表头像',
				type: 'list-item-avatar',
				attr: {}
			},
			{
				name: '列表相册',
				type: 'list-item-thumbnail',
				attr: {}
			},
			{
				name: '列表图标',
				type: 'list-item-icon',
				attr: {}
			},
			{
				name: '列表容器',
				type: 'list-item-container',
				attr: {}
			},
			{
				name: '容器',
				type: 'container',
				attr: {}
			}
		]
	},

	subscriptions: {

	},

	effects: {

	},

	reducers: {

		handleDeviceSelected(state, { payload: key }) {
			state.defaultDevice = key;
			return {...state};
		},

		setActivePage(state, { payload: params }) {
			layoutAction.setActivePage(state.layoutState, params.index, params.key);
			return {...state};
		},

		setActiveController(state, { payload: params }) {
			layoutAction.setActiveController(state.layoutState, params.index, params.key);
			return {...state};
		},

		addPage(state, { payload: page }) {
			console.log("addPage1111111111111111:::::::::::::::::::::::",state.layout)
			var page = page || layoutAction.getController(state.controllersList, 'page');

			console.log('page', page);

			var tmpAttr = {};

			console.log('page.attr', page.attr);

			for(var att in page.attr) {
				var currAttr = page.attr[att];
				tmpAttr[att] = currAttr;
				tmpAttr[att]['_value'] = '';
				tmpAttr['title']['_value'] = page.name;
				tmpAttr['title']['type'] = 'input';
				tmpAttr['title']['isClassName'] = false;
				tmpAttr['title']['isHTML'] = false;
				tmpAttr['title']['title'] = '页面名称';
			}

			var tmpPage = {
				type: 'page',
				key: 'page-' + randomString(8, 10),
				isLeaf: false,
				attr: tmpAttr,
				children: []
			}

			console.log(tmpPage);
			console.log('pre push', state.layout);
			state.layout.push(tmpPage);
			console.log('after layout', state.layout);
			layoutAction.setActivePage(state.layoutState, state.layout.length - 1, tmpPage.key);
			console.log("addPage2222222222:::::::::::::::::::::::",state.layout)
			return {...state};
		},

		addController(state, { payload: controller }) {
			console.log("addController11111111111:::::::::::::::::::::::",state.layout)
			var activePage = layoutAction.getActivePage(state.layout, state.layoutState.activePage.index);
			var tmpAttr = {};

			for(var att in controller.attr) {
				var currAttr = controller.attr[att];
				tmpAttr[att] = currAttr;
				tmpAttr[att]['_value'] = '';
				tmpAttr['title'] = {};
				tmpAttr['title']['_value'] = controller.name;
				tmpAttr['title']['type'] = 'input';
				tmpAttr['title']['isClassName'] = false;
				tmpAttr['title']['isHTML'] = false;
				tmpAttr['title']['title'] = '名称';
			}

			var ctrl = {
				type: controller.type,
				key: controller.type + '-' + randomString(8, 10),
				attr: tmpAttr
			};

			console.log(ctrl);

			activePage.children.push(ctrl);
			layoutAction.setActiveController(state.layoutState, activePage.children.length - 1, ctrl.key);

			console.log("addController2222222222:::::::::::::::::::::::",state.layout)
			return {...state};
		},

		handleTreeChanged(state, { payload: params }) {
			console.log("handleTreeChanged11111111111:::::::::::::::::::::::",state.layout)
			if(params.type == 'page') {
				var pageIndex =layoutAction.getPageIndexByKey(state.layout, params.key);
				layoutAction.setActivePage(state.layoutState, pageIndex, params.key);
			}else {
				var activePage = layoutAction.getActivePage(state.layout, state.layoutState.activePage.index);
				var controllerIndex = layoutAction.getControllerIndexByKey(activePage.children, params.key);
				layoutAction.setActiveController(state.layoutState, controllerIndex, params.key);
			}
			console.log("handleTreeChanged2222222222222:::::::::::::::::::::::",state.layout)
			return {...state};
		},

		handleAttrRefreshed (state) {
			console.log("handleAttrRefreshed1111111111111:::::::::::::::",state.layout);
			var activePage = layoutAction.getActivePage(state.layout, state.layoutState.activePage.index);

	    		var gospelDesigner = window.frames['gospel-designer'];

	    		if(!gospelDesigner) {
	    			message.error('请先打开编辑器！');
	    			return {...state};
	    		}

	    		if(state.layoutState.activeType == 'page') {

		    		gospelDesigner.postMessage({
		    			attrRefreshed: activePage
		    		}, '*');

	    		}

	    		if(state.layoutState.activeType == 'controller') {
	    			var activeCtrl = layoutAction.getActiveControllerByKey(activePage.children, state.layoutState.activeController.key);

		    		gospelDesigner.postMessage({
		    			attrRefreshed: activeCtrl
		    		}, '*');
	    		}
	    		console.log('handleAttrRefreshed222222222222:::::::::::::::::', state.layout);
	    		return {...state};

		},

		handleCtrlSelected (state) {
			console.log("handleCtrlSelected111111111111:::::::::::::::",state.layout);
			var activePage = layoutAction.getActivePage(state.layout, state.layoutState.activePage.index);

	    		var gospelDesigner = window.frames['gospel-designer'];

	    		if(!gospelDesigner) {
	    			message.error('请先打开编辑器！')
	    			return false;
	    		}

	    		if(state.layoutState.activeType == 'page') {

		    		gospelDesigner.postMessage({
		    			ctrlSelected: activePage
		    		}, '*');

	    		}

	    		if(state.layoutState.activeType == 'controller') {
	    			var activeCtrl = layoutAction.getActiveControllerByKey(activePage.children, state.layoutState.activeController.key);

		    		gospelDesigner.postMessage({
		    			ctrlSelected: activeCtrl
		    		}, '*');
	    		}
	    		console.log("handleCtrlSelected222222222222222:::::::::::::::",state.layout);
	    		return {...state};

		},		

		handlePageAdded (state) {
			console.log("handlePageAdded11111:::::::::::::::",state.layout);
			var activePage = layoutAction.getActivePage(state.layout, state.layoutState.activePage.index);

	    		var gospelDesigner = window.frames['gospel-designer'];

	    		if(!gospelDesigner) {
	    			message.error('请先打开编辑器！')
	    			return false;
	    		}

	    		if(state.layoutState.activeType == 'page') {

		    		gospelDesigner.postMessage({
		    			pageAdded: activePage
		    		}, '*');

	    		}

	    		if(state.layoutState.activeType == 'controller') {
	    			var activeCtrl = layoutAction.getActiveControllerByKey(activePage.children, state.layoutState.activeController.key);

		    		gospelDesigner.postMessage({
		    			pageAdded: activeCtrl
		    		}, '*');
	    		}
	    		console.log("handlePageAdded222222:::::::::::::::",state.layout);
	    		return {...state};

		},

		handleAttrFormChange(state, { payload: params }) {
			console.log('handleAttrFormChange11111:::::::::::::::::', state.layout);
			var activePage = layoutAction.getActivePage(state.layout, state.layoutState.activePage.index);
			console.log("activePage:",activePage);
			if(state.layoutState.activeType == 'page') {
				activePage.attr[params.attrName]['_value'] = params.newVal;
				console.log("activePage.attr:" , activePage.attr);
			}

			if(state.layoutState.activeType == 'controller') {
		      		const loopChildren = (page) => {

		      			var ct;

		      			for (var i = 0; i < page.length; i++) {
		      				var ctrl = page[i];

		      				if(ctrl.children) {
		      					loopChildren(ctrl.children);
		      				}

		      				if(typeof ctrl.attr[params.attrName] != 'undefined') {
		      					ct = ctrl;
		      					break;
		      				}
		      			};

		      			return ct;

		      		};


		      		var activeCtrl = loopChildren(activePage.children);

		      		activeCtrl.attr[params.attrName]['_value'] = params.newVal;

			}
			console.log('handleAttrFormChange222:::::::::::::::::', state.layout);
			return {...state};
		}

	}

}
