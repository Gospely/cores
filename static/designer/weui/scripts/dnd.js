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
				style = style == 'light' ? '200' : '400';
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
							// pageRender.render(attr);
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

			var ctrlAction = {

				page: function() {

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

				controller: function() {

				}

			}

			ctrlAction[data.type]();

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
				move : 'y',

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

			ctrlSelected: function() {
				var ctrlSelectedAction = {
					page: function() {
						navToPage(data);
					},

					controller: function() {

					}
				}
				ctrlSelectedAction[data.type]();
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
						// pageRender.render(data.attr);
					}
				}
				window.router.push(tmpRoute);
				refreshApp(data);
				console.log(window.router);
			},

			pageRemoved: function() {
				console.log('pageRemoved', data);
				var controller = data;
			},

			ctrlAdded: function() {
				console.log('ctrlAdded', data);
				var controller = data;
				var wrapper = allComponents.genWrapper(controller);
				var appended = jq(parent_window.currentTarget).append(wrapper);

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
			}, '*')
			return false;
		}

		e.preventDefault(); 

		currentTarget.addClass('hight-light');

		// var data = e.dataTransfer.getData("Text");

		//获取父元素的window对象上的数据
		var controller = parent_window.dndData;
		console.log("接收到的组件数据结构是：");
		console.log(controller);
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
	jq("body").on("dragover", function(e) {
		e.preventDefault(); 
		e.stopPropagation();
	});

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