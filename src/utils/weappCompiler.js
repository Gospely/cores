const weappCompiler = {
	layout: {},

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

		console.log(mainPage);

		app['pages'] = {
			'index.js': '',
			'index.json': '',
			'index.wxml': '',
			'index.wxss': '',
			pages: []
		};

		console.log(app);

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
			for (var attrName in page.attr) {
				let attr = page.attr[attrName];
				if(attrName = 'setAsMainPage') {
					if(attr._value) {
						return page;
					}
				}
			}
		};
		return undefined;
	},

	compilePage (page) {

		var page = {},
			alias = 'index';

		page[alias + '.json'] = this.compilePageJSON({
			page: page,
			string: true
		});

		page[alias + '.js'] = '';
		page[alias + '.wxss'] = '';
		page[alias + '.wxml'] = '';

		return page;
	},

	compilePages () {

	},

	filter (key) {
		const filterKey = ['title', 'alias', 'template', 'setAsMainPage', 'routingURL'];
		for (var i = 0; i < filterKey.length; i++) {
			var k = filterKey[i];
			if(key == k) {
				return false;
			}
		};
		return true;
	},

	cloudPack () {
		return false;
	},

	download () {

	}

}

export default weappCompiler;