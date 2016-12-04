import dva from 'dva';
import { message } from 'antd';
import randomString from '../utils/randomString';

const layoutAction = {

	deepCopyObj(obj, result) {
		result = result || {};
		for(let key in obj) {
			if (typeof obj[key] === 'object') {
				result[key] = (obj[key].constructor === Array)? []: {};
				layoutAction.deepCopyObj(obj[key], result[key]);
			}else {
				result[key] = obj[key];
			}
		}
		return result;
	},

	getActivePage (state) {
		if(state.layoutState.activePage.level == 1){
			return state.layout[state.layoutState.activePage.index];
		}else {
			return state.layout[0].children[state.layoutState.activePage.index];
		}
		
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
	},

	setActivePage (layoutState, pageIndex, pageKey, level) {
		layoutState.activePage.index = pageIndex;
		layoutState.activePage.key = pageKey;
		layoutState.activeKey = pageKey;
		layoutState.activePage.level = level;
		layoutState.expandedKeys.push(pageKey);
		layoutState.activeType = 'page';
	},

	setActiveController (layoutState, controllerIndex, controllerKey, level) {
		layoutState.activeController.index = controllerIndex;
		layoutState.activeController.key = controllerKey;
		layoutState.activeKey = controllerKey;
		layoutState.level = level;
		layoutState.expandedKeys.push(controllerKey);
		layoutState.activeType = 'controller';
	},

	getController(controllersList, controller) {
		var ct;
		// controllersList.map( (ctrl) => {
		// 	if(ctrl.type == controller) {
		// 		ct = ctrl;
		// 		return ctrl;
		// 	}
		// });

		for(let i = 0; i < controllersList.length; i ++){
			if (controllersList[i].type == controller) {
				ct = controllersList[i];
			}
		}

		return ct;
	},

	getPageIndexByKey(layout, key, level) {
		var index;
		if (level == 1) {
			index = 0;
		}else {
			layout[0].children.map( (page, i) => {
				if(page.key == key) {
					index = i;
					return index;
				}
			})
		}
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
	},

	getControllerIndexAndLvlByKey(state, key, activePage) {
		let obj = {
			index: '',
			level: 3
		};
		// alert(state.layoutState.activePage.level)
		console.log(activePage)
		let controllers = activePage.children;
		// let controllers = state.layout[0].children[0].children;
		const loopControllers = function (controllers, level) {
			level = level || 3;
			for(let i = 0; i < controllers.length; i ++) {
				let currentControl = controllers[i];
				if (currentControl.children) {
					loopControllers(controllers.children, level ++);
				}
				if (currentControl.key == key) {
					obj.index = i;
					obj.level = level;
					break;
				}
			}
			return obj;
		}
		return loopControllers(controllers, 3);
	},

	getCurrentLevelByKey(layouts, key) {
		// let level = 1;
		// console.log(layouts)
		const loopData = function(data, level, key) {
			console.log(data,level);
			if (!data) {
				return level - 1;
			}
			for(let i = 0; i < data.length; i ++) {
				// let level = 1;
				if(data[i].key == key) {
					console.log(data[i].key)
					return level;
				}
				level ++;
				return loopData(data[i].children, level, key);
			}
		}
		let ertuLevel = loopData(layouts, 1, key);
		return ertuLevel;
	},

	// setActiveLevelAndIndexAndKey(layoutState, index, key, level) {
	// 	layoutState.
	// }

	getCurrentPageOrController(layout,level,index) {
		let current = layout.children;
		while(--level !== 0) {
			current = current.children;
		}
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

		publicAttrs: {
			class: {
				attrName: 'class',
				title: '类名',
				type: 'input',
				isClassName: false,
				isHTML: false,
				_value: ''
			},

			id: {
				attrName: 'id',
				title: 'id',
				type: 'input',
				isClassName: false,
				isHTML: false,
				_value: ''
			},

			style: {
				attrName: 'style',
				title: '内联样式',
				type: 'input',
				isClassName: false,
				isHTML: false,
				_value: ''
			},

			hidden: {
				attrName: 'hidden',
				title: '内联样式',
				type: 'toggle',
				isClassName: false,
				isHTML: false,
				_value: false
			}
		},

		publicEvents: [

		],

		layout: [

			{
				name: '应用',
				type: 'page',
				key: 'page-2233',
				attr: {

					pages: {
						type: 'app_select',
						attrType: '',
						isClassName: false,
						title: '页面',
						_value: ['page-123']
					},

					title: {
						type: 'input',
						attrType: 'text',
						title: '页面名称',
						isClassName: false,
						isHTML: false,
						'_value': '应用'
					},

					'window': {
						type: 'children',
						title: '窗体设置',
						isClassName: false,
						_value: {
							navigationBarBackgroundColor: {
								type: 'input',
								attrType: 'color',
								title: '头背景色',
								_value: '#ffffff',
								isClassName: false
							},

							navigationBarTextStyle: {
								type: 'select',
								title: '头字体样式',
								value: ['black', 'white'],
								_value: 'black',
								isClassName: false
							},

							navigationBarTitleText: {
								type: 'input',
								attrType: 'text',
								title: '头标题',
								_value: 'black',
								isClassName: false
							},

							backgroundColor: {
								type: 'input',
								attrType: 'color',
								title: '背景颜色',
								_value: '#eeeeee',
								isClassName: false
							},

							backgroundTextStyle: {
								type: 'select',
								title: '字体样式',
								value: ['dark', 'light'],
								_value: 'light',
								isClassName: false
							},

							enablePullDownRefresh: {
								type: 'toggle',
								title: '下拉刷新',
								_value: false,
								isClassName: false
							}

						}
					},

					// tabBar: {

					// },

					networkTimeout: {
						type: 'children',
						title: '网络设置',
						isClassName: false,
						_value: {
							request: {
								type: 'input',
								attrType: 'number',
								title: '请求延迟',
								field: 'request',
								_value: 100000,
								isClassName: false
							},

							downloadFile: {
								type: 'input',
								attrType: 'number',
								title: '下载延迟',
								field: 'downloadFile',
								_value: 10000,
								isClassName: false
							}
						}
					},

					debug: {
						type: 'toggle',
						isClassName: false,
						title: '调试模式',
						_value: true
					}

				},

				children: [

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
							},
						},

						children: [],

					},

				]
			}

		],

		layoutState: {
			activePage: {
				index: 0,
				key: 'page-2233',
				level: 1
			},

			activeController: {
				index: 0,
				key: '',
				level: 3
			},

			activeKey: 'page-2233',
			activeType: 'page',
			expandedKeys: ['page-2233']
		},

		controllersList: [
			{
				name: '按钮组',
				type: 'button-bar',
				attr: {}
			},

			{
				name: '应用',
				type: 'page',
				children: [],
				backend: true,
				attr: {

					pages: {
						type: 'app_select',
						attrType: '',
						isClassName: false,
						title: '页面',
						_value: ['']
					},

					title: {
						type: 'input',
						attrType: 'text',
						title: '页面名称',
						isClassName: false,
						isHTML: false,
						'_value': '应用'
					},

					'window': {
						type: 'children',
						title: '窗体设置',
						isClassName: false,
						_value: {
							navigationBarBackgroundColor: {
								type: 'input',
								attrType: 'color',
								title: '头背景色',
								_value: '#ffffff',
								isClassName: false
							},

							navigationBarTextStyle: {
								type: 'select',
								title: '头字体样式',
								value: ['black', 'white'],
								_value: 'black',
								isClassName: false
							},

							navigationBarTitleText: {
								type: 'input',
								attrType: 'text',
								title: '头标题',
								_value: 'black',
								isClassName: false
							},

							backgroundColor: {
								type: 'input',
								attrType: 'color',
								title: '背景颜色',
								_value: '#eeeeee',
								isClassName: false
							},

							backgroundTextStyle: {
								type: 'select',
								title: '字体样式',
								value: ['dark', 'light'],
								_value: 'light',
								isClassName: false
							},

							enablePullDownRefresh: {
								type: 'toggle',
								title: '下拉刷新',
								_value: false,
								isClassName: false
							}

						}
					},

					// tabBar: {

					// },

					networkTimeout: {
						type: 'children',
						title: '网络设置',
						isClassName: false,
						_value: {
							request: {
								type: 'input',
								attrType: 'number',
								title: '请求延迟',
								field: 'request',
								_value: 100000,
								isClassName: false
							},

							downloadFile: {
								type: 'input',
								attrType: 'number',
								title: '下载延迟',
								field: 'downloadFile',
								_value: 10000,
								isClassName: false
							}
						}
					},

					debug: {
						type: 'toggle',
						isClassName: false,
						title: '调试模式',
						_value: true
					}
				}
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
						_value: '#f8f8f8'
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
						_value: '按钮'
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
						_value: 'weui-btn_primary'
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
				tag: ['button'],
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
		],
		constructionMenuStyle: {
		    position: 'fixed',
		    top: '',
		    left: '',
		    display: 'none'
		}
	},

	subscriptions: {

		setup({ dispatch, history }) {
	      	history.listen(({ pathname }) => {
	      		setTimeout(function() {
	      			window.gospelDesigner = window.frames['gospel-designer'];
		      		console.log('gospelDesigner', gospelDesigner);

	      		});
	      	});
		}

	},

	effects: {

	},

	reducers: {

		handleDeviceSelected(state, { payload: key }) {
			state.defaultDevice = key;
			return {...state};
		},

		// setActivePage(state, { payload: params }) {
		// 	layoutAction.setActivePage(state.layoutState, params.index, params.key, params.level);
		// 	return {...state};
		// },

		// setActiveController(state, { payload: params }) {
		// 	layoutAction.setActiveController(state.layoutState, params.index, params.key, params.level);
		// 	return {...state};
		// },

		addPage(state, { payload: page }) {
			console.log("addPage1111111111111111:::::::::::::::::::::::",state.layout)
			var page = page || layoutAction.getController(state.controllersList, 'page');

			console.log('page', page);

			let tmpAttr = {};
			tmpAttr = layoutAction.deepCopyObj(page.attr, tmpAttr);

			tmpAttr['title']['_value'] = page.name;
			tmpAttr['title']['type'] = 'input';
			tmpAttr['title']['isClassName'] = false;
			tmpAttr['title']['isHTML'] = false;
			tmpAttr['title']['title'] = '页面名称';
			
			console.log('page.attr', page.attr);

			console.log(tmpAttr)

			// for(var att in page.attr) {
			// 	var currAttr = page.attr[att];
			// 	tmpAttr[att] = currAttr;
			// 	tmpAttr['title']['_value'] = page.name;
			// 	tmpAttr['title']['type'] = 'input';
			// 	tmpAttr['title']['isClassName'] = false;
			// 	tmpAttr['title']['isHTML'] = false;
			// 	tmpAttr['title']['title'] = '页面名称';
			// }
			console.log('=========-------------------',state.layout[0].children.length);
			var tmpPage = {
				type: 'page',
				key: 'page-' + state.layout[0].children.length,
				isLeaf: false,
				attr: tmpAttr,
				children: []
			}

			console.log(tmpPage);
			console.log('pre push', state.layout);
			state.layout[0].children.push(tmpPage);
			console.log('after layout', state.layout);
			layoutAction.setActivePage(state.layoutState, state.layout[0].children.length - 1, tmpPage.key, 2);
			console.log("addPage2222222222:::::::::::::::::::::::",state.layout)
			return {...state};
		},

		hideConstructionMenu(state) {
			return {...state,constructionMenuStyle: {
				display: 'none'
			}}
		},

		showConstructionMenu(state, {payload: proxy}) {
			return {...state, constructionMenuStyle: {
				position: 'fixed',
				display: 'block',
				// border: '1px solid #e9e9e9',
				// padding: '5px 10px',
				left: proxy.event.clientX,
				top: proxy.event.clientY,
				// background: 'white'
			}}
		},

		deleteConstruction(state,{payload: params}) {
			if (params.type == 'page') {
				// alert(params.level)
				state.layout[0].children.splice(params.deleteIndex,1);
				layoutAction.setActivePage(state.layoutState, params.lastIndex, params.key, 2);
			}else {
				state.layout[state.layoutState.activePage.index].children.splice(params.deleteIndex,1);
				let level = getCurrentLevelByKey(state.layout,params.key);
				layoutAction.setActiveController(state.layoutState, params.lastIndex, params.key, level);
			}

			gospelDesigner.postMessage({
				ctrlRemoved: layoutAction.getActivePage(state)
			}, '*');

			return {...state};
		},

		addController(state, { payload: controller }) {
			console.log("addController11111111111:::::::::::::::::::::::记得改",state.layout)
			if (state.layoutState.activePage.level == 1) {
				message.error('请选择一个页面');
				return {...state};
			}
			var activePage = layoutAction.getActivePage(state);

			// let leve = layoutAction.getCurrentLevelByKey(state.layout, state.layoutState.activePage.key);
			var tmpAttr = {};
			console.log(controller)
			tmpAttr = layoutAction.deepCopyObj(controller.attr, tmpAttr);
				tmpAttr['title'] = {};
				tmpAttr['title']['_value'] = controller.name;
				tmpAttr['title']['type'] = 'input';
				tmpAttr['title']['isClassName'] = false;
				tmpAttr['title']['isHTML'] = false;
				tmpAttr['title']['title'] = '名称';
			// tmpAttr['title']['_value'] = controller.name;
			// tmpAttr['title']['title'] = '名称';
			// for(var att in controller.attr) {
			// 	var currAttr = controller.attr[att];
			// 	tmpAttr[att] = currAttr;
			// 	tmpAttr['title'] = {};
			// 	tmpAttr['title']['_value'] = controller.name;
			// 	tmpAttr['title']['type'] = 'input';
			// 	tmpAttr['title']['isClassName'] = false;
			// 	tmpAttr['title']['isHTML'] = false;
			// 	tmpAttr['title']['title'] = '名称';
			// }

			var ctrl = {
				type: controller.type,
				key: controller.type + '-' + randomString(8, 10),
				attr: tmpAttr,
				tag: controller.tag,
				baseClassName: controller.baseClassName
			};

			console.log(ctrl);

    		gospelDesigner.postMessage({
    			ctrlAdded: ctrl
    		}, '*');

			activePage.children.push(ctrl);
			let level = layoutAction.getCurrentLevelByKey(state.layout, ctrl.key);
			// alert(level)
			layoutAction.setActiveController(state.layoutState, activePage.children.length - 1, ctrl.key, level);
			return {...state};
		},

		handleTreeChanged(state, { payload: params }) {
			console.log('handleTreeChanged');
			// let currentControl = layoutAction.getCurrentPageOrController(state.layout, params.key, level);
			if(params.type == 'page') {
				let level = layoutAction.getCurrentLevelByKey(state.layout, params.key);
				// alert(level)
				var pageIndex = layoutAction.getPageIndexByKey(state.layout, params.key, level);
				layoutAction.setActivePage(state.layoutState, pageIndex, params.key, level);
				console.log(state.layoutState)

				// alert(1)
			}else {
				let activePage = layoutAction.getActivePage(state);
				console.log(activePage)
				console.log(state.layoutState)
				console.log(layoutAction.getControllerIndexAndLvlByKey(state, params.key, activePage));

				var activePage = layoutAction.getActivePage(state);
				console.log('activePage', activePage);
				var controllerIndex = layoutAction.getControllerIndexByKey(activePage.children, params.key);
				// console.log('dfdsfdsfdsfdsfdsfsfsfdsfds:',state.layout)
				let level = layoutAction.getCurrentLevelByKey(state.layout, params.key);
				// alert(level)
				layoutAction.setActiveController(state.layoutState, controllerIndex, params.key, level);
			}
			return {...state};
		},

		handleAttrRefreshed (state) {
			var activePage = layoutAction.getActivePage(state);

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
			var activePage = layoutAction.getActivePage(state);

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
			var activePage = layoutAction.getActivePage(state);

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
			console.log(params)
			var activePage = layoutAction.getActivePage(state);
			console.log("activePage:",activePage);

			if(state.layoutState.activeType == 'page') {
				if (params.parentAtt) {
					activePage.attr[params.parentAtt.attrName]['_value'][params.attrName]['_value'] = params.newVal;
				}else {
					activePage.attr[params.attrName]['_value'] = params.newVal;
				}
				console.log("activePage.attr:" , activePage.attr);
				// state.layout[0].children[1].type = 'controller';
				// state.layout[0].children[2].key = '3';
				console.log(state.layout[0].children)
			}

			if(state.layoutState.activeType == 'controller') {
				// activePage = state.layout[0].children[0];
	      		// const loopChildren = (page) => {

	      		// 	var ct;

	      		// 	for (var i = 0; i < page.length; i++) {
	      		// 		var ctrl = page[i];

	      		// 		if(ctrl.children) {
	      		// 			loopChildren(ctrl.children);
	      		// 		}

	      		// 		if(typeof ctrl.attr[params.attrName] != 'undefined') {
	      		// 			ct = ctrl;
	      		// 			break;
	      		// 		}
	      		// 	};

	      		// 	return ct;

	      		// };

	      		// var activeCtrl = loopChildren(activePage.children);
	      		var activeCtrl = activePage.children[state.layoutState.activeController.index];

	      		activeCtrl.attr[params.attrName]['_value'] = params.newVal;

			}
			console.log('handleAttrFormChange222:::::::::::::::::', state.layout);
			return {...state};
		}

	}

}
