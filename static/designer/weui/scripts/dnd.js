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
							return attr.template._value;
						},

						bind: function() {
						}
					}
					routerInstance = router.push(tmpRoute);
				};

				routerInstance.setDefault('/').init();

				console.log(';;;;;;;;;;;router;;;;;;;;;;', router);

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
			var orginClientX, orginClientY,movingClientX, movingClientY;

			elem.attr('draggable',true);

			elem.on('dragstart',function (e) {
				console.log(e)
				window.dragElement = e.currentTarget;
				orginClientX = e.clientX;
				orginClientY = e.clientY;
				e.originalEvent.dataTransfer.setData('Text','true');
				jq(e.currentTarget).css('opacity','.3');
			});

			elem.on('drag',function (e) {
				movingClientX = e.clientX;
				movingClientY = e.clientY;
				if(elem.position().top + orginClientY - movingClientY == 42){
					console.log('}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}非法位置')
				}
				// console.log(elem.position())
				// console.log(elem.position().top + orginClientY - movingClientY)
			});

			elem.on('dragend', function (e) {
				console.log('拖拽结束：＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝',e)
				jq(e.currentTarget).css('opacity','1');
			});
			elem.on('dragenter', function (e) {
				console.log('进入',e)
			})

			// elem.on('dragover', function (e) {
			// 	showDesignerDraggerBorder(jq(this));
			// 	console.log('dropovar',e)
			// 	e.preventDefault()
			// });

			

			elem.on('dragleave', function (e) {
				// console.log('离开',e)
				$this = jq(e.currentTarget);
				// console.log($this.eq(0).attr('id'))
				// console.log(jq(e.currentTarget))
				// console.log(jq(dragElement))
				hideDesignerDraggerBorder($this);
				if($this.eq(0).attr('id') != jq(dragElement).eq(0).attr('id')){
					console.log('不同的')
					$this.before(jq(dragElement));
				}

			})

			// elem.dragging({
			// 	move: 'both',
		 //        onMouseUp: function(e) {

		 //        },

		 //        onMouseDown: function(e) {

		 //        },

		 //        onMouseMove: function(e, direction, moveX, moveY) {
	  //   	        var 
			//             target = $(e.target),
			//             targetWidth = parseInt(target.parent().width()),
			//             targetHeight = parseInt(target.parent().height());

			//         if(moveY <= 42) {
			//         	return false;
			//         }else {
			//         	return true;
			//         }

		 //        }

			// });
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
						return data.attr.template._value;
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
		if(e.originalEvent.dataTransfer.getData("Text") == 'true') {
			return false;
		}
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
		hideDesignerDraggerBorder(currentTarget);
	});

	//点击i，删除当前组件
	jq(document).on("click", ".control-box .delete-com", function(e) {
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

		var self = jq(this);

		var dataControl = self.attr("data-control");

		//触发控件被点击事件
		postMessageToFather.ctrlClicked(dataControl);

		showDesignerDraggerBorder(self);
	});

	//鼠标按下
	jq(document).on("mousedown",".control-box",function(e){
		var self = jq(this);
		showDesignerDraggerBorder(self);
	});

	//鼠标进入
	jq(document).on("mouseenter", ".control-box", function(e) {
		var self = jq(this);
		showDesignerDraggerBorder(self);
	});

	//点击其他区域隐藏border和i
	jq("body").on("click", function() {
		hideDesignerDraggerBorder();
	});

	//隐藏border和i
	function hideDesignerDraggerBorder() {
		jq(".control-box i").hide();
		jq(".control-box").removeClass("hight-light");
	}

	function showDesignerDraggerBorder(self) {
		hideDesignerDraggerBorder();
		self.find('i.delete-com').show();
		self.addClass("hight-light");
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
						};1

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

			if(this.controller.children && this.controller.children.length > 0) {

				for (var i = 0; i < this.controller.children.length; i++) {
					var currentCtrl = this.controller.children[i],

						reComGenerator = new ComponentsGenerator({
							controller: currentCtrl
						}),

						loopComponent = reComGenerator.createElement(),

						jqComponent = jq(component);

						console.log('loopComponent=============', jqComponent.children().eq(1), loopComponent);

					jqComponent.children().eq(1).append(jq(loopComponent));

				};

			}

			console.log('component===========', component);

			return component;
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
