import dva from 'dva';
import { message } from 'antd';
import randomString from '../utils/randomString';
import computeDomHeight from '../utils/computeDomHeight.js';

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

	getCtrlByKey(layout, key) {
		for(let i = 0; i < layout.children.length; i ++) {
			if (layout.children[i].key == key) {
				return layout.children[i];
			}
			if (layout.children[i].children) {
				let ctrl = layoutAction.getCtrlByKey(layout.children[i], key);
				if(ctrl) {
					return ctrl;
				}
			}
		}
	},

	getControllerIndexByKey(controllersList, key) {
		var index;

		for (var i = 0; i < controllersList.length; i++) {
			var controller = controllersList[i];
			if(controller.children) {
				layoutAction.getControllerIndexByKey(controller.children, key);
			}

			if(controller.key == key) {
				index = i;
				break;
			}
		};
		return index;
	},

	getCtrlParentAndIndexByKey(ctrl, key) {
	    for(let i = 0; i < ctrl.children.length; i ++) {

	        if (ctrl.children[i].key == key) {

	        	let data = {
	        		parentCtrl: ctrl,
	        		thisCtrl: ctrl.children[i],
	        		index: i
	        	}
	            return data;
	        }

	        if (ctrl.children[i].children) {
	            let result = layoutAction.getCtrlParentAndIndexByKey(ctrl.children[i], key);
	            if(result) {
	                return result;
	            }
	        }

	    }
	},

	getActivePage (state) {
		if(state.layoutState.activePage.level == 1){
			return state.layout[state.layoutState.activePage.index];
		}else {
			return state.layout[0].children[state.layoutState.activePage.index];
		}

	},

	getActiveControllerByKey (controllerList, key) {

		var ct;

		for (var i = 0; i < controllerList.length; i++) {
			var ctrl = controllerList[i];

			if(ctrl.children) {
				layoutAction.getActiveControllerByKey(ctrl.children, key);
			}

			if(ctrl.key == key) {
				ct = ctrl;
				window.currentActiveController = ct;
				return ct;
				break;
			}
		};

		return ct || window.currentActiveController;
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
		layoutState.activeController.level = level;
		layoutState.expandedKeys.push(controllerKey);
		layoutState.activeType = 'controller';
	},

	getController(controllersList, controller) {
		var ct;

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

	getControllerIndexAndLvlByKey(state, key, activePage) {
		let obj = {
			index: '',
			level: 3
		};
		let controllers = activePage.children;
		const loopControllers = function (controllers, level) {
			level = level || 3;
			for(let i = 0; i < controllers.length; i ++) {
				let currentControl = controllers[i];
				if (currentControl.children) {
					loopControllers(currentControl.children, level ++);
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

	getActiveControllerByIndexAndLevel(state, activePage, index, level) {

	},

	getCurrentLevelByKey(layouts, key) {
		const loopData = function(data, level, key) {
			if (!data) {
				return level - 1;
			}
			for(let i = 0; i < data.length; i ++) {
				if(data[i].key == key) {
					return level;
				}
				level ++;
				return loopData(data[i].children, level, key);
			}
		}
		let ertuLevel = loopData(layouts, 1, key);
		return ertuLevel;
	},

	getCurrentPageOrController(layout, level, index) {
		let current = layout.children;
		while(--level !== 0) {
			current = current.children;
		}
	},

	getControllerByKey(state, controller) {

	},

	removeControllerByKey(state, key) {
		var activePage = layoutAction.getActivePage(state),
			activePageChildren = activePage.children;

		var loopControllers = function(activePageChildren) {

			for (var i = 0; i < activePageChildren.length; i++) {
				var controller = activePageChildren[i];

				if(controller.children) {
					loopControllers(controller.children);
				}

				if(controller.key == key) {
					activePageChildren.splice(i, 1);
					return controller;
				}
			};

		}

		loopControllers(activePageChildren);

	}
}

export default {
	namespace: 'designer',
	state: {

		loaded: false,

		modalTabsVisible: false,
		modalCSSEditorVisible: false,

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
				isClassName: true,
				isHTML: false,
				_value: ''
			},

			_id: {
				attrName: 'id',
				title: 'id',
				type: 'input',
				isClassName: false,
				isHTML: false,
				isSetAttribute: true,
				_value: ''
			},

			style: {
				attrName: 'style',
				title: '内联样式',
				type: 'input',
				isClassName: false,
				isStyle: true,
				isHTML: false,
				_value: ''
			},

			hidden: {
				attrName: 'hidden',
				title: '隐藏',
				type: 'toggle',
				isClassName: false,
				isHTML: false,
				isSetAttribute: true,
				_value: false
			}
		},

		publicEvents: [

		],

		layout: [

			{
				name: '应用',
				type: 'page',
				key: 'page-app',
				attr: {

					pages: {
						type: 'app_select',
						attrType: '',
						isClassName: false,
						title: '页面',
						value: ['templates/index'],
						_value: 'templates/index'
					},

					title: {
						type: 'input',
						attrType: 'text',
						title: '页面名称',
						isClassName: false,
						isHTML: false,
						'_value': '应用'
					},

					cssEditor: {
						type: 'button',
						title: '编辑CSS',
						isClassName: false,
						isHTML: true,
						_value: '打开编辑器',
						onClick: 'designer/showCSSEditor',
						params: {
							key: 'page-app'
						}
					},

					css: {
						type: 'input',
						title: 'css',
						isClassName: false,
						isHTML: false,
						_value: `@import 'style/weui.wxss';

page {
	background-color: #F8F8F8;
	font-size: 16px;
	font-family: -apple-system-font,Helvetica Neue,Helvetica,sans-serif;
}

.page__hd {
	padding: 40px;
}

.page__bd {
	padding-bottom: 40px;
}

.page__bd_spacing {
	padding-left: 15px;
	padding-right: 15px;
}

.page__ft {
	padding-bottom: 10px;
	text-align: center;
}

.page__title {
	text-align: left;
	font-size: 20px;
	font-weight: 400;
}

.page__desc {
	margin-top: 5px;
	color: #888888;
	text-align: left;
	font-size: 14px;
}

.weui-vcode-img {
    width: 108px;
}`,
						backend: true
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
								_value: '#f8f8f8',
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
								_value: '微信小程序',
								isClassName: false
							},

							backgroundColor: {
								type: 'input',
								attrType: 'color',
								title: '背景颜色',
								_value: '#f8f8f8',
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

					tabBar: {
						type: 'children',
						title: '底部菜单栏配置',
						isClassName: false,
						_value: {

							useTabBar: {
								type: 'toggle',
								title: '启用',
								isClassName: false,
								isHTML: false,
								_value: false,
								onChange: 'designer/toggleTabBar'
							},

							color: {
								type: 'input',
								attrType: 'color',
								title: '文本颜色',
								isClassName: false,
								isHTML: false,
								_value: '#999999',
								backend: true
							},

							selectedColors: {
								type: 'input',
								attrType: 'color',
								title: '选中颜色',
								isClassName: false,
								isHTML: false,
								_value: '#09BB07',
								backend: true
							},

							backgroundColor: {
								type: 'input',
								attrType: 'color',
								title: '背景色',
								isClassName: false,
								isHTML: false,
								_value: '#F7F7FA',
								backend: true
							},

							borderStyle: {
								type: 'select',
								title: '边框颜色',
								value: ['black', 'white'],
								isClassName: false,
								isHTML: false,
								_value: 'white',
								backend: true
							},

							position: {
								type: 'select',
								title: '位置',
								value: ['bottom', 'top'],
								isClassName: false,
								isHTML: false,
								_value: 'bottom',
								backend: true
							},

							list: {
								type: 'button',
								title: '菜单列表',
								isClassName: false,
								isHTML: false,
								backend: true,
								value: [{
									pagePath: {
										type: 'select',
										title: '页面路径',
										value: ['templates/index'],
										isClassName: false,
										isHTML: false,
										_value: 'templates/index'
									},

									text: {
										type: 'input',
										attrType: 'text',
										title: '菜单名称',
										value: ['templates/index'],
										isClassName: false,
										isHTML: false,
										_value: '菜单'
									},

									iconPath: {
										type: 'input',
										attrType: 'text',
										title: '图片路径(<=40kb)',
										value: ['page-home'],
										isClassName: false,
										isHTML: false,
										_value: 'http://i64.tinypic.com/2a9711u.png'
									},

									selectedIconPath: {
										type: 'input',
										attrType: 'text',
										title: '选中时图片路径(<=40kb)',
										value: ['page-home'],
										isClassName: false,
										isHTML: false,
										_value: 'http://i64.tinypic.com/2a9711u.png'
									}
								}, {
									pagePath: {
										type: 'select',
										title: '页面路径',
										value: ['templates/index'],
										isClassName: false,
										isHTML: false,
										_value: 'templates/index'
									},

									text: {
										type: 'input',
										attrType: 'text',
										title: '菜单名称',
										value: ['templates/index'],
										isClassName: false,
										isHTML: false,
										_value: '菜单2'
									},

									iconPath: {
										type: 'input',
										attrType: 'text',
										title: '图片路径(<=40kb)',
										value: ['page-home'],
										isClassName: false,
										isHTML: false,
										_value: 'http://i64.tinypic.com/2a9711u.png'
									},

									selectedIconPath: {
										type: 'input',
										attrType: 'text',
										title: '选中时图片路径(<=40kb)',
										value: ['page-home'],
										isClassName: false,
										isHTML: false,
										_value: 'http://i64.tinypic.com/2a9711u.png'
									}
								}],
								_value: '添加',
								onClick: 'designer/handleEnableTabs'
							}

						}
					},

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
						key: 'page-home',
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

							setAsMainPage: {
								type: 'toggle',
								title: '主界面(不可更改)',
								isClassName: false,
								isHTML: false,
								_value: true,
								disabled: true,
								checkedChildren: '真',
								unCheckedChildren: '假'
							},

							cssEditor: {
								type: 'button',
								title: '编辑CSS',
								isClassName: false,
								isHTML: true,
								_value: '打开编辑器',
								onClick: 'designer/showCSSEditor',
								params: {
									key: 'page-home'
								}
							},

							alias: {
								type: 'input',
								attrType: 'text',
								title: '页面别名',
								isClassName: false,
								isHTML: false,
								_value: 'index'
							},

							navigationBarBackgroundColor: {
								type: 'input',
								attrType: 'color',
								title: '头背景色',
								_value: '#f8f8f8',
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
								_value: '微信小程序',
								isClassName: false
							},

							backgroundColor: {
								type: 'input',
								attrType: 'color',
								title: '背景颜色',
								_value: '#f8f8f8',
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
								isClassName: false,
								_value: true
							},

							routingURL: {
								type: 'span',
								title: '路由',
								isClassName: false,
								isHTML: true,
								_value: 'templates/index'
							},

							template: {
								type: 'input',
								attrType: 'text',
								title: '模版',
								isClassName: false,
								isHTML: true,
								_value: '\
									<div class="page__hd"></div> \
									<div class="page__bd"></div> \
									<div class="page__ft"></div> \ ',
								backend: true
							},

							css: {
								type: 'input',
								title: 'css',
								isClassName: false,
								isHTML: false,
								_value: '/* CSS */',
								backend: true
							}

						},

						children: [{
								name: '头部',
								type: 'hd',
								key: 'hd-123',
								attr: {},
								tag: 'div',
								baseClassName: 'page__hd',
								backend: true,
								_value: ''
							}, {
								name: '中部',
								type: 'bd',
								key: 'bd-123',
								attr: {
									spacing: {
										type: 'toggle',
										title: '开启内边距',
										value: ['page__bd_spacing'],
										isClassName: true,
										isHTML: false,
										isSingleToggleClass: true,
										_value: false
									}
								},
								tag: 'div',
								baseClassName: 'page__bd',
								backend: true,
								_value: ''
							}, {
								name: '底部',
								type: 'ft',
								key: 'ft-123',
								attr: {},
								tag: 'div',
								baseClassName: 'page__ft',
								backend: true,
								_value: ''
							}
						]

					},

				]
			}

		],

		layoutState: {
			activePage: {
				index: 0,
				key: 'page-home',
				level: 2
			},

			activeController: {
				index: 0,
				key: '',
				level: 3
			},

			activeKey: 'page-home',
			activeType: 'page',
			expandedKeys: ['page-home']
		},

		controllersList: [
			// {
			// 	name: '按钮组',
			// 	type: 'button-bar',
			// 	attr: {}
			// },

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
								_value: '#f8f8f8',
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
								_value: '微信小程序',
								isClassName: false
							},

							backgroundColor: {
								type: 'input',
								attrType: 'color',
								title: '背景颜色',
								_value: '#f8f8f8',
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

					tabBar: {
						type: 'children',
						title: '底部菜单栏配置',
						isClassName: false,
						_value: {

							useTabBar: {
								type: 'toggle',
								title: '启用',
								isClassName: false,
								isHTML: false,
								_value: false,
								onChange: 'designer/toggleTabBar'
							},

							color: {
								type: 'input',
								attrType: 'color',
								title: '文本颜色',
								isClassName: false,
								isHTML: false,
								_value: '#999999',
								backend: true
							},

							selectedColors: {
								type: 'input',
								attrType: 'color',
								title: '选中颜色',
								isClassName: false,
								isHTML: false,
								_value: '#09BB07',
								backend: true
							},

							backgroundColor: {
								type: 'input',
								attrType: 'color',
								title: '背景色',
								isClassName: false,
								isHTML: false,
								_value: '#F7F7FA',
								backend: true
							},

							borderStyle: {
								type: 'select',
								title: '边框颜色',
								value: ['black', 'white'],
								isClassName: false,
								isHTML: false,
								_value: 'white',
								backend: true
							},

							position: {
								type: 'select',
								title: '位置',
								value: ['bottom', 'top'],
								isClassName: false,
								isHTML: false,
								_value: 'bottom',
								backend: true
							},

							list: {
								type: 'button',
								title: '菜单列表',
								isClassName: false,
								isHTML: false,
								backend: true,
								value: [{
									pagePath: {
										type: 'select',
										title: '页面路径',
										value: ['templates/index'],
										isClassName: false,
										isHTML: false,
										_value: 'templates/index'
									},

									text: {
										type: 'input',
										attrType: 'text',
										title: '菜单名称',
										value: ['templates/index'],
										isClassName: false,
										isHTML: false,
										_value: '菜单1'
									},

									iconPath: {
										type: 'input',
										attrType: 'text',
										title: '图片路径(<=40kb)',
										value: ['page-home'],
										isClassName: false,
										isHTML: false,
										_value: ''
									},

									selectedIconPath: {
										type: 'input',
										attrType: 'text',
										title: '选中时图片路径(<=40kb)',
										value: ['page-home'],
										isClassName: false,
										isHTML: false,
										_value: ''
									}
								}, {
									pagePath: {
										type: 'select',
										title: '页面路径',
										value: ['templates/index'],
										isClassName: false,
										isHTML: false,
										_value: 'templates/index'
									},

									text: {
										type: 'input',
										attrType: 'text',
										title: '菜单名称',
										value: ['templates/index'],
										isClassName: false,
										isHTML: false,
										_value: '菜单2'
									},

									iconPath: {
										type: 'input',
										attrType: 'text',
										title: '图片路径(<=40kb)',
										value: ['page-home'],
										isClassName: false,
										isHTML: false,
										_value: ''
									},

									selectedIconPath: {
										type: 'input',
										attrType: 'text',
										title: '选中时图片路径(<=40kb)',
										value: ['page-home'],
										isClassName: false,
										isHTML: false,
										_value: ''
									}
								}],
								_value: '添加',
								onClick: 'designer/handleEnableTabs'
							}

						}
					},

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

					setAsMainPage: {
						type: 'toggle',
						title: '主界面(不可更改)',
						isClassName: false,
						isHTML: false,
						_value: false,
						disabled: true,
						checkedChildren: '真',
						unCheckedChildren: '假'
					},

					cssEditor: {
						type: 'button',
						title: '编辑CSS',
						isClassName: false,
						isHTML: true,
						_value: '打开编辑器',
						onClick: 'designer/showCSSEditor',
						params: {}
					},

					alias: {
						type: 'input',
						attrType: 'text',
						title: '页面别名',
						isClassName: false,
						isHTML: false,
						_value: ''
					},

					navigationBarBackgroundColor: {
						type: 'input',
						attrType: 'color',
						title: '头背景色',
						_value: '#f8f8f8',
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
						_value: '微信小程序',
						isClassName: false
					},

					backgroundColor: {
						type: 'input',
						attrType: 'color',
						title: '背景颜色',
						_value: '#f8f8f8',
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
					},

					routingURL: {
						type: 'span',
						title: '路由',
						isClassName: false,
						isHTML: true,
						_value: ''
					},

					template: {
						type: 'input',
						attrType: 'text',
						title: '模版',
						isClassName: false,
						isHTML: true,
						_value: '\
								<div class="page__hd"></div> \
								<div class="page__bd"></div> \
								<div class="page__ft"></div> \ ',
						backend: true
					},

					css: {
						type: 'input',
						title: 'css',
						isClassName: false,
						isHTML: false,
						_value: '/* CSS */',
						backend: true
					}

				},
				backend: true
			},
			{
				name: '容器',
				type: 'container',
				attr: {
					height: {
						type: 'input',
						title: '高度',
						isStyle: true,
						isDesignerStyle: true,
						_value: '100px'
					},

					isContainer: {
						type: 'toggle',
						backend: true,
						isContainer: true,
						title: '是否是容器'
					},

					type: {
						type: 'select',
						title: '容器类型',
						isClassName: true,
						isNoConflict: true,
						_value: 'weui-cells',
						value: ['weui-cells', 'weui-cells_radio', 'weui-cells_checkbox', 'weui-cells_form']
					}
				},
				tag: ['div'],
				baseClassName: 'weui-cells',
				children: []
			},
			{
				name: 'Flex布局',
				type: 'card',
				attr: {
					height: {
						type: 'input',
						title: '高度',
						isStyle: true,
						_value: '100px'
					}
				},
				tag: ['div'],
				baseClassName: 'weui-flex',
				children: [{
					name: '布局组1',
					type: 'flex-item',
					children: [],
					tag: ['div'],
					baseClassName: 'weui-flex__item',
					attr: {}
				}, {
					name: '布局组2',
					type: 'flex-item',
					children: [],
					tag: ['div'],
					baseClassName: 'weui-flex__item',
					attr: {}
				}, {
					name: '布局组3',
					type: 'flex-item',
					children: [],
					tag: ['div'],
					baseClassName: 'weui-flex__item',
					attr: {}
				}]
			},
			{
				name: '按钮',
				type: 'button',
				attr: {
					value: {
						type: 'input',
						attrType: 'text',
						title: '值',
						isClassName: false,
						isHTML: true,
						_value: '按钮'
					},
					class: {
						type: 'select',
						title: '按钮类型',
						value: ['weui-btn_primary', 'weui-btn_default', 'weui-btn_warn', 'weui-btn_plain-default', 'weui-btn_plain-primary', 'weui-vcode-btn'],
						isClassName: true,
						isHTML: false,
						isNoConflict: true,
						_value: 'weui-btn_primary',
						backend: true
					},
					disabled: {
						type: 'toggle',
						title: '禁止',
						value: ['weui-btn_disabled', 'weui-btn_plain-disabled'],
						isClassName: true,
						isHTML: false,
						isSetAttribute: true,
						_value: false
					},
					type: {
						type: 'select',
						title: '按钮类型',
						value: ['primary', 'default', 'warn'],
						isClassName: true,
						isHTML: false,
						isNoConflict: true,
						isNeedPrefixClass: true,
						prefixClassValue: 'weui-btn_',
						_value: 'primary'
					},
					size: {
						type: 'select',
						title: '按钮大小',
						value: ['default', 'mini'],
						isClassName: true,
						isHTML: false,
						isSingleToggleClass: true,
						isToggleButtonSize: true,
						isNeedPrefixClass: true,
						prefixClassValue: 'weui-btn_',
						_value: 'default'
					},
					plain: {
						type: 'toggle',
						title: '镂空',
						value: ['default', 'primary'],
						isClassName: true,
						isSingleToggleClass: true,
						isNeedPrefixClass: true,
						prefixClassValue: 'weui-btn_plain-',
						isHTML: false,
						isNoConflict: true,
						_value: false
					},
					loading: {
						type: 'toggle',
						title: '加载中',
						isClassName: false,
						isHTML: true,
						isNeedAppend: true,
						appendBefore: true,
						value: '',
						_value: false
					},
					'form-type': {
						type: 'select',
						title: '表单类型',
						isClassName: false,
						isHTML: false,
						isSetAttribute: true,
						isFormType: true,
						value: ['submit', 'reset'],
						_value: ''
					},
					'hover-class': {
						type: 'input',
						attrType: 'text',
						title: '点击态类',
						isClassName: false,
						isSetAttribute: true,
						isHTML: false,
						value: [],
						_value: 'button-hover'
					},
					'hover-start-time': {
						type: 'input',
						attrType: 'number',
						title: '点击态出现时间',
						value: [],
						isClassName: false,
						isSetAttribute: true,
						isHTML: false,
						_value: 50
					},
					'hover-stay-time': {
						type: 'input',
						attrType: 'number',
						title: '点击态保留时间',
						value: [],
						isClassName: false,
						isSetAttribute: true,
						isHTML: false,
						_value: 400
					}
				},
				tag: 'button',
				weui: 'button',
				baseClassName: 'weui-btn'
			},
			{
				name: '表单',
				type: 'form',
				attr: {
					error: {
						type: 'toggle',
						isClassName: true,
						isSingleToggleClass: true,
						title: '是否报错',
						_value: false,
						value: ['weui-cell_warn']
					},

					isContainer: {
						type: 'toggle',
						backend: true,
						isContainer: true,
						title: '是否是容器'
					},

					height: {
						type: 'input',
						backend: true,
						_value: 'auto',
						title: '容器高度'
					}
				},
				baseClassName: 'weui-cells weui-cells_form',
				tag: 'div',
				children: [{
					baseClassName: 'weui-cell weui-cell_switch',
					tag: 'div',
					type: 'div',
					attr: {},
					name: '表单项一',
					children: [{
						baseClassName: 'weui-cell__bd',
						tag: 'div',
						attr: {
							label: {
								isHTML: true,
								isClassName: false,
								isSetAttribute: false,
								title: '提示信息',
								type: 'input',
								_value: '标题文字'
							},

							isComponent: {
								backend: true,
								value: [],
								title: '是否为完整的组件',
								_value: true
							},

							display: {
								type: 'toggle',
								title: '显示',
								_value: true,
								value: ['none', 'block'],
								isStyle: true,
								isToggleStyle: true
							},

							selfAdaption: {
								title: '自适应',
								type: 'toggle',
								isSingleToggleClass: true,
								isClassName: true,
								isHTML: false,
								isSetAttribute: false,
								value: ['weui_cell_primary'],
								_value: false
							}
						},
						type: 'div',
						name: '提示信息'
					}, {
						baseClassName: 'weui-cell__ft',
						tag: 'div',
						type: 'div',
						attr: {
							selfAdaption: {
								title: '自适应',
								type: 'toggle',
								isSingleToggleClass: true,
								isClassName: true,
								isHTML: false,
								isSetAttribute: false,
								value: ['weui_cell_primary'],
								_value: false
							},

							isComponent: {
								backend: true,
								value: [],
								title: '是否为完整的组件',
								_value: true
							},

							display: {
								type: 'toggle',
								title: '显示',
								_value: true,
								value: ['none', 'block'],
								isStyle: true,
								isToggleStyle: true
							}

						},
						name: '表单项尾部',
						children: [{
							baseClassName: 'weui-switch',
							tag: 'input',
							type: 'input',
							attr: {
								checked: {
									type: 'toggle',
									title: '默认',
									isSetAttribute: true,
									isClassName: false,
									isHTML: false,
									_value: true
								},

								isComponent: {
									backend: true,
									value: [],
									title: '是否为完整的组件',
									_value: true
								},

								type: {
									title: '类型',
									type: 'input',
									isSetAttribute: true,
									isHTML: false,
									isClassName: false,
									_value: 'checkbox',
									backend: true
								}
							},
							name: '开关',
						}]
					}]
				}, {
					baseClassName: 'weui-cell weui-cell_input',
					tag: 'div',
					type: 'weui-cell',
					attr: {
						error: {
							type: 'toggle',
							isClassName: true,
							isSingleToggleClass: true,
							title: '是否报错',
							_value: false,
							value: ['weui-cell_warn']
						}
					},
					name: '表单项二',
					children: [{
						tag: 'div',
						baseClassName: 'weui-cell__hd',
						type: 'weui-cell_hd',
						attr: {
							selfAdaption: {
								title: '自适应',
								type: 'toggle',
								isSingleToggleClass: true,
								isClassName: true,
								isHTML: false,
								isSetAttribute: false,
								value: ['weui_cell_primary'],
								_value: false
							},

							isComponent: {
								backend: true,
								value: [],
								title: '是否为完整的组件',
								_value: true
							},

							display: {
								type: 'toggle',
								title: '显示',
								_value: true,
								value: ['none', 'block'],
								isStyle: true,
								isToggleStyle: true
							}

						},
						name: '表单项头部',
						children: [{
							name: '提示信息',
							tag: 'label',
							baseClassName: 'weui-label',
							type: 'weui-label',
							attr: {
								value: {
									type: 'input',
									title: '提示信息',
									isClassName: false,
									isHTML: true,
									_value: 'qq'
								},

								isComponent: {
									backend: true,
									value: [],
									title: '是否为完整的组件',
									_value: true
								},

							}
						}]
					}, {
						tag: 'div',
						baseClassName: 'weui-cell__bd',
						type: 'weui-cell__bd',
						attr: {
							selfAdaption: {
								title: '自适应',
								type: 'toggle',
								isSingleToggleClass: true,
								isClassName: true,
								isHTML: false,
								isSetAttribute: false,
								value: ['weui_cell_primary'],
								_value: false
							},

							isComponent: {
								backend: true,
								value: [],
								title: '是否为完整的组件',
								_value: true
							},

							display: {
								type: 'toggle',
								title: '显示',
								_value: true,
								value: ['none', 'block'],
								isStyle: true,
								isToggleStyle: true
							}

						},
						name: '标单项中部',
						children: [{
							tag: 'input',
							baseClassName: 'weui-input',
							name: '输入框',
							type: 'weui-input',
							attr: {
								placeholder: {
									type: 'input',
									isSetAttribute: true,
									title: '占位符',
									_value: '请输入qq号'
								},
								value: {
									type: 'input',
									isSetAttribute: true,
									title: '内容',
									isClassName: false,
									isHTML: false,
									_value: ''
								},
								isComponent: {
									backend: true,
									value: [],
									title: '是否为完整的组件',
									_value: true
								},
								type: {
									title: '输入框类型',
									isSetAttribute: true,
									type: 'select',
									value: ['number', 'color', 'range', 'text', 'datetime-local', 'date', 'password', 'email', 'tel'],
									_value: 'text'
								},
								pattern: {
									title: '正则',
									isSetAttribute: true,
									type: 'input',
									_value: ''
								}
							}
						}]
					}, {
						tag: 'div',
						baseClassName: 'weui-cell__ft',
						type: 'weui-cell__ft',
						attr: {
							selfAdaption: {
								title: '自适应',
								type: 'toggle',
								isSingleToggleClass: true,
								isClassName: true,
								isHTML: false,
								isSetAttribute: false,
								value: ['weui_cell_primary'],
								_value: false
							},

							isComponent: {
								backend: true,
								value: [],
								title: '是否为完整的组件',
								_value: true
							},

							display: {
								type: 'toggle',
								title: '显示',
								_value: false,
								value: ['none', 'block'],
								isStyle: true,
								isToggleStyle: true
							}

						},
						name: '标单项尾部',
						children: []
					}]
				}, {
					baseClassName: 'weui-cell weui-cell_input weui-cell_vcode',
					tag: 'div',
					type: 'div',
					attr: {
						error: {
							type: 'toggle',
							isClassName: true,
							isSingleToggleClass: true,
							title: '是否报错',
							_value: false,
							value: ['weui-cell_warn']
						}
					},
					name: '表单项三',
					children: [{
						tag: 'div',
						baseClassName: 'weui-cell__hd',
						type: 'div',
						attr: {
							selfAdaption: {
								title: '自适应',
								type: 'toggle',
								isSingleToggleClass: true,
								isClassName: true,
								isHTML: false,
								isSetAttribute: false,
								value: ['weui_cell_primary'],
								_value: false
							},

							isComponent: {
								backend: true,
								value: [],
								title: '是否为完整的组件',
								_value: true
							},

							display: {
								type: 'toggle',
								title: '显示',
								_value: true,
								value: ['none', 'block'],
								isStyle: true,
								isToggleStyle: true
							}

						},
						name: '表单项头部',
						children: [{
							name: '提示信息',
							tag: 'label',
							baseClassName: 'weui-label',
							attr: {
								value: {
									type: 'input',
									title: '提示信息',
									isClassName: false,
									isHTML: true,
									isSetAttribute: false,
									_value: '验证码'
								},

								isComponent: {
									backend: true,
									value: [],
									title: '是否为完整的组件',
									_value: true
								},
							}
						}]
					}, {
						tag: 'div',
						baseClassName: 'weui-cell__bd',
						type: 'div',
						attr: {
							selfAdaption: {
								title: '自适应',
								type: 'toggle',
								isSingleToggleClass: true,
								isClassName: true,
								isHTML: false,
								isSetAttribute: false,
								value: ['weui_cell_primary'],
								_value: false
							},

							isComponent: {
								backend: true,
								value: [],
								title: '是否为完整的组件',
								_value: true
							},

							display: {
								type: 'toggle',
								title: '显示',
								_value: true,
								value: ['none', 'block'],
								isStyle: true,
								isToggleStyle: true
							}

						},
						name: '表单项中部',
						children: [{
							tag: 'input',
							baseClassName: 'weui-input',
							name: '输入框三',
							type: 'input',
							attr: {
								placeholder: {
									type: 'input',
									isSetAttribute: true,
									isHTML: false,
									isClassName: false,
									title: '默认内容',
									_value: '请输入验证码'
								},
								isComponent: {
									backend: true,
									value: [],
									title: '是否为完整的组件',
									_value: true
								},
								value: {
									type: 'input',
									isSetAttribute: true,
									isClassName: false,
									isHTML: false,
									title: '内容',
									_value: ''
								},
								type: {
									title: '输入框类型',
									isSetAttribute: true,
									isHTML: false,
									isClassName: false,
									type: 'select',
									value: ['number', 'color', 'range', 'text', 'datetime-local', 'date', 'password', 'email', 'tel'],
									_value: 'text'
								},
								pattern: {
									title: '正则',
									isSetAttribute: true,
									isHTML: false,
									isClassName: false,
									type: 'input',
									_value: '[0-9]*'
								}
							}
						}]
					}, {
						tag: 'div',
						baseClassName: 'weui-cell__ft',
						type: 'div',
						attr: {
							selfAdaption: {
								title: '自适应',
								type: 'toggle',
								isSingleToggleClass: true,
								isClassName: true,
								isHTML: false,
								isSetAttribute: false,
								value: ['weui_cell_primary'],
								_value: false
							},

							isComponent: {
								backend: true,
								value: [],
								title: '是否为完整的组件',
								_value: true
							},

							display: {
								type: 'toggle',
								title: '显示',
								_value: true,
								value: ['none', 'block'],
								isStyle: true,
								isToggleStyle: true
							}

						},
						name: '表单项尾部',
						children: [{
							tag: 'img',
							baseClassName: 'weui-vcode-img',
							name: '验证码图片',
							type: 'img',
							attr: {
								src: {
									type: 'input',
									title: '图片地址',
									isSetAttribute: true,
									isHTML: false,
									isClassName: false,
									_value: './images/vcode.png'
								},

								isComponent: {
									backend: true,
									value: [],
									title: '是否为完整的组件',
									_value: true
								},
							}
						}]
					}]

				}, {
					name: '表单项四',
					baseClassName: 'weui-cell weui-cell_input weui-cell_warn',
					tag: 'div',
					type: 'div',
					attr: {
						error: {
							type: 'toggle',
							isClassName: true,
							isSingleToggleClass: true,
							title: '是否报错',
							_value: true,
							value: ['weui-cell_warn']
						}
					},
					children: [{
						name: '提示信息',
						tag: 'div',
						type: 'div',
						attr: {
							selfAdaption: {
								title: '自适应',
								type: 'toggle',
								isSingleToggleClass: true,
								isClassName: true,
								isHTML: false,
								isSetAttribute: false,
								value: ['weui_cell_primary'],
								_value: false
							},
							isComponent: {
								backend: true,
								value: [],
								title: '是否为完整的组件',
								_value: true
							},
						},
						baseClassName: 'weui-cell__hd',
						children: [{
							name: '提示信息',
							tag: 'label',
							baseClassName: 'weui-label',
							type: 'label',
							attr: {
								value: {
									type: 'input',
									title: '提示信息',
									isHTML: true,
									isSetAttribute: false,
									isClassName: false,
									_value: '卡号'
								},
								isComponent: {
									backend: true,
									value: [],
									title: '是否为完整的组件',
									_value: true
								},
							}
						}]
					}, {
						name: '输入框四',
						tag: 'div',
						type: 'div',
						attr: {
							selfAdaption: {
								title: '自适应',
								type: 'toggle',
								isSingleToggleClass: true,
								isClassName: true,
								isHTML: false,
								isSetAttribute: false,
								value: ['weui_cell_primary'],
								_value: false
							},
							isComponent: {
								backend: true,
								value: [],
								title: '是否为完整的组件',
								_value: true
							},
						},
						baseClassName: 'weui-cell-bd',
						children: [{
							name: '输入框四',
							tag: 'input',
							baseClassName: 'weui-input',
							type: 'input',
							attr: {
								placeholder: {
									isSetAttribute: true,
									type: 'input',
									_value: '卡号',
									title: '占位符'
								},
								isComponent: {
									backend: true,
									value: [],
									title: '是否为完整的组件',
									_value: true
								},
								type: {
									title: '输入框类型',
									isSetAttribute: true,
									type: 'select',
									value: ['number', 'color', 'range', 'text', 'datetime-local', 'date', 'password', 'email', 'tel'],
									_value: 'number'
								},
								value: {
									title: '内容',
									isSetAttribute: true,
									type: 'input',
									_value: ''
								},
								pattern: {
									title: '正则',
									isSetAttribute: true,
									type: 'input',
									_value: '[0-9]*'
								}
							},

						}]
					}, {
						name: '图标',
						tag: 'div',
						type: 'div',
						baseClassName: 'weui-cell__ft',
						attr: {
							selfAdaption: {
								title: '自适应',
								type: 'toggle',
								isSingleToggleClass: true,
								isClassName: true,
								isHTML: false,
								isSetAttribute: false,
								value: ['weui_cell_primary'],
								_value: false
							},
							isComponent: {
								backend: true,
								value: [],
								title: '是否为完整的组件',
								_value: true
							},
						},
						children: [{
							name: '图标',
							tag: 'i',
							type: 'i',
							baseClassName: '',
							attr:{
								iconClass: {
									title: '图标类型',
									type: 'select',
									value: ['weui-icon-success', 'weui-icon-success-circle', 'weui-icon-success-no-circle', 'weui-icon-info',
											'weui-icon-waiting', 'weui-icon-waiting-circle', 'weui-icon-circle', 'weui-icon-warn', 'weui-icon-download',
											'weui-icon-info-circle', 'weui-icon-cancel'
										   ],
									_value: 'weui-icon-warn',
									isClassName: true,
									isHTML: false,
									isSetAttribute: false,
									isNoConflict: true
								},
								isComponent: {
									backend: true,
									value: [],
									title: '是否为完整的组件',
									_value: true
								},
							}
						}]
					}]
				}, {
					name: '表单项五',
					type: 'div',
					tag: 'div',
					attr: {},
					baseClassName: 'weui-cell',
					children: [{
						baseClassName: 'weui-cell__bd',
						type: 'div',
						tag: 'div',
						attr: {},
						name: '文本域',
						children: [{
							type: 'textarea',
							tag: 'textarea',
							name: '文本域',
							attr: {
								placeholder: {
									isSetAttribute: true,
									type: 'input',
									_value: '请输入文本',
									title: '占位符',
								},
								value: {
									isHTML: true,
									type: 'input',
									_value: '',
									title: '内容',
								},
								rows: {
									isSetAttribute: true,
									type: 'input',
									_value: '5',
									title: '行数'
								},
								isComponent: {
									backend: true,
									value: [],
									title: '是否为完整的组件',
									_value: true
								},
							},
							baseClassName: 'weui-textarea'
						}, {
							type: 'div',
							tag: 'div',
							name: '计字器',
							attr: {
								hidden: {
									type: 'toggle',
									isSetAttribute: true,
									isContrary: true,
									_value: true,
									title: '计字器'
								},
								isComponent: {
									backend: true,
									value: [],
									title: '是否为完整的组件',
									_value: true
								},
							},
							baseClassName: 'weui-textarea-counter',
							children: [{
								type: 'span',
								tag: 'span',
								name: '已写字数',
								attr: {
									input: {
										isHTML: true,
										title: '已写字数',
										_value: 0,
										type: 'input'
									},
									isComponent: {
										backend: true,
										value: [],
										title: '是否为完整的组件',
										_value: true
									},
								},
								baseClassName: ''
							}, {
								type: 'span',
								tag: 'span',
								name: '最多字数',
								attr: {
									input: {
										isHTML: true,
										title: '最多字数',
										_value: '/200',
										type: 'input'
									},
									isComponent: {
										backend: true,
										value: [],
										title: '是否为完整的组件',
										_value: true
									},
								},
								baseClassName: ''
							}]
						}]
					}]
				}]
			},
			{
				name: '文本框',
				type: 'input',
				attr: {},
				tag: ['div'],
				baseClassName: 'weui-cell weui-cell_input',
				wrapper: '',
				children: [{
					name: '文本框头部',
					type: 'input',
					tag: ['div'],
					baseClassName: 'weui-cell__hd',
					children: [],
					attr: {
						display: {
							type: 'toggle',
							title: '显示',
							_value: false,
							value: ['none', 'block'],
							isStyle: true,
							isToggleStyle: true
						},
						isComponent: {
							backend: true,
							value: [],
							title: '是否为完整的组件',
							_value: true
						},
					}
				}, {
					name: '文本框中部',
					type: 'input',
					attr: {
						display: {
							type: 'toggle',
							title: '显示',
							_value: true,
							value: ['none', 'block'],
							isStyle: true,
							isToggleStyle: true
						},
						isComponent: {
							backend: true,
							value: [],
							title: '是否为完整的组件',
							_value: true
						}
					},
					tag: ['div'],
					baseClassName: 'weui-cell__bd',
					children: [{
						name: '文本框实体',
						type: 'input',
						tag: ['input'],
						baseClassName: 'weui-input',
						attr: {
							value: {
								type: 'input',
								title: '内容',
								isClassName: false,
								isHTML: false,
								isSetAttribute: true,
								_value: ''
							},
							disabled: {
								type: 'toggle',
								title: '禁用',
								value: [],
								isClassName: false,
								isSetAttribute: true,
								isHTML: false,
								_value: false
							},
							type: {
								type: 'select',
								title: '类型',
								isClassName: false,
								isHTML: false,
								isSetAttribute: true,
								value: ['text', 'number', 'idcard', 'digit'],
								_value: 'text'
							},
							placeholder: {
								type: 'input',
								title: '占位符',
								isClassName: false,
								isSetAttribute: true,
								isHTML: false,
								_value: '请输入文本'
							},
							'placeholder-style': {
								type: 'input',
								attrType: 'text',
								title: '占位符样式',
								isClassName: false,
								isSetAttribute: true,
								isHTML: false,
								_value: '',
								value: []
							},
							'placeholder-class': {
								type: 'input',
								attrType: 'text',
								title: '占位符样式类名',
								isClassName: false,
								isSetAttribute: true,
								isHTML: false,
								_value: '',
								value: []
							},
							maxlength: {
								type: 'input',
								attrType: 'number',
								title: '最大长度',
								isSetAttribute: true,
								_value: 140,
								value: []
							},
							'focus': {
								type: 'toggle',
								title: '自动聚焦',
								isSetAttribute: true,
								value: [],
								_value: false
							},
							isComponent: {
								backend: true,
								value: [],
								title: '是否为完整的组件',
								_value: true
							}
						}
					}]
				}, {
					name: '文本框尾部',
					type: 'input',
					tag: ['div'],
					baseClassName: 'weui-cell__ft',
					children: [],
					attr: {
						display: {
							type: 'toggle',
							title: '显示',
							_value: false,
							value: ['none', 'block'],
							isStyle: true,
							isToggleStyle: true
						},
						isComponent: {
							backend: true,
							value: [],
							title: '是否为完整的组件',
							_value: true
						}
					}
				}]
			},
			// {
			// 	baseClassName: 'weui-cell__bd',
			// 	type: 'div',
			// 	tag: 'div',
			// 	attr: {},
			// 	name: '文本域',
			// 	children: [{
			// 		type: 'textarea',
			// 		tag: 'textarea',
			// 		name: '文本域',
			// 		attr: {
			// 			placeholder: {
			// 				isSetAttribute: true,
			// 				type: 'input',
			// 				_value: '请输入文本',
			// 				title: '占位符',
			// 			},
			// 			value: {
			// 				isHTML: true,
			// 				type: 'input',
			// 				_value: '',
			// 				title: '内容',
			// 			},
			// 			rows: {
			// 				isSetAttribute: true,
			// 				type: 'input',
			// 				_value: '5',
			// 				title: '行数'
			// 			}
			// 		},
			// 		baseClassName: 'weui-textarea'
			// 	}, {
			// 		type: 'div',
			// 		tag: 'div',
			// 		name: '计字器',
			// 		attr: {
			// 			hidden: {
			// 				type: 'toggle',
			// 				isSetAttribute: true,
			// 				isContrary: true,
			// 				_value: true,
			// 				title: '计字器'
			// 			}
			// 		},
			// 		baseClassName: 'weui-textarea-counter',
			// 		children: [{
			// 			type: 'span',
			// 			tag: 'span',
			// 			name: '已写字数',
			// 			attr: {
			// 				input: {
			// 					isHTML: true,
			// 					title: '已写字数',
			// 					_value: 0,
			// 					type: 'input'
			// 				}
			// 			},
			// 			baseClassName: ''
			// 		}, {
			// 			type: 'span',
			// 			tag: 'span',
			// 			name: '最多字数',
			// 			attr: {
			// 				input: {
			// 					isHTML: true,
			// 					title: '最多字数',
			// 					_value: '/200',
			// 					type: 'input'
			// 				}
			// 			},
			// 			baseClassName: ''
			// 		}]
			// 	}]
			// },
			{
				type: 'textarea',
				tag: 'textarea',
				name: '文本域',
				attr: {
					placeholder: {
						isSetAttribute: true,
						type: 'input',
						_value: '请输入文本',
						title: '占位符',
					},

					value: {
						isHTML: true,
						type: 'input',
						_value: '',
						title: '内容',
					},

					disabled: {
						isHTML: false,
						isSetAttribute: true,
						type: 'toggle',
						_value: false,
						title: '是否禁用'
					},

					maxlength: {
						isSetAttribute: true,
						type: 'input',
						attrType: 'number',
						_value: 140,
						title: '字符限制'
					},

					'auto-focus': {
						isSetAttribute: true,
						type: 'toggle',
						_value: false,
						title: '自动聚焦'
					},

					focus: {
						isSetAttribute: true,
						type: 'toggle',
						_value: false,
						title: '获取焦点'
					},

					'auto-height': {
						isSetAttribute: true,
						type: 'toggle',
						_value: false,
						title: '自动增高'
					},

					fixed: {
						isSetAttribute: true,
						type: 'toggle',
						_value: false,
						title: '固定'
					},

					'cursor-spacing': {
						title: '光标与键盘的距离',
						type: 'input',
						attrType: 'number',
						_value: 0,
						isSetAttribute: true
					}
				},
				baseClassName: 'weui-textarea'
			},
			{
				name: '单选框',
				type: 'radio',
				tag: 'label',
				attr: {
					for: {
						type: 'input',
						title: '',
						isBoundToId: true,
						backend: true,
						isClassName: false,
						isHTML: false,
						isSetAttribute: true,
						_value: '',
						bindType: 'radio'
					},

					checked: {
						type: 'toggle',
						title: '是否选中',
						_value: false,
						isSetAttribute: true,
						isNotSetAttrSelf: true,
						value: []
					},

					disabled: {
						type: 'toggle',
						title: '禁用',
						_value: false,
						isSetAttribute: true,
						isNotSetToSelf: true,
						value: []
					},

					color: {
						type: 'input',
						title: '选中颜色',
						_value: '#09BB07',
						isStyle: true,
						isNotSetToSelf: true,
						setTo: '',
						value: []
					}

				},
				baseClassName: 'weui-cell weui-check__label',
				children: [{
					name: '单选框',
					type: 'div',
					tag: 'div',
					baseClassName: 'weui-cell__bd',
					attr: {
						label: {
							type: 'input',
							title: '单选框标题',
							isHTML: true,
							_value: '单选框',
						},
						isComponent: {
							backend: true,
							value: [],
							title: '是否为完整的组件',
							_value: true
						},
						selfAdaption: {
							title: '自适应',
							type: 'toggle',
							isSingleToggleClass: true,
							isClassName: true,
							isHTML: false,
							isSetAttribute: false,
							value: ['weui_cell_primary'],
							_value: false
						}
					}
				}, {
					name: '单选框',
					type: 'div',
					baseClassName: 'weui-cell__ft',
					tag: 'div',
					attr: {
						selfAdaption: {
							title: '自适应',
							type: 'toggle',
							isSingleToggleClass: true,
							isClassName: true,
							isHTML: false,
							isSetAttribute: false,
							value: ['weui_cell_primary'],
							_value: false
						},
						isComponent: {
							backend: true,
							value: [],
							title: '是否为完整的组件',
							_value: true
						}
					},
					children: [{
						name: '单选框',
						type: 'radio',
						tag: 'input',
						baseClassName: 'weui-check',
						attr: {
							type: {
								type: 'input',
								backend: true,
								title: '',
								_value: 'radio',
								isSetAttribute: true
							},
							name: {
								type: 'input',
								title: 'name属性',
								_value: 'radio',
								isSetAttribute: true
							},
							checked: {
								type: 'toggle',
								title: '选中',
								_value: true,
								isSetAttribute: true
							},
							isComponent: {
								backend: true,
								value: [],
								title: '是否为完整的组件',
								_value: true
							}
						}
					}, {
						name: '选中图标',
						type: 'i',
						tag: 'span',
						baseClassName: '',
						attr: {
							icon: {
								title: '选中图标',
								isClassName: true,
								_value: 'weui-icon-checked',
								type: 'select',
								value: ['weui-icon-success', 'weui-icon-success-circle', 'weui-icon-success-no-circle', 'weui-icon-info',
										'weui-icon-waiting', 'weui-icon-waiting-circle', 'weui-icon-circle', 'weui-icon-warn', 'weui-icon-download',
										'weui-icon-info-circle', 'weui-icon-cancel'
									   ],
								isNoConflict: true
							},
							isComponent: {
								backend: true,
								value: [],
								title: '是否为完整的组件',
								_value: true
							}
						}
					}]
				}]
			},
			{
				baseClassName: 'weui-cell weui-cell_switch',
				tag: 'div',
				type: 'toggle',
				attr: {},
				name: '开关',
				children: [{
					baseClassName: 'weui-cell__bd',
					tag: 'div',
					attr: {
						label: {
							isHTML: true,
							isClassName: false,
							isSetAttribute: false,
							title: '提示信息',
							type: 'input',
							_value: '开关'
						},
						selfAdaption: {
							title: '自适应',
							type: 'toggle',
							isSingleToggleClass: true,
							isClassName: true,
							isHTML: false,
							isSetAttribute: false,
							value: ['weui_cell_primary'],
							_value: false
						},
						isComponent: {
							backend: true,
							value: [],
							title: '是否为完整的组件',
							_value: true
						}
					},
					type: 'div',
					name: '提示信息'
				}, {
					baseClassName: 'weui-cell__ft',
					tag: 'div',
					type: 'div',
					attr: {
						selfAdaption: {
							title: '自适应',
							type: 'toggle',
							isSingleToggleClass: true,
							isClassName: true,
							isHTML: false,
							isSetAttribute: false,
							value: ['weui_cell_primary'],
							_value: false
						},
						isComponent: {
							backend: true,
							value: [],
							title: '是否为完整的组件',
							_value: true
						}
					},
					name: '开关',
					children: [{
						baseClassName: 'weui-switch',
						tag: 'input',
						type: 'input',
						attr: {
							checked: {
								type: 'toggle',
								title: '选中',
								isSetAttribute: true,
								isClassName: false,
								isHTML: false,
								_value: false
							},

							type: {
								title: '类型',
								type: 'input',
								isSetAttribute: true,
								isHTML: false,
								isClassName: false,
								_value: 'checkbox',
								backend: true
							},

							isComponent: {
								backend: true,
								value: [],
								title: '是否为完整的组件',
								_value: true
							},

							'background-color': {
								title: '开关颜色',
								type: 'input',
								attrType: 'color',
								isHTML: false,
								isClassName: false,
								isStyle: true,
								value: [],
								alias: 'color',
								_value: '#04be02'
							}
						},
						name: '开关',
					}]
				}]
			},
			// {
			// 	baseClassName: 'weui-switch',
			// 	tag: 'input',
			// 	type: 'toggle',
			// 	attr: {
			// 		checked: {
			// 			type: 'toggle',
			// 			title: '选中',
			// 			isSetAttribute: true,
			// 			isClassName: false,
			// 			isHTML: false,
			// 			_value: false
			// 		},

			// 		type: {
			// 			title: '类型',
			// 			type: 'select',
			// 			isSetAttribute: true,
			// 			isHTML: false,
			// 			isClassName: false,
			// 			_value: 'checkbox',
			// 			value: ['switch', 'checkbox'],
			// 			hidden: true
			// 		},

			// 		'background-color': {
			// 			title: '开关颜色',
			// 			type: 'input',
			// 			attrType: 'color',
			// 			isHTML: false,
			// 			isClassName: false,
			// 			isStyle: true,
			// 			value: [],
			// 			alias: 'color',
			// 			_value: '#04be02'
			// 		}
			// 	},
			// 	name: '开关',
			// },
			{
				name: '复选框',
				type: 'checkbox',
				tag: 'label',
				attr: {
					for: {
						type: 'input',
						title: '',
						isBoundToId: true,
						backend: true,
						isClassName: false,
						isHTML: false,
						isSetAttribute: true,
						_value: '',
						bindType: 'checkbox'
					}
				},
				baseClassName: 'weui-cell weui-check__label',
				children: [{
					name: '复选框',
					type: 'div',
					baseClassName: 'weui-cell__ft',
					tag: 'div',
					attr: {
						selfAdaption: {
							title: '自适应',
							type: 'toggle',
							isSingleToggleClass: true,
							isClassName: true,
							isHTML: false,
							isSetAttribute: false,
							value: ['weui_cell_primary'],
							_value: false
						},
						isComponent: {
							backend: true,
							value: [],
							title: '是否为完整的组件',
							_value: true
						}
					},
					children: [{
						name: '隐藏的输入框',
						type: 'checkbox',
						tag: 'input',
						baseClassName: 'weui-check',
						attr: {
							type: {
								type: 'input',
								backend: true,
								title: '',
								_value: 'checkbox',
								isSetAttribute: true
							},
							name: {
								type: 'input',
								title: 'name属性',
								_value: 'checkbox',
								isSetAttribute: true
							},
							checked: {
								type: 'toggle',
								title: '选中',
								_value: true,
								isSetAttribute: true
							},
							isComponent: {
								backend: true,
								value: [],
								title: '是否为完整的组件',
								_value: true
							}
						}
					}, {
						name: '选中图标',
						type: 'i',
						tag: 'i',
						baseClassName: '',
						attr: {
							icon: {
								title: '选中图标',
								isClassName: true,
								_value: 'weui-icon-checked',
								type: 'select',
								value: ['weui-icon-success', 'weui-icon-success-circle', 'weui-icon-success-no-circle', 'weui-icon-info',
										'weui-icon-waiting', 'weui-icon-waiting-circle', 'weui-icon-circle', 'weui-icon-warn', 'weui-icon-download',
										'weui-icon-info-circle', 'weui-icon-cancel'
									   ],
								isNoConflict: true
							},
							isComponent: {
								backend: true,
								value: [],
								title: '是否为完整的组件',
								_value: true
							}
						}
					}]
				}, {
					name: '复选框lable',
					type: 'div',
					tag: 'div',
					baseClassName: 'weui-cell__bd',
					attr: {
						label: {
							type: 'input',
							title: '复选框lable',
							isHTML: true,
							_value: '复选框',
						},
						selfAdaption: {
							title: '自适应',
							type: 'toggle',
							isSingleToggleClass: true,
							isClassName: true,
							isHTML: false,
							isSetAttribute: false,
							value: ['weui_cell_primary'],
							_value: false
						},
						isComponent: {
							backend: true,
							value: [],
							title: '是否为完整的组件',
							_value: true
						}
					}
				}]
			},
			{
				name: '滑块',
				type: 'range',
				attr: {
					value: {
						type: 'input',
						attrType: 'number',
						title: '当前取值',
						isClassName: false,
						isHTML: false,
						isSetWidth: true,
						_value: 0
					},

					min: {
						type: 'input',
						attrType: 'number',
						title: '最小值',
						isClassName: false,
						isHTML: false,
						isSetWidth: true,
						_value: 1
					},

					max: {
						type: 'input',
						attrType: 'number',
						title: '最大值',
						isClassName: false,
						isHTML: false,
						isSetWidth: true,
						_value: 100
					},

					step: {
						type: 'input',
						attrType: 'number',
						title: '步长',
						isClassName: false,
						isHTML: false,
						isSetWidth: true,
						_value: 1
					},

					'show-value': {
						type: 'toggle',
						title: '显示当前值',
						_value: false,
						isHTML: false
					}
				},
				tag: 'div',
				baseClassName: 'weui-slider-box',
				children: [{
					tag: 'div',
					type: 'slider',
					baseClassName: 'weui-slider',
					attr: {
						isComponent: {
							backend: true,
							value: [],
							title: '是否为完整的组件',
							_value: true
						}
					},
					name: '滑块_拖动区域',
					children: [{
						tag: 'div',
						name: '滑块内部',
						attr: {
							isComponent: {
								backend: true,
								value: [],
								title: '是否为完整的组件',
								_value: true
							}
						},
						type: 'slider',
						baseClassName: 'weui-slider__inner',
						children: [{
							tag: 'div',
							attr: {
								isComponent: {
									backend: true,
									value: [],
									title: '是否为完整的组件',
									_value: true
								}
							},
							type: 'slider',
							baseClassName: 'weui-slider__track',
							name: '滑动追踪器',
							children: []
						}, {
							tag: 'div',
							attr: {
								isComponent: {
									backend: true,
									value: [],
									title: '是否为完整的组件',
									_value: true
								}
							},
							type: 'slider',
							baseClassName: 'weui-slider__handler',
							name: '滑动条',
							children: []
						}]
					}]
				}, {
					tag: 'div',
					baseClassName: 'weui-slider-box__value',
					attr: {
						display: {
							type: 'toggle',
							title: '显示',
							_value: false,
							value: ['none', 'block'],
							isStyle: true,
							isToggleStyle: true
						},

						value: {
							type: 'input',
							title: '值',
							_value: 0,
							isHTML: true
						},

						isComponent: {
							backend: true,
							value: [],
							title: '是否为完整的组件',
							_value: true
						}
					},
					type: 'slider',
					name: '滑块_值显示区域'
				}]
			},
			{
				name: '选择框',
				type: 'select',
				attr: {},
				tag: 'div',
				baseClassName: 'weui weui-cell_select weui-cell_select-after',
				children: [{
					type: 'div',
					tag: 'div',
					baseClassName: 'weui-cell_hd',
					attr:{},
					name: '选择框label',
					children: [{
						type: 'label',
						name: 'label',
						tag: 'label',
						baseClassName: 'weui-label',
						attr: {
							value: {
								title: 'label文本',
								type: 'input',
								isHTML: true,
								_value: '选一个'
							},
							isComponent: {
								backend: true,
								value: [],
								title: '是否为完整的组件',
								_value: true
							}
						}
					}]
				}, {
					type: 'div',
					tag: 'div',
					name: '选项',
					attr: {
						number: {
							title: '选项个数',
							type: 'input',
							_value: 3
						}
					},
					baseClassName: 'weui-cell__bd',
					children: [{
						attr: {
							isComponent: {
								backend: true,
								value: [],
								title: '是否为完整的组件',
								_value: true
							}
						},
						tag: 'select',
						type: 'select',
						baseClassName: 'weui-select',
						name: '选择select',
						children: [{
							tag: 'option',
							type: 'option',
							name: '选择option',
							attr: {
								value: {
									isSetAttribute: true,
									type: 'input',
									title: 'value值',
									_value: '1'
								},
								isComponent: {
									backend: true,
									value: [],
									title: '是否为完整的组件',
									_value: true
								}
							},
							baseClassName: ''
						}]
					}]
				}]
			},
			{
				name: '进度条',
				type: 'list-item-divider',
				tag: 'div',
				baseClassName: 'weui-progress',
				isWeappComponent: true,
				attr: {

					'percent': {
						type: 'input',
						attrType: 'number',
						title: '进度(%)',
						_value: '50',
						value: [],
						isSetAttribute: true,
						isComponentAttr: true,
						componentInfo: {
							attr: 'width',
							index: 0,
							level: 2
						}
					},

					'stroke-width': {
						type: 'input',
						attrType: 'number',
						title: '线宽',
						_value: '6',
						value: [],
						isSetAttribute: true,
						isComponentAttr: true,
						componentInfo: {
							attr: 'height',
							index: 0,
							level: 1
						}
					},

					'show-info': {
						type: 'toggle',
						title: '显示进度',
						_value: true,
						value: [],
						isSetAttribute: true,
						isComponentAttr: true,
						componentInfo: {
							attr: 'display',
							index: 1,
							level: 1
						}
					},

					'color': {
						type: 'input',
						attrType: 'color',
						title: '进度条颜色',
						_value: '#09BB07',
						value: [],
						isSetAttribute: true,
						isComponentAttr: true,
						componentInfo: {
							attr: 'background-color',
							index: 0,
							level: 2
						}
					},

				},
				children: [{
					name: '进度外围',
					tag: 'a',
					type: 'progress',
					baseClassName: 'weui-progress__bar',
					attr: {
						height: {
							type: 'input',
							attrType: 'number',
							title: '线宽',
							_value: '6',
							value: [],
							isStyle: true
						},
						isComponent: {
							backend: true,
							value: [],
							title: '是否为完整的组件',
							_value: true
						}
					},
					children: [{
						name: '进度滚动',
						tag: 'div',
						type: 'progress',
						baseClassName: 'weui-progress__inner-bar js_progress',
						attr: {
							width: {
								type: 'input',
								title: '进度(%)',
								_value: '50',
								value: [],
								isStyle: true,
								isPercent: true
							},
							'background-color': {
								type: 'input',
								attrType: 'color',
								title: '进度条颜色',
								_value: '#09BB07',
								value: [],
								alias: 'color',
								isStyle: true
							},
							isComponent: {
								backend: true,
								value: [],
								title: '是否为完整的组件',
								_value: true
							}
						}
					}]
				}, {
					name: '进度显示区域',
					tag: 'a',
					type: 'progress',
					baseClassName: 'weui-progress__opr',
					attr: {
						display: {
							type: 'toggle',
							title: '显示',
							_value: true,
							value: ['none', 'block'],
							isStyle: true,
							isToggleStyle: true
						},
						isComponent: {
							backend: true,
							value: [],
							title: '是否为完整的组件',
							_value: true
						}
					},
					children: [{
						name: '停止按钮',
						tag: 'i',
						type: 'progress',
						baseClassName: 'weui-icon-cancel',
						attr: {
							isComponent: {
								backend: true,
								value: [],
								title: '是否为完整的组件',
								_value: true
							}
						}
					}]
				}]
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
						_value: '底部说明'
					}
				}
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
						_value: '标题内容'
					}
				}
			},
			{
				name: '头菜单',
				type: 'header',
				attr: {},
				tag: 'div',
				baseClassName: 'weui-tab',
				children: [{
					type: 'div',
					tag: 'div',
					name: 'navbar',
					baseClassName: 'weui-navbar',
					attr: {},
					children: [{
						type: 'div',
						tag: 'div',
						name: '选项一',
						baseClassName: 'weui-navbar__item weui-bar__item_on',
						attr: {
							value: {
								isHTML: true,
								type: 'input',
								_value: '选项一',
								title: '选项一标题'
							}
						}
					}, {
						type: 'div',
						tag: 'div',
						name: '选项二',
						baseClassName: 'weui-navbar__item',
						attr: {
							value: {
								isHTML: true,
								type: 'input',
								_value: '选项二',
								title: '选项二标题'
							}
						}
					}, {
						type: 'div',
						tag: 'div',
						name: '选项三',
						baseClassName: 'weui-navbar__item',
						attr: {
							value: {
								isHTML: true,
								type: 'input',
								_value: '选项三',
								title: '选项三标题'
							}
						}
					}]
				}]
			},
			{
				name: '页脚',
				type: 'footer',
				tag: 'div',
				baseClassName: 'weui-footer',
				attr: {
					footerText: {
						isRander: true,
						type: 'toggle',
						_value: true,
						title: '是否有链接'
					},
					footerLink: {
						isRander: true,
						type: 'toggle',
						_value: true,
						title: '是否有文字'
					}
				},
				children: [{
					name: '页脚文字',
					isRander: 'footerText',
					type: 'p',
					tag: 'p',
					baseClassName: 'weui-footer__text',
					attr: {
						value: {
							type: 'input',
							isHTML: true,
							title: '文字内容',
							_value: 'Copyright &copy; 2008-2016 weui.io'
						}
					}
				}, {
					name: '页脚链接',
					isRander: 'footerLink',
					type: 'p',
					tag: 'p',
					baseClassName: 'weui-footer__links',
					attr:{},
					children: [{
						tag: 'a',
						type: 'a',
						name: '链接一',
						baseClassName: 'weui-footer__link',
						attr: {
							href: {
								isSetAttribute: true,
								title: '链接地址',
								type: 'input',
								_value: '#'
							},
							value: {
								isHTML: true,
								title: '内容',
								type: 'input',
								_value: '底部链接'
							}
						}
					}, {
						tag: 'a',
						type: 'a',
						name: '链接二',
						baseClassName: 'weui-footer__link',
						attr: {
							href: {
								isSetAttribute: true,
								title: '链接地址',
								type: 'input',
								_value: '#'
							},
							value: {
								isHTML: true,
								title: '内容',
								type: 'input',
								_value: '底部链接'
							}
						}
					}]
				}]
			},
			{
				name: '段落',
				type: 'markdown',
				attr: {
					value: {
						isHTML: true,
						type: 'input',
						_value: '文章内容',
						title: '内容'
					}
				},
				tag: 'article',
				baseClassName: 'weui-article',
			},
			{
				name: '图片',
				type: 'image',
				tag: 'div',
				baseClassName: '',
				attr: {
					'background-image': {
						isStyle: true,
						type: 'input',
						_value: '',
						title: '图片路径(<=40kb)'
					},
					'background-position': {
						isStyle: true,
						type: 'select',
						value: ['top left', 'top center', 'top right',
								'center left', 'center center', 'center right',
								'bottom left', 'bottom center', 'bottom right'],
						_value: 'center center',
						title: '图片起始位置'
					},
					'background-repeat': {
						isStyle: true,
						type: 'select',
						value: ['reprat', 'reprat-x', 'reprat-y', 'no-repeat'],
						_value: 'reprat',
						title: '图片重复方式'
					},
					'background-size': {
						isStyle: true,
						type: 'input',
						title: '裁剪方式(cover,contain,百分比,像素)',
						_value: 'cover'
					}
				}
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
						_value: false
					},

					title: {
						_value: '列表正文',
						type: 'input',
						isClassName: false,
						isHTML: false,
						title: '名称'
					}
				},
				tag: 'div',
				baseClassName: 'weui-cell',
				children: [{
					tag: 'div',
					baseClassName: 'weui-cell__hd',
					name: '列表头部',
					type: 'weui-cell__hd',
					attr: {
						useImage: {
							type: 'toggle',
							title: '使用图片',
							isClassName: false,
							value: [''],
							isHTML: false,
							_value: false
						},

						title: {
							_value: '列表正文头部',
							type: 'input',
							isClassName: false,
							isHTML: false,
							title: '名称'
						}
					},
					children: []
				}, {
					tag: 'div',
					baseClassName: 'weui-cell__bd',
					attr: {

						title: {
							_value: '列表标题文字',
							type: 'input',
							isClassName: false,
							isHTML: false,
							title: '名称'
						}

					},
					name: '列表正文',
					type: 'weui-cell__bd',
					children: [{
						tag: 'p',
						baseClassName: '',
						name: '列表标题文字',
						type: 'p',
						attr: {
							content: {
								type: 'input',
								title: '文本内容',
								isHTML: true,
								isClassName: false,
								_value: '列表标题文字'
							},

							title: {
								_value: '列表标题文字',
								type: 'input',
								isClassName: false,
								isHTML: false,
								title: '名称'
							}

						}
					}]
				}, {
					tag: 'div',
					baseClassName: 'weui-cell__ft',
					type: 'weui-cell__ft',
					attr: {
						title: {
							_value: '列表标题文字',
							type: 'input',
							isClassName: false,
							isHTML: false,
							title: '名称'
						}
					},
					name: '列表底部',
					children: [{
						tag: 'span',
						baseClassName: '',
						name: '说明文字',
						type: 'span',
						attr: {
							content: {
								type: 'input',
								isHTML: true,
								isClassName: false,
								_value: '说明文字',
								title: '内容'
							},

							title: {
								_value: '列表标题文字',
								type: 'input',
								isClassName: false,
								isHTML: false,
								title: '名称'
							}

						},
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
				name: '代码',
				type: 'html',
				attr: {}
			},
			{
				name: '搜索框',
				type: 'search',
				baseClassName: 'weui-search-bar',
				attr: {},
				tag: 'div',
				children: [{
					type: 'form',
					tag: 'form',
					name: '搜索form',
					baseClassName: 'weui-search-bar__form',
					attr: {},
					children: [{
						type: 'div',
						tag: 'div',
						name: '搜索box',
						baseClassName: 'weui-search-bar__box',
						attr: {},
						children: [{
							type: 'i',
							tag: 'i',
							name: '图标',
							baseClassName: '',
							attr: {
								icon: {
									title: '图标',
									isClassName: true,
									_value: 'weui-icon-search',
									type: 'select',
									value: ['weui-icon-success', 'weui-icon-success-circle', 'weui-icon-success-no-circle', 'weui-icon-info',
											'weui-icon-waiting', 'weui-icon-waiting-circle', 'weui-icon-circle', 'weui-icon-warn', 'weui-icon-download',
											'weui-icon-info-circle', 'weui-icon-cancel'
										   ],
									isNoConflict: true
								}
							}
						}, {
							type: 'input',
							baseClassName: 'weui-search-bar__input',
							name: '搜索input',
							tag: 'input',
							attr: {
								placeholder: {
									title: '占位符',
									type: 'input',
									isSetAttribute: true,
									_value: '搜索'
								}
							}
						}, {
							type: 'a',
							tag: 'a',
							baseClassName: 'weui-icon-clear',
							name: '清空button',
							attr: {
								herf: {
									isSetAttribute: true,
									_value: 'javascript:',
									title: '清空动作',
									type: 'input'
								}
							},
						}]
					}, {
						type: 'label',
						tag: 'lable',
						name: '搜索按钮区域',
						attr: {},
						baseClassName: 'weui-search-bar__label',
						children: [{
							type: 'i',
							tag: 'i',
							baseClassName: '',
							name: '图标',
							attr: {
								icon: {
									title: '图标',
									isClassName: true,
									_value: 'weui-icon-search',
									type: 'select',
									value: ['weui-icon-success', 'weui-icon-success-circle', 'weui-icon-success-no-circle', 'weui-icon-info',
											'weui-icon-waiting', 'weui-icon-waiting-circle', 'weui-icon-circle', 'weui-icon-warn', 'weui-icon-download',
											'weui-icon-info-circle', 'weui-icon-cancel'
										   ],
									isNoConflict: true
								}
							}
						}, {
							name: '提示文本',
							tag: 'span',
							type: 'span',
							baseClassName: '',
							attr: {
								value: {
									title: '提示文本',
									type: 'input',
									isHTML: true,
									_value: '搜索'
								}
							}
						}]
					}]
				}, {
					type: 'a',
					tag: 'a',
					baseClassName: 'weui-search-bar__cancel-btn',
					attr: {
						href: {
							isSetAttribute: true,
							type: 'input',
							title: '取消动作',
							_value: 'javascript:'
						},
						value: {
							isHTML: true,
							type: 'input',
							title: '取消文本',
							_value: '取消'
						}
					},
					name: '取消'
				}]
			},
			{
				name: '幻灯片',
				type: 'slider',
				tag: 'div',
				attr: {
					number: {
						type: 'input',
						title: '图片数量',
						_value: '3'
					},
					display: {
						type: 'input',
						title: '',
						_value: 'block',
						isStyle: true,
						backend: true
					}
				},
				baseClassName: 'weui-gallery',
				children: [{
					tag: 'span',
					type: 'span',
					name: '图片',
					baseClassName: 'weui-gallery_img',
					attr: {
						'background-image': {
							isStyle: true,
							_value: '',
							type: 'input',
							title: '图片地址'
						}
					}
				}]
			},
			{
				name: '空白分割',
				type: 'spacer',
				tag: 'div',
				baseClassName: '',
				attr: {
					height: {
						isStyle: true,
						_value: '50px',
						title: '空白分割高度',
						type: 'input'
					},
					width: {
						isStyle: true,
						backend: true,
						_value: '100%',
						title: '',
						type: 'input'
					},
					border: {
						isStyle: true,
						_value: '1px dashed gray',
						title: '',
						type: 'input',
						backend: true
					}
				}
			},
			{
				name: '页头',
				type: 'hd',
				attr: {},
				tag: 'div',
				baseClassName: 'page__hd',
				backend: true
			},
			{
				name: '页脚',
				type: 'ft',
				attr: {},
				tag: 'div',
				baseClassName: 'page__ft',
				backend: true
			},
			{
				name: '页体',
				type: 'bd',
				attr: {},
				tag: 'div',
				baseClassName: 'page__bd',
				backend: true
			},
			{
				name: '视频',
				type: 'video',
				tag: 'video',
				attr: {
					src: {
						isSetAttribute: true,
						_value: '',
						title: '资源地址',
						type: 'input'
					},
					controls: {
						isSetAttribute: true,
						_value: true,
						title: '是否现实默认控件',
						type: 'toggle'
					},
					autoplay: {
						isSetAttribute: true,
						_value: false,
						title: '自动播放',
						type: 'toggle'
					},
					'danmu-btn': {
						isSetAttribute: true,
						_value: false,
						title: '弹幕按钮',
						type: 'toggle'
					},
					'enable-danmu': {
						isSetAttribute: true,
						_value: false,
						title: '显示弹幕',
						type: 'toggle'
					},
					'objectFit': {
						isSetAttribute: true,
						_value: 'contain',
						value: ['contain', 'cover', 'fill'],
						type: 'select',
						title: '容器与视频大小不一致时表现形式'
					}
				}
			},
			{
				name: '音频',
				type: 'audio',
				tag: 'audio',
				attr: {
					src: {
						isSetAttribute: true,
						_value: '',
						title: '资源地址',
						type: 'input'
					},
					loop: {
						isSetAttribute: true,
						_value: false,
						title: '是否循环',
						type: 'toggle'
					},
					controls: {
						isSetAttribute: true,
						_value: true,
						title: '默认控件',
						type: 'toggle'
					},
					poster: {
						isSetAttribute: true,
						_value: true,
						title: '封面图片(必须用默认控件)',
						type: 'input'
					},
					name: {
						isSetAttribute: true,
						_value: '未知音频',
						type: 'input',
						title: '音频名字'
					},
					author: {
						isSetAttribute: true,
						_value: '未知作者',
						type: 'input',
						title: '音频作者'
					}
				}
			},
			{
				name: '图标',
				type: 'i',
				tag: 'span',
				baseClassName: '',
				attr: {
					icon: {
						title: '图标',
						isClassName: true,
						_value: 'weui-icon-checked',
						type: 'select',
						value: ['weui-icon-success', 'weui-icon-success-circle', 'weui-icon-success-no-circle', 'weui-icon-info',
								'weui-icon-waiting', 'weui-icon-waiting-circle', 'weui-icon-circle', 'weui-icon-warn', 'weui-icon-download',
								'weui-icon-info-circle', 'weui-icon-cancel'
							   ],
						isNoConflict: true
					}
				}
			},
			{
				name: '画布',
				type: 'canvas',
				tag: 'canvas',
				baseClassName: '',
				attr: {
					'disable-scroll': {
						title: '在画布上移动时禁止屏幕滚动',
						type: 'toggle',
						_value: 'false',
						isSetAttribute: 'true'
					},
					height: {
						title: '高度',
						type: 'input',
						_value: '225px',
						isSetAttribute: true
					},
					width: {
						title: '宽度',
						type: 'input',
						_value: '300x',
						isSetAttribute: true
					}
				}
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
	      		dispatch({
	      			type: 'attachPublicAttrToAll'
	      		});
	      	});
		}

	},

	effects: {

		*fakePageSelected({payload: params}, {call, put, select}) {
			yield put({
				type: 'handleCtrlSelected'
			});
		}

	},

	reducers: {

		attachPublicAttrToAll(state) {

			var publicAttrs = state.publicAttrs,
				allControllers = state.controllersList;

			for (var i = 0; i < allControllers.length; i++) {
				var controller = allControllers[i],
					baseClassName = controller.baseClassName,
					attrs = controller.attr;

				for(var key in publicAttrs) {
					attrs[key] = publicAttrs[key];
				}

				attrs.class._value = baseClassName;

			};

			return {...state};
		},

		handleDesignerClosed(state) {
			state.loaded = false;
			window.gospelDesignerPreviewer = undefined;
			return {...state};
		},

		handleLayoutLoaded(state, { payload: params }) {
			state.loaded = true;

			gospelDesigner.postMessage({
				layoutLoaded: {
					layout: state.layout,
					layoutState: state.layoutState
				}
			}, '*');

			computeDomHeight.leftSidebarWhenLoaded();

			return {...state};
		},

		handlePreviewerLayoutLoaded(state) {
			gospelDesignerPreviewer.postMessage({
				previewerLayoutLoaded: {
					layout: state.layout,
					layoutState: state.layoutState
				}
			}, '*');

			return {...state};
		},

		handleDeviceSelected(state, { payload: key }) {
			state.defaultDevice = key;
			return {...state};
		},

		addPage(state, { payload: page }) {
			var page = page || layoutAction.getController(state.controllersList, 'page');

			let tmpAttr = {};
			tmpAttr = layoutAction.deepCopyObj(page.attr, tmpAttr);

			tmpAttr['title']['_value'] = page.name;
			tmpAttr['title']['type'] = 'input';
			tmpAttr['title']['isClassName'] = false;
			tmpAttr['title']['isHTML'] = false;
			tmpAttr['title']['title'] = '页面名称';

			tmpAttr['routingURL']['_value'] = 'templates/pages/page-' + state.layout[0].children.length
			+ '/page-1' + state.layout[0].children.length;
			tmpAttr['alias']['_value'] = 'page-' + state.layout[0].children.length;

			//设置新增加的页面和应用整体的值相同
			tmpAttr['navigationBarTitleText']['_value'] = state.layout[0].attr.window._value.navigationBarTitleText._value;
			tmpAttr['navigationBarBackgroundColor']['_value'] = state.layout[0].attr.window._value.navigationBarBackgroundColor._value;
			tmpAttr['backgroundColor']['_value'] = state.layout[0].attr.window._value.backgroundColor._value;
			tmpAttr['backgroundTextStyle']['_value'] = state.layout[0].attr.window._value.backgroundTextStyle._value;
			tmpAttr['enablePullDownRefresh']['_value'] = state.layout[0].attr.window._value.enablePullDownRefresh._value;
			tmpAttr['navigationBarTextStyle']['_value'] = state.layout[0].attr.window._value.navigationBarTextStyle._value;

			//加路由后在应用的路由选项里进行配置
			state.layout[0].attr.pages.value.push(tmpAttr['routingURL']['_value']);

			var pageRandomString = randomString(8, 10);
			//设置CSSEditor被打开后需要传的参数（key = [page.key]）
			tmpAttr['cssEditor']['params']['key'] = 'page-' + pageRandomString;

			var tmpPage = {
				type: 'page',
				key: 'page-' + pageRandomString,
				isLeaf: false,
				attr: tmpAttr,
				children: [{
					name: '头部',
					type: 'hd',
					key: 'hd-' + pageRandomString,
					attr: {},
					tag: 'div',
					baseClassName: 'page__hd',
					backend: true,
					_value: ''
				}, {
					name: '中部',
					type: 'bd',
					key: 'bd-' + pageRandomString,
					attr: {
						spacing: {
							type: 'toggle',
							title: '开启内边距',
							value: ['page__bd_spacing'],
							isClassName: true,
							isHTML: false,
							isSingleToggleClass: true,
							_value: false
						}
					},
					tag: 'div',
					baseClassName: 'page__bd',
					backend: true,
					_value: ''
				}, {
					name: '底部',
					type: 'ft',
					key: 'ft-' + pageRandomString,
					attr: {},
					tag: 'div',
					baseClassName: 'page__ft',
					backend: true,
					_value: ''
				}]
			}

			state.layout[0].children.push(tmpPage);
			layoutAction.setActivePage(state.layoutState, state.layout[0].children.length - 1, tmpPage.key, 2);
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
				left: proxy.event.clientX,
				top: proxy.event.clientY,
			}}
		},

		deleteConstruction(state,{payload: params}) {

			if (params.activeType == 'page') {
				layoutAction.setActivePage(state.layoutState, params.activeIndex, params.activeKey, params.activeLevel);
				gospelDesignerPreviewer.postMessage({
					pageRemoved: {
						data: params.parentCtrl.children[params.deleteIndex],
						index: params.deleteIndex
					}
				}, '*');
			}else {

				gospelDesignerPreviewer.postMessage({
					ctrlRemoved: params.parentCtrl.children[params.deleteIndex]
				}, '*');

				layoutAction.setActiveController(state.layoutState, params.activeIndex, params.activeKey, params.activeLevel);
			}

			params.parentCtrl.children.splice(params.deleteIndex, 1);

			computeDomHeight.leftSidebarWhenLoaded();

			return {...state};
		},

		addController(state, { payload: ctrlAndTarget }) {

			if (state.layoutState.activePage.level == 1) {
				message.error('请在左上角组件树中选择一个页面');
				return {...state};
			}

			let controller = ctrlAndTarget.ctrl,
				targetId = ctrlAndTarget.target,
				activePage = layoutAction.getActivePage(state),
				deepCopiedController = layoutAction.deepCopyObj(controller);

			const loopAttr = (controller) => {

				var childCtrl = {},
					tmpAttr = {},
					ctrl = {};

				tmpAttr = controller.attr;
				tmpAttr['title'] = {};
				tmpAttr['title']['_value'] = controller.name;
				tmpAttr['title']['type'] = 'input';
				tmpAttr['title']['isClassName'] = false;
				tmpAttr['title']['isHTML'] = false;
				tmpAttr['title']['title'] = '名称';

				ctrl = {
					type: controller.type,
					key: controller.type + '-' + randomString(8, 10),
					attr: tmpAttr,
					tag: controller.tag,
					baseClassName: controller.baseClassName,
					children: [],
					isRander: controller.isRander || ''
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

			var tmpCtrl = loopAttr(deepCopiedController);

			gospelDesignerPreviewer.postMessage({
    			ctrlAdded: {
    				controller: tmpCtrl,
    				page: activePage
    			}
			}, '*');

    		if (targetId) {
    			let parentCtrl = layoutAction.getCtrlByKey(state.layout[0], targetId);
    			parentCtrl.children = parentCtrl.children || [];
    			parentCtrl.children.push(tmpCtrl);
    			state.layoutState.expandedKeys.push(targetId);    				
    		}else {
    			activePage.children.push(tmpCtrl);
    		}

			let level = layoutAction.getCurrentLevelByKey(state.layout, tmpCtrl.key);
			layoutAction.setActiveController(state.layoutState, activePage.children.length - 1, tmpCtrl.key, level);

			computeDomHeight.leftSidebarWhenLoaded();

			return {...state};
		},

		removeController(state, { payload: controller }) {
			layoutAction.removeControllerByKey(state, controller.key);

			computeDomHeight.leftSidebarWhenLoaded();
			return {...state};
		},

		handleTreeChanged(state, { payload: params }) {
			if(params.type == 'page') {
				let level = layoutAction.getCurrentLevelByKey(state.layout, params.key);
				var pageIndex = layoutAction.getPageIndexByKey(state.layout, params.key, level);
				layoutAction.setActivePage(state.layoutState, pageIndex, params.key, level);

				// gospelDesignerPreviewer.postMessage({
				// 	pageSelected: layoutAction.getActivePage(state)
				// }, '*');
			}else {
				var activePage = layoutAction.getActivePage(state),
					activeCtrllvlAndIndex = layoutAction.getControllerIndexAndLvlByKey(state, params.key, activePage),
					controllerIndex = activeCtrllvlAndIndex.index,
					level = activeCtrllvlAndIndex.level;

				layoutAction.setActiveController(state.layoutState, controllerIndex, params.key, level);
			}
			return {...state};
		},

		handlelinkedComponentChange(state, { payload: params }) {

			var activePage = layoutAction.getActivePage(state);

			if(params.type == 'controller') {
	      		var linkedCtrl = layoutAction.getActiveControllerByKey(activePage.children, params.key);
	      		linkedCtrl.attr[params.attrName]['_value'] = params.newVal;
			}

			return {...state};
		},

		handleAttrRefreshed (state, { payload: params }) {
			var activePage = layoutAction.getActivePage(state);

    		if(!gospelDesigner) {
    			message.error('请先打开编辑器！');
    			return {...state};
    		}

    		if(state.layoutState.activeType == 'page') {

	    		gospelDesigner.postMessage({
	    			attrRefreshed: activePage
	    		}, '*');

	    		gospelDesignerPreviewer.postMessage({
	    			attrRefreshed: activePage
	    		}, '*');
    		}

    		if(state.layoutState.activeType == 'controller') {
    			var activeCtrl = layoutAction.getActiveControllerByKey(activePage.children, state.layoutState.activeController.key);
	    		gospelDesignerPreviewer.postMessage({
	    			ctrlAttrRefreshed: {
	    				controller: activeCtrl,
	    				page: activePage
	    			}
	    		}, '*');
    		}
    		return {...state};
		},

		handlePageAliasChanged (state, { payload: params}) {
			var activePage = layoutAction.getActivePage(state);
			activePage.attr.routingURL._value = 'templates/pages/' + params.newVal + '/' + params.newVal;

			state.layout[0].attr.pages.value = [];

			var pageList = state.layout[0].children;

			for (var i = 0; i < pageList.length; i++) {
				var page = pageList[i];
				state.layout[0].attr.pages.value.push(page.attr.routingURL._value);
			};

			return {...state};
		},

		handleEnableTabs (state, { payload: enabled }) {
			state.modalTabsVisible = true;
			return {...state};
		},

		handleCtrlSelected (state) {
			var activePage = layoutAction.getActivePage(state);

    		if(!gospelDesigner) {
    			message.error('请先打开编辑器！');
    			return false;
    		}

    		if(state.layoutState.activeType == 'page') {
	    		gospelDesignerPreviewer.postMessage({
	    			pageSelected: activePage
	    		}, '*');

	    		gospelDesigner.postMessage({
	    			attrRefreshed: activePage
	    		}, '*');

    		}

    		if(state.layoutState.activeType == 'controller') {
    			var activeCtrl = layoutAction.getActiveControllerByKey(activePage.children, state.layoutState.activeController.key);

	    		gospelDesignerPreviewer.postMessage({
	    			ctrlSelected: activeCtrl
	    		}, '*');
    		}
    		return {...state};

		},

		handlePageAdded (state) {
			var activePage = layoutAction.getActivePage(state);

	    		var gospelDesigner = window.frames['gospel-designer'];

	    		if(!gospelDesigner) {
	    			message.error('请先打开编辑器！')
	    			return false;
	    		}

	    		if(state.layoutState.activeType == 'page') {

		    		gospelDesignerPreviewer.postMessage({
		    			pageAdded: activePage
		    		}, '*');

	    		}

	    		if(state.layoutState.activeType == 'controller') {
	    			var activeCtrl = layoutAction.getActiveControllerByKey(activePage.children, state.layoutState.activeController.key);

		    		gospelDesignerPreviewer.postMessage({
		    			pageAdded: activeCtrl
		    		}, '*');
	    		}

	    		computeDomHeight.leftSidebarWhenLoaded();
	    		return {...state};

		},

		handleAttrFormChange(state, { payload: params }) {
			var activePage = layoutAction.getActivePage(state);

			if(state.layoutState.activeType == 'page') {
				if (params.parentAtt) {
					activePage.attr[params.parentAtt.attrName]['_value'][params.attrName]['_value'] = params.newVal;
				}else {
					activePage.attr[params.attrName]['_value'] = params.newVal;
				}
			}

			if(state.layoutState.activeType == 'controller') {
	      		var activeCtrl = layoutAction.getActiveControllerByKey(activePage.children, state.layoutState.activeController.key);

	      		activeCtrl.attr[params.attrName]['_value'] = params.newVal;

			}
			return {...state};
		},

		attrChangeFromDrag(state, { payload: params }) {
			for(let i = 0; i < params.changeId.length; i ++) {
				let activeCtrl = layoutAction.getCtrlByKey(state.layout[0], params.changeId[i]);
				activeCtrl.attr[params.changeAttr[i]]._value = params.changeValue[i];
			}
			return {...state};
		},

		ctrlExchanged(state, {payload: params}) {

			for(let i = 0; i < params.changeType.length; i ++) {

				let exchCtrl = layoutAction.getCtrlParentAndIndexByKey(state.layout[0], params.exchElementId[i]),
					dragCtrl = layoutAction.getCtrlParentAndIndexByKey(state.layout[0], params.dragElementId[i]);

				let type = params.changeType[i];

				if (type == 'outPrev') {
					let ctrl = dragCtrl.parentCtrl.children.splice(dragCtrl.index, 1)[0];
					exchCtrl.parentCtrl.children.splice(exchCtrl.index, 0, ctrl);
				}else if (type == 'outNext') {
					let ctrl = dragCtrl.parentCtrl.children.splice(dragCtrl.index, 1)[0];
					exchCtrl.parentCtrl.children.splice(exchCtrl.index + 1, 0, ctrl);
				}else if (type == 'appendPrev') {
					let ctrl = dragCtrl.parentCtrl.children.splice(dragCtrl.index, 1)[0];
					exchCtrl.thisCtrl.children = exchCtrl.thisCtrl.children || [];
					exchCtrl.thisCtrl.children.push(ctrl);
				}else if (type == 'prependNext') {
					let ctrl = dragCtrl.parentCtrl.children.splice(dragCtrl.index, 1)[0];
					exchCtrl.thisCtrl.children = exchCtrl.thisCtrl.children || [];
					exchCtrl.thisCtrl.children.unshift(ctrl);
				}else {
					let ctrl = dragCtrl.parentCtrl.children.splice(dragCtrl.index, 1,
									exchCtrl.parentCtrl.children[exchCtrl.index])[0];
					exchCtrl.parentCtrl.children[exchCtrl.index] = ctrl;
				}

			}


			return {...state};
		},

		initState(state, { payload: params }){
			state.layout = params.UIState.layout;
			state.layoutState = params.UIState.layoutState;
			state.defaultDevice = params.UIState.defaultDevice;
			return {...state};
		},

		hideCSSEditor(state, { payload: params }) {
			state.modalCSSEditorVisible = false;
			return {...state};
		},

		showCSSEditor(state, { payload: params }) {
			state.modalCSSEditorVisible = true;
			return {...state};
		},

		handleCSSEditorSaved(state, { payload: value }) {
			var activePage = layoutAction.getActivePage(state);
			activePage.attr.css._value = value;

			gospelDesignerPreviewer.postMessage({
				CSSUpdated: {
					page: activePage
				}
			}, '*');

			return {...state};
		},

		toggleTabBar(state, { payload: checked }) {
			var appAttr = state.layout[0].attr,
				tabBarAttr = appAttr.tabBar._value;

			for(var key in tabBarAttr) {
				if(key != 'useTabBar') {
					var currentAttr = tabBarAttr[key];
					currentAttr.backend = !checked;
				}
			}

			gospelDesignerPreviewer.postMessage({
				toggleTabBar: {
					checked: checked,
					tabBar: tabBarAttr
				}
			}, '*');

			return {...state};
		}

	}

}
