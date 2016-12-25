import request from './request.js';

const weappCompiler = {
	layout: {},

	app: {},

	reflectTable: {
		img: 'gospel_image',
		a: 'navigator',
		input: 'gospel_input'
	},

	viewReflectTable: [
		'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'a',
        'abbr',
        'address',
        'applet',
        'acronym',
        'area',
        'article',
        'aside',
        'b',
        'base',
        'basefont',
        'bdi',
        'bdo',
        'big',
        'blockquote',
        'body',
        'br',
        'caption',
        'center',
        'cite',
        'code',
        'col',
        'colgroup',
        'command',
        'datalist',
        'dd',
        'del',
        'details',
        'dfn',
        'dir',
        'div',
        'dl',
        'dt',
        'em',
        'embed',
        'fieldset',
        'figcaption',
        'figure',
        'font',
        'footer',
        'form',
        'frame',
        'frameset',
        'head',
        'header',
        'hgroup',
        'hr',
        'html',
        'i',
        'ins',
        'keygen',
        'kbd',
        'label',
        'legend',
        'li',
        'link',
        'mark',
        'menu',
        'meta',
        'meter',
        'nav',
        'noframes',
        'noscript',
        'object',
        'ol',
        'optgroup',
        'option',
        'output',
        'p',
        'param',
        'pre',
        'progress',
        'q',
        'rp',
        'ruby',
        's',
        'samp',
        'script',
        'select',
        'small',
        'source',
        'span',
        'strike',
        'strong',
        'style',
        'sub',
        'summary',
        'sup',
        'table',
        'tbody',
        'td',
        'tfoot',
        'th',
        'thead',
        'time',
        'title',
        'tr',
        'track',
        'tt',
        'u',
        'ul',
        'var',
        'wbr',
        'rt',
        'section'
	],

	weappControllersAttrs: {
		button: ['size', 'type', 'plain', 'disabled', 'loading', 'form-type', 'hover-class', 'hover-start-time', 'hover-stay-time'],

		'switch': ['checked', 'type', 'color'],

		textarea: ['value', 'placeholder', 'placeholder-style', 'placeholder-class', 'disabled', 'maxlength', 'auto-focus', 'auto-height', 'fixed', 'cursor-spacing'],

		input: ['value', 'type', 'password', 'placeholder', 'placeholder-style', 'placeholder-class', 'disabled', 'maxlength', 'cursor-spacing', 'auto-focus', 'focus']
	},

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
						if(key == 'pages') {
							appJSON[key] = currAttr.value;
						}else {
							appJSON[key] = currAttr._value;							
						}
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

		return options.string ? JSON.stringify(appJSON).replace(/,"tabBar":{}/g, '') : appJSON;
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

	isViewTag (tag) {
		var result = {};

		for (var i = 0; i < this.viewReflectTable.length; i++) {
			var ct = this.viewReflectTable[i];
			if(ct == tag) {
				result.index = i;
				result.tag = tag;
				return result;
				break;
			}
		};

		return false;
	},

	transferTag2View (tag) {
		var isViewTag = this.isViewTag(tag);
		if(isViewTag) {
			return 'view';
		}
		return false;
	},

	transferTag (tag) {

		var viewTag = this.transferTag2View(tag);

		if(viewTag) {
			return viewTag;
		}

		return this.reflectTable[tag] ? this.reflectTable[tag] : false;
	},

	setControllerAttribute (controller, elem) {

		var self = this;

		this.controller = controller;
		this.elem = elem;

        for(var att in this.controller.attr) {
            var currentAttr = this.controller.attr[att];

            //_id为组件的真实id，因为拖拽过程中也有组件的id，为避免冲突，将真实id设为_id，在此转换为id
            att = att == '_id' ? 'id' : att;

            if(currentAttr.isClassName) {
                //更改的属性有css，则需要进行css操作

                if(this.refresh) {
                    var isClsInVal = false;
                    for (var i = 0; i < currentAttr.value.length; i++) {
                        var currentAttrVal = currentAttr.value[i];

                        if(currentAttrVal == currentAttr._value) {
                            isClsInVal = true;
                            break;
                        }
                    };

                    if(isClsInVal && currentAttr.isNoConflict) {
                        // 不是添加控件而是刷新控件, 先重置为基本class再加新class
                        this.elem.attr('class', this.controller.baseClassName);                                    
                    }
                }

                if(currentAttr.isSetAttribute) {
                    //对于某些控件既需要css，也需要attribute属性，比如禁止状态的按钮，需要disabled属性和css类
                    this.elem.attr(att, currentAttr._value);

                    //禁止按钮特殊处理
                    if(currentAttr._value) {
                        for (var j = 0; j < currentAttr.value.length; j++) {
                            var currentDisabledCSS = currentAttr.value[j];
                            this.elem.addClass(currentDisabledCSS);
                        };
                    }

                    if(!currentAttr._value) {
                        for (var j = 0; j < currentAttr.value.length; j++) {
                            var currentDisabledCSS = currentAttr.value[j];
                            this.elem.removeClass(currentDisabledCSS);
                        };
                    }

                }

                if(currentAttr.isSingleToggleClass) {
                    //针对某些对一个类进行开关的属性
                    if(currentAttr._value) {
                        for (var j = 0; j < currentAttr.value.length; j++) {
                            var currentDisabledCSS = currentAttr.value[j];
                            this.elem.addClass(currentDisabledCSS);
                        };
                    }else {
                        for (var j = 0; j < currentAttr.value.length; j++) {
                            var currentDisabledCSS = currentAttr.value[j];
                            this.elem.removeClass(currentDisabledCSS);
                        };                          
                    }
                }

                if(currentAttr.isNeedPrefixClass) {
                    if(currentAttr.isToggleButtonSize) {
                        currentAttr._value = currentAttr._value == 'default' ? '' : currentAttr._value;
                    }
                    if(typeof currentAttr._value == 'boolean') {
                        //开关操作

                        if(currentAttr._value) {
                            for (var i = 0; i < currentAttr.value.length; i++) {
                                var val = currentAttr.value[i];
                                if(this.elem.attr('class').indexOf(val) != -1) {
                                    this.elem.addClass(currentAttr.prefixClassValue + val);
                                    break;
                                }
                            };
                        }else {
                            for (var i = 0; i < currentAttr.value.length; i++) {
                                var val = currentAttr.value[i];
                                if(this.elem.attr('class').indexOf(val) != -1) {
                                    this.elem.removeClass(currentAttr.prefixClassValue + val);
                                    break;
                                }
                            };
                        }

                    }else {
                        this.elem.addClass(currentAttr.prefixClassValue + currentAttr._value);                                
                    }
                }else {
                    this.elem.addClass(currentAttr._value);
                }
            }

            if(currentAttr.isSetAttribute) {
                if (currentAttr.isContrary) {
                    this.elem.attr(att,!currentAttr._value);
                }else {
                    this.elem.attr(att, currentAttr._value);
                }
            }

            if(currentAttr.isHTML) {
                if(currentAttr.isNeedAppend) {

                    if(currentAttr.appendBefore) {
                        this.elem.html(currentAttr.value + this.controller.attr.value._value);
                    }

                }else {
                    this.elem.html(currentAttr._value);
                }
            }

            //设置默认样式，如容器的默认高度
            if (currentAttr.isStyle) {
            	if(!currentAttr.alias) {
            		//若有别名，表示和小程序的属性不同，非style样式
            		if(!currentAttr.isDesignerStyle) {
	                	if (currentAttr.isMultiplyStyle) {
		                    var styles = currentAttr._value.split(';');
		                    console.log(styles)
		                    for(var i = 0, len = styles.length - 1; i < len; i ++) {
		                        var styleNameAndVal = styles[i].split(':');
		                        console.log(styleNameAndVal[0].trim(),styleNameAndVal[1].trim())
		                        this.elem.css(styleNameAndVal[0].trim(), styleNameAndVal[1].trim());
		                    }
		                }else {
		                    if(currentAttr.isToggleStyle) {
		                        this.elem.css(att, currentAttr._value ? currentAttr.value[1] :   currentAttr.value[0]);
		                    }else {
		                        this.elem.css(att, currentAttr._value);                                
		                    }
		                }
            		}
            	}
            }

            if (currentAttr.isBoundToId) {
                //一些label获取id
                var id = '';
                var getRadioInputId = function (controller) {
                    // console.log('hahahahahahahahahahahahah', controller)
                    // console.log('hahahahahahahahahahahahah', typeof controller.children)
                    for(var i = 0; i < controller.children.length; i ++) {
                        if (controller.children[i].type == currentAttr.bindType) {
                            id = controller.children[i].key;
                            break;
                        }
                        if (typeof controller.children[i].children != 'undefined') {
                            getRadioInputId(controller.children[i]);
                        }
                    }
                    return id;
                }
                this.elem.attr(att, getRadioInputId(this.controller));
            }

            if (currentAttr.isCreateAttr) {
                //一些在创建元素时需设置的属性，比如是否需要可拖拽
                this.att = currentAttr._value;
            }

            if (currentAttr.isRander == true) {
                //针对某些子组件要不要渲染的情况，如页脚文字或链接
                var getRanderObj = function (controller) {
                    console.log(controller)
                    for(var i = 0; i < controller.children.length; i ++) {
                        if (controller.children[i].isRander == att) {
                            return {
                                parent: controller,
                                child: controller.children[i]
                            };
                        }
                    }
                    if (typeof controller.children[i].children !== 'undefined') {
                        getRanderObj(controller.children[i])
                    }
                }

                var obj = getRanderObj(this.controller);
                if (!currentAttr._value) {
                    obj.parent.children.splice(obj.child, 1);
                }
            }

            if(self.weappControllersAttrs[self.currentControllerTag]) {
            	for (var i = 0; i < self.weappControllersAttrs[self.currentControllerTag].length; i++) {
            		var currentWeappAttr = self.weappControllersAttrs[self.currentControllerTag][i];
            		if(currentWeappAttr == att || currentWeappAttr == currentAttr.alias) {
            			//小程序与web端有些属性不兼容，比如开关的颜色 在web中是一个CSS属性：background-color，在小程序中是color，所以要定义alias为color
            			if(currentAttr._value != '') {
	            			this.elem.attr(currentWeappAttr, currentAttr._value);            				
            			}
            		}
            	};
            }

        }
	},

	createElement () {

	},

	compilePageWXML (options) {
		var pageWXML = '',

			page = options.page,

			pageBaseTpl = $('<view class="page"></view>'),

			getPageBaseTpl = (template) => {
				return '<view class="page">' + template + '</view>';
			},

			controllers = page.children,

			self = this,

			loopController = function(controller) {

				if(controller.attr.isComponent) {
					return false;
				}

				var 
					tag = typeof controller.tag == 'string' ? controller.tag : controller.tag[0],

					weappTag = '';

					if(controller.tag == 'input') {

						var inputCtrl = {
							'weui-switch': 'switch',
							'weui-check': 'radio'
						}

						if(controller.baseClassName == 'weui-switch') {
							weappTag = 'switch';
							controller.attr.type._value = 'switch';
						}else if(controller.baseClassName == 'weui-check') {
							weappTag = controller.attr.type._value;
						}else {
							weappTag = self.transferTag(tag);
						}

					}else if(controller.baseClassName == 'weui-progress') {
						weappTag = 'progress';
					}else {
						weappTag = self.transferTag(tag);
					}

					if(!weappTag) {
						weappTag = controller.tag;
					}

					self.currentControllerTag = weappTag;

				var	elem = $(document.createElement(weappTag)),

					attrs = controller.attr;

					if(controller.baseClassName) {
						elem.addClass(controller.baseClassName);
					}

					self.setControllerAttribute(controller, elem);

	                if(controller.children && controller.children.length > 0) {

	                    for (var i = 0; i < controller.children.length; i++) {
	                        var currentCtrl = controller.children[i],

	                            loopComponent = loopController(currentCtrl);

	                        elem.append($(loopComponent));

	                    };

	                }

                return elem;
			}

			for (var i = 0; i < controllers.length; i++) {
				var controller = controllers[i];
				var elem = loopController(controller);

				if(elem) {
					pageBaseTpl.append(elem);
				}
			};

		pageWXML = getPageBaseTpl(pageBaseTpl.html());

		pageWXML = pageWXML.replace(/gospel_input/g, 'input')
						   .replace(/gospel_image/g, 'image');

		console.log(pageWXML);

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
