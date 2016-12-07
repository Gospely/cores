(function(){

	var jq = jQuery.noConflict();
	var data;

	//获取父元素
	var parent_window = window.parent;

	var pageAction = {

			changeNavigationBarTitleText: function(title) {
				jq('#gospel-app-title').html(title);
			},

			changeNavigationBarBackgroundColor: function(color) {
				jq('#navigation-bar').css('background-color', color);
			},

			changeNavigationBarTextStyle: function(style) {
				style = style == 'white' ? 'rgb(255, 255, 255)' : 'rgb(0, 0, 0)';
				jq('#gospel-app-title').css('color', style);
			},

			changeBackgroundTextStyle: function(style) {
				style = style == 'light' ? '200' : '800';
				jq('#gospel-app-title').css('font-weight', style);
			},

			changeBackgroundColor: function(color) {
				$('body').css('background-color', color);
			}

		},

		pageRender = {

			render: function(params) {
				pageAction.changeNavigationBarTitleText(params.navigationBarTitleText._value);
				pageAction.changeNavigationBarBackgroundColor(params.navigationBarBackgroundColor._value);
				pageAction.changeNavigationBarTextStyle(params.navigationBarTextStyle._value);
				pageAction.changeBackgroundTextStyle(params.backgroundTextStyle._value);
				pageAction.changeBackgroundColor(params.backgroundColor._value);
			}

		};

	var initApp = function(designer) {
			console.log('handleLayout added', designer);
			var layout = designer.layout,
				layoutState = designer.layoutState,
				app = layout[0],
				pages = app.children;

			window.wholeAppConfig = app.attr;

			pageAction.changeNavigationBarTitleText(app.attr.window._value.navigationBarTitleText._value);
			pageAction.changeNavigationBarBackgroundColor(app.attr.window._value.navigationBarBackgroundColor._value);
			pageAction.changeNavigationBarTextStyle(app.attr.window._value.navigationBarTextStyle._value);
			pageAction.changeBackgroundTextStyle(app.attr.window._value.backgroundTextStyle._value);
			pageAction.changeBackgroundColor(app.attr.window._value.backgroundColor._value);

			var initRouter = function(pages) {

				window.router = new Router({
				    container: '#gospel-designer-container',
				    enter: 'enter',
				    leave: 'leave'
				});

				var routerMap = [],
					routerInstance;

				for (var i = 0; i < pages.length; i++) {
					var currentPage = pages[i];
					console.log('currentPage', currentPage);
					var attr = currentPage.attr;
					var tmpRoute = {
						url: attr.routingURL._value,
						className: currentPage.key,

						render: function () {
							return attr.routingURL._value;
						},

						bind: function() {
						}
					}
					routerInstance = router.push(tmpRoute);
				};

				routerInstance.setDefault('/').init();

				console.log(routerInstance);

			}(pages);

		},

		refreshApp = function(data) {
			console.log('refreshApp', data);

			var attr = {};

			if(data.attr.window) {
				attr = data.attr.window._value;
			}else {
				attr = data.attr;
			}

			pageAction.changeNavigationBarTitleText(attr.navigationBarTitleText._value);
			pageAction.changeNavigationBarBackgroundColor(attr.navigationBarBackgroundColor._value);
			pageAction.changeNavigationBarTextStyle(attr.navigationBarTextStyle._value);
			pageAction.changeBackgroundTextStyle(attr.backgroundTextStyle._value);
			pageAction.changeBackgroundColor(attr.backgroundColor._value);

		},

		refreshController =  function(controller) {

			var ctrlID = controller.key,

				ctrlRefresher = new ComponentsGenerator({
					controller: controller
				});

				ctrlRefresher.setAttribute();
		},

		navToPage = function(data) {
			if(data.attr.routingURL) {
				router.go(data.attr.routingURL._value);
				refreshApp(data);
			}
		};

	var dragger = {

		makeElemAddedDraggable: function(id) {
			var elem = jq('#' + id);

			elem.dragging({
				move : 'both',
		        onMouseUp: function(e) {

		        },

		        onMouseDown: function(e) {

		        },

		        onMouseMove: function(e, direction, moveX, moveY) {
	    	        var 
			            target = $(e.target),
			            targetWidth = parseInt(target.parent().width()),
			            targetHeight = parseInt(target.parent().height());

			        if(moveY <= 42) {
			        	return false;
			        }else {
			        	return true;
			        }

		        }

			});
		}

	}

	window.addEventListener("message", function (evt) {

		var data = evt.data;

		console.log('addEventListener', data);

		var evtAction = {

			attrRefreshed: function() {
				console.log('attrRefreshed', data);
				refreshApp(data);
			},

			ctrlAttrRefreshed: function() {
				console.log('ctrlAttrRefreshed', data);
				refreshController(data);
			},

			pageSelected: function() {
				console.log('pageSelected', data);
				navToPage(data);
			},

			ctrlSelected: function() {
				console.log('ctrlSelected', data);
			},

			pageAdded: function() {
				console.log('pageAdded', data);
				var tmpRoute = {
					url: data.attr.routingURL._value,
					className: data.key,

					render: function () {
						return data.attr.routingURL._value;
					},

					bind: function() {
					}
				}
				window.router.push(tmpRoute);
				navToPage(data);
				console.log(window.router);
			},

			pageRemoved: function() {
				console.log('pageRemoved', data);
				var controller = data;
			},

			ctrlAdded: function() {
				console.log('ctrlAdded', data);

				var controller = data,

					comGen = new ComponentsGenerator({
						controller: controller,
						initElem: true
					}),

					elem = comGen.createElement(),

					appendResult = jq(parent_window.currentTarget).append(elem);

				dragger.makeElemAddedDraggable(controller.key);
			},

			layoutLoaded: function() {
				initApp(data);
			}
		}

		var eventName = '';

		for(var key in data) {
			eventName = key
		}

		if(evtAction[eventName]) {
			console.log('key', data[key]);
			data = data[key];
			evtAction[eventName]();
		}

	});

	var source = jq("#dnd-row", window.parent.document).find('.ant-col-12');
	source.each(function(n) {
		jq(this).find(".app-components").attr("draggable", true);
		jq(this).find(".app-components").attr("id", "source" + n);
		//开始拖拽
		jq(this).find(".app-components").on("dragstart", function(ev) {
			data = jq(ev.target).clone();
			//ev.dataTransfer.setData("Text",ev.target.id);
		})
	});

	//拖拽结束
	jq("#gospel-designer-container").on("drop", function(e) {
		console.log('onrop=======', e);
		var currentTarget = jq(e.currentTarget),
			target = jq(e.target);

		if(currentTarget.attr('id') != 'gospel-designer-container') {
			parent_window.postMessage({
				invalidDropArea: '非法的拖拽区域'
			}, '*');
			return false;
		}

		e.preventDefault(); 

		currentTarget.addClass('hight-light');
		// var data = e.dataTransfer.getData("Text");

		//获取父元素的window对象上的数据
		var controller = parent_window.dndData;
		parent_window.currentTarget = e.target;
		postMessageToFather.ctrlToBeAdded(controller);
		hideBorder();
	});

	//点击i，删除当前组件
	jq(document).on("click", ".control-box i", function(e) {
		var dataControl = jq(this).parent().attr("data-control");
		console.log("dataControl",dataControl);
		//删除组件时向父级发送ctrlRemoved的信息;
		postMessageToFather.ctrlRemoved(dataControl);
		e.stopPropagation();
		jq(e.target).parent(".control-box").remove();
	});

	//点击组件
	jq(document).on("click", ".control-box", function(e) {
		e.stopPropagation();
		//获取dom树上的数据结构
		var dataControl = jq(this).attr("data-control");
		//将ctrlClicked和数据结构发送给父级页面
		postMessageToFather.ctrlClicked(dataControl);
		hideBorder();
		jq(this).find("i").show();
		jq(this).addClass("hight-light");
		//监听拖动事件
	});

	//鼠标按下
	jq(document).on("mousedown",".control-box",function(e){
		jq(this).dragging({
			move : 'y'
		});
	});

	//鼠标进入
	jq(document).on("mouseenter", ".control-box", function(e) {

		hideBorder();
		jq(this).find("i").show();
		jq(this).addClass("hight-light");
	});
	//鼠标移出
	jq(document).on("mouseleave", ".control-box", function(e) {
		hideBorder();
	});

	//点击其他区域隐藏border和i
	jq("body").on("click", function() {
		hideBorder();
	});

	//隐藏border和i
	function hideBorder() {
		jq(".control-box i").hide();
		jq(".control-box").removeClass("hight-light");
	}

	//拖拽结束
	jq("body").on("dragover",function(e){
		e.preventDefault();
		e.stopPropagation();
	});

	function ComponentsGenerator(params) {

		params.initElem = params.initElem || false;

		this.controller = params.controller;

		this.tag = typeof this.controller.tag == 'object' ? this.controller.tag[0] : this.controller.tag;

		this.elemLoaded = false;
		this.refresh = false;

		if(!this.tag) {
			alert('组件数据结构出错');
			return false;
		}

		if(params.initElem) {
			this.initElem();
		}

		return this;
	}

	ComponentsGenerator.prototype = {

		initElem: function() {

			if(!this.elemLoaded) {
				var docCtrl = jq('#' + this.controller.key);

				this.elem = docCtrl.length > 0 ? docCtrl.children().eq(1) : jq(document.createElement(this.tag));
				this.elemLoaded = true;
				this.refresh = docCtrl.length > 0;
			}

			return this.elem;
		},

		coverWrapper: function() {

			this.initElem();

			var wrapper = jq('<div class="control-box hight-light" id="' + this.controller.key + '"></div>'),
				operation = '<i class="weui-icon-cancel delete-com"></i>';

			wrapper.attr('data-control', JSON.stringify(this.controller))
				   .append(operation);

			wrapper.append(this.elem);

			return wrapper;
		},

		setAttribute: function() {

			this.initElem();

			for(var att in this.controller.attr) {
				var currentAttr = this.controller.attr[att];
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
						if(isClsInVal) {
							// 不是添加控件而是刷新控件, 先重置为基本class再加新class
							this.elem.attr('class', this.controller.baseClassName);
						}
					}

					if(currentAttr.isSetAttribute) {
						//对于某些控件既需要css，也需要attribute属性，比如禁止状态的按钮，需要disabled属性和css类
						this.elem.attr(att, currentAttr._value);

						if(att == 'disabled' && currentAttr._value) {

							for (var j = 0; j < currentAttr.value.length; j++) {
								var currentDisabledCSS = currentAttr.value[j];
								this.elem.addClass(currentDisabledCSS);
							};

						}

					}

					this.elem.addClass(currentAttr._value);
				}

				if(currentAttr.isHTML) {
					this.elem.html(currentAttr._value);
				}
			}
			return this.elem;
		},

		createElement: function() {
			console.log('createElement', this.controller);

			this.initElem();

			if(this.controller.baseClassName) {
				this.elem.addClass(this.controller.baseClassName);
			}

			this.setAttribute();

			var component = this.coverWrapper();

			console.log(component);

			return component;
		}

	}

	var allComponents = {
		genButton: function(c) {
			var btn = $("<"+c.tag[0]+"/>");
			btn.addClass(c.baseClassName);
			btn.addClass(c.attr.class._value);
			btn.html(c.attr.value._value);
			return btn;
		},

		//生成组件
		genComponent: function(controller){
			switch (controller.type) {
				case "button": return this.genButton(controller);
			}
		},

		//生成组件外包装
		genWrapper: function(controller) {
			var wrapper = $('<div class="control-box hight-light" id="' + controller.key + '"></div>');
			wrapper.attr("data-control", JSON.stringify(controller));
			var i = '<i class="weui-icon-cancel delete-com"></i>';
			var component = this.genComponent(controller);
			wrapper.append(i);
			wrapper.append(component);
			return wrapper;
		},

		genChilden: function(c){
			var div1 = $("<"+c.tag[0]+"/>");
			div1.addClass(c.baseClassName);
			div1.attr('id'.c.key);
			for(var att in c.attr){
				//是html
				if(!att.isClassName && att.isHTML) {
					div1.html(att._value);
				}else if(att.isClassName && !att.isHTML) {	//是class
					div1.attr(att, att._value);
				}
			}
			return div1;
		},

		//递归生成组件
		genCom: function(c){
			var container = this.genChilden(c);
			if(c.childen == null){
				return container;
			}else{
				for(var i = 0; i < c.childen.length; i++){
					container.append(this.genCom(c.childen[i]));
				}
				return container;
			}
		}
	}

	//发送信息给父级页面
	var postMessageToFather = {

		ctrlClicked: function(c) {
			console.log("向父级发送信息");
			parent_window.postMessage({ 'ctrlClicked': c }, "*");
		},

		ctrlToBeAdded: function(c) {
			console.log("向父级发送信息");
			parent_window.postMessage({ 'ctrlToBeAdded': c }, "*");
		},

		ctrlEdited: function(c) {
			console.log("向父级发送信息");
			parent_window.postMessage({ 'ctrlEdited': c }, "*");
		},

		ctrlRemoved: function(c) {
			console.log("向父级发送信息");
			parent_window.postMessage({ 'ctrlRemoved': c }, "*");
		}

	}
})()
