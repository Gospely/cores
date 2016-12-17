const weappCompiler = {
	layout: {},

	init (layout) {
		this.layout = layout;
		return this;
	},

	compile () {
		console.log('==============================================weappCompiler==============================================')

		let app = {};

		console.log(this.layout);
		this.compileAPPJSON();
		console.log('==============================================weappCompiler==============================================')
		return false;
	},

	compileAPPJSON () {
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

		alert(JSON.stringify(appJSON));

		return appJSON;
	},

	filter (key) {
		const filterKey = ['title'];
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