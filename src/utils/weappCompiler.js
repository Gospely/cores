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
		return true;
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
						loopAPPJSON(childAttr, key, appJSON);
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
		var pageWXML = '';



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
			page: page,
			string: true
		});
		tmpPage[alias + '.wxss'] = this.compilePageWXSS({
			page: page,
			string: true
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
		const filterKey = ['title', 'alias', 'template', 'setAsMainPage', 'routingURL', 'css'];
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