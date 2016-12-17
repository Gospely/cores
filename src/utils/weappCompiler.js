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
		app['app.wxss'] = self.getWXSS();

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
		options.string = options.string || false;

		var pageWXML = {};



		return options.string ? JSON.stringify(pageWXML) : pageWXML;
	},

	compilePageWXSS () {

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

	getWXSS () {
		return "@import 'style/weui.wxss'; \
\
		page{ \
		    background-color: #F8F8F8; \
		    font-size: 16px; \
		    font-family: -apple-system-font,Helvetica Neue,Helvetica,sans-serif; \
		} \
		.page__hd { \
		    padding: 40px; \
		} \
		.page__bd { \
		    padding-bottom: 40px; \
		} \
		.page__bd_spacing { \
		    padding-left: 15px; \
		    padding-right: 15px; \
		} \
 \
		.page__ft{ \
		    padding-bottom: 10px; \
		    text-align: center; \
		} \
 \
		.page__title { \
		    text-align: left; \
		    font-size: 20px; \
		    font-weight: 400; \
		} \
 \
		.page__desc { \
		    margin-top: 5px; \
		    color: #888888; \
		    text-align: left; \
		    font-size: 14px; \
		}";
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
		tmpPage[alias + '.wxss'] = this.compilePageWXML({
			page: page,
			string: true
		});
		tmpPage[alias + '.wxml'] = '';

		return tmpPage;
	},

	compilePages (pages) {
		var pageList = [];
		for (var i = 0; i < pages.length; i++) {
			var page = pages[i];
			pageList.push(this.compilePage(page));
		};
		return pageList;
	},

	filter (key) {
		const filterKey = ['title', 'alias', 'template', 'setAsMainPage', 'routingURL', ''];
		for (var i = 0; i < filterKey.length; i++) {
			var k = filterKey[i];
			if(key == k) {
				return false;
			}
		};
		return true;
	},

	cloudPack: function *() {
		var self = this;
		var result = yield request('weapp/pack/', {
  			method: 'POST',
  			body: self.app
  		});

		if(result.code !== 200) {
			return false;
		}

		return result;
	},

	download () {

	}

}

export default weappCompiler;