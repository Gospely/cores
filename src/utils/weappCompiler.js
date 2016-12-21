import request from './request.js';

const weappCompiler = {
	layout: {},

	app: {},

	init (layout) {
		this.layout = layout;
		return this;
	},

	compile () {
		console.log('==============================================weappCompiler==============================================')

		let app = {},
			appPages = {},
			self = this;

		console.log(self.layout);

		app['app.json'] = self.compileAPPJSON({ string: true });
		app['app.js'] = self.getAppjs();
		app['app.wxss'] = self.compilePageWXSS({ page: self.layout[0] });

		let mainPage = this.compilePage(this.getMainPage());

		app['pages'] = {
			pages: this.compilePages(this.getPageExceptMainPage())
		};

		for(var key in mainPage) {
			app['pages'][key] = mainPage[key];
		}

		console.log(app);

		self.app = app;

		console.log('==============================================weappCompiler==============================================')
		return false;
	},

	compileAPPJSON (options) {

		options.string = options.string || false;

		const appJSONOriginSource = this.layout[0].attr;
		let appJSON = {};

		const loopAPPJSON = (appJSONOriginSource, parentKey, _appJSON) => {
			var appJSON = {};
			for (var key in appJSONOriginSource) {
				const currAttr = appJSONOriginSource[key];
				if(this.filter(key)) {
					if(currAttr.type != 'children') {
						appJSON[key] = currAttr._value;
						if(parentKey) {
							if(parentKey == 'tabBar' && key == 'list') {
								var tabList = currAttr.value;
								_appJSON[parentKey][key] = [];
								for (var i = 0; i < tabList.length; i++) {
									var tab = tabList[i];
									_appJSON[parentKey][key].push({
										pagePath: tab.pagePath._value,
										text: tab.text._value,
										iconPath: tab.iconPath._value,
										selectedIconPath: tab.selectedIconPath._value 
									});
								};
							}else {
								_appJSON[parentKey][key] = currAttr._value;								
							}
						}
					}else {
						const childAttr = currAttr._value;
						appJSON[key] = {};
						if(childAttr.useTabBar) {
							if(childAttr.useTabBar._value) {
								loopAPPJSON(childAttr, key, appJSON);								
							}
						}else {
							loopAPPJSON(childAttr, key, appJSON);
						}
					}
				}
			}
			return appJSON;
		}

		appJSON = loopAPPJSON(appJSONOriginSource);

		return options.string ? JSON.stringify(appJSON) : appJSON;
	},

	compilePageJSON (options) {
		options.string = options.string || false;

		var pageJSON = {};

		for (var attrName in options.page.attr) {
			if(this.filter(attrName)) {
				pageJSON[attrName] = options.page.attr[attrName]._value;
			}
		}

		return options.string ? JSON.stringify(pageJSON) : pageJSON;
	},

	compilePageWXML (options) {
		var pageWXML = '',

			page = options.page,

			reflectTable = {
				div: 'view',
			},

			pageBaseTpl = $('<view class="page"></view>'),

			getPageBaseTpl = (template) => {
				return '<view class="page">' + template + '</view>';
			},

			controllers = page.children,

			loopController = function(controller, parent) {
				var 
					tag = typeof controller.tag == 'string' ? controller.tag : controller.tag[0],

					weappTag = reflectTable[tag];

					if(!weappTag) {
						weappTag = controller.tag;
					}

				var	elem = $(document.createElement(weappTag)),

					attrs = controller.attr

					if(controller.baseClassName) {
						elem.addClass(controller.baseClassName);
					}

	                if(controller.children && controller.children.length > 0) {

	                    for (var i = 0; i < controller.children.length; i++) {
	                        var currentCtrl = controller.children[i],

	                            loopComponent = loopController(currentCtrl, elem),

	                            jqComponent = $(parent);

	                        jqComponent.append($(loopComponent));

	                    };

	                }

                return elem;
			}

			for (var i = 0; i < controllers.length; i++) {
				var controller = controllers[i],
					elem = loopController(controller);

				pageBaseTpl.append(elem);
				console.log(elem);
			};

		console.log(pageBaseTpl.html(), page);

		pageWXML = getPageBaseTpl(pageBaseTpl.html());

		return pageWXML;
	},

	compilePageWXSS (options) {
		var pageWXSS = '';

		pageWXSS = options.page.attr.css._value;

		return pageWXSS;
	},

	getAppjs () {
		return "App({ \
		    onLaunch: function () { \
		        console.log('App Launch') \
		    }, \
		    onShow: function () { \
		        console.log('App Show') \
		    }, \
		    onHide: function () { \
		        console.log('App Hide') \
		    }, \
		    globalData: { \
		        hasLogin: false \
		    }\
		});";
	},

	getMainPage () {
		let pages = this.layout[0].children;

		for (var i = 0; i < pages.length; i++) {
			var page = pages[i];
			if(this.isMainPage(page)) {
				return page;
			}
		};
		return undefined;
	},

	isMainPage (page) {
		for (var attrName in page.attr) {
			let attr = page.attr[attrName];
			if(attrName == 'setAsMainPage') {
				if(attr._value) {
					return true;
				}
			}
		}
		return false;
	},

	getPageExceptMainPage () {
		let pages = this.layout[0].children,
			pagesExceptMainPage = [];

		for (var i = 0; i < pages.length; i++) {
			var page = pages[i];
			if(!this.isMainPage(page)) {
				pagesExceptMainPage.push(page);
			}
		};
		return pagesExceptMainPage;
	},

	compilePage (page) {

		var tmpPage = {},
			alias = page.attr.alias._value;

		tmpPage[alias + '.json'] = this.compilePageJSON({
			page: page,
			string: true
		});

		tmpPage[alias + '.js'] = 'Page({});';
		tmpPage[alias + '.wxml'] = this.compilePageWXML({
			page: page
		});
		tmpPage[alias + '.wxss'] = this.compilePageWXSS({
			page: page
		});

		return tmpPage;
	},

	compilePages (pages) {
		var pageList = {};
		for (var i = 0; i < pages.length; i++) {
			var page = pages[i];
			pageList[page.attr.alias._value] = this.compilePage(page);
		};
		return pageList;
	},

	filter (key) {
		const filterKey = ['title', 'alias', 'template', 'setAsMainPage', 'routingURL', 'css', 'cssEditor'];
		for (var i = 0; i < filterKey.length; i++) {
			var k = filterKey[i];
			if(key == k) {
				return false;
			}
		};
		return true;
	},

	//

	cloudPack: function *() {
		var self = this;
		var result = yield request('weapp/pack/', {
  			method: 'POST',
  			headers: {
				"Content-Type": "application/json;charset=UTF-8",
			},
  			body: JSON.stringify(self.app),
  		});

		if(result.data.code !== 200) {
			return false;
		}

		return result;
	},

	download (file) {
		window.open('http://api.gospely.com/weapp/download/' + file);
	}

}

export default weappCompiler;