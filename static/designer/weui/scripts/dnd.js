(function(){

	//---------------------------初始化路由---------------------------

	var router = new Router({
	    container: '#gospel-designer-container'
	});

	var routerMap = [];

	var home = {
		    url: '/',
		    className: 'home',
		    render: function (){
		        return '<div class="page"><div class="page__hd"><h1 class="page__title"><img src="./images/logo.png" alt="WeUI" height="21px" /></h1><p class="page__desc">WeUI 是一套同微信原生视觉体验一致的基础样式库，由微信官方设计团队为微信内网页和微信小程序量身设计，令用户的使用感知更加统一。</p></div><div class="page__bd page__bd_spacing"><ul><li><div class="weui-flex js_category"><p class="weui-flex__item">表单</p><img src="./images/icon_nav_form.png" alt=""></div><div class="page__category js_categoryInner"><div class="weui-cells page__category-content"><a class="weui-cell weui-cell_access js_item" data-id="button" href="javascript:;"><div class="weui-cell__bd"><p>Button</p></div><div class="weui-cell__ft"></div></a><a class="weui-cell weui-cell_access js_item" data-id="input" href="javascript:;"><div class="weui-cell__bd"><p>Input</p></div><div class="weui-cell__ft"></div></a><a class="weui-cell weui-cell_access js_item" data-id="list" href="javascript:;"><div class="weui-cell__bd"><p>List</p></div><div class="weui-cell__ft"></div></a><a class="weui-cell weui-cell_access js_item" data-id="slider" href="javascript:;"><div class="weui-cell__bd"><p>Slider</p></div><div class="weui-cell__ft"></div></a><a class="weui-cell weui-cell_access js_item" data-id="uploader" href="javascript:;"><div class="weui-cell__bd"><p>Uploader</p></div><div class="weui-cell__ft"></div></a></div></div></li><li><div class="weui-flex js_category"><p class="weui-flex__item">基础组件</p><img src="./images/icon_nav_layout.png" alt=""></div><div class="page__category js_categoryInner"><div class="weui-cells page__category-content"><a class="weui-cell weui-cell_access js_item" data-id="article" href="javascript:;"><div class="weui-cell__bd"><p>Article</p></div><div class="weui-cell__ft"></div></a><a class="weui-cell weui-cell_access js_item" data-id="badge" href="javascript:;"><div class="weui-cell__bd"><p>Badge</p></div><div class="weui-cell__ft"></div></a><a class="weui-cell weui-cell_access js_item" data-id="flex" href="javascript:;"><div class="weui-cell__bd"><p>Flex</p></div><div class="weui-cell__ft"></div></a><a class="weui-cell weui-cell_access js_item" data-id="footer" href="javascript:;"><div class="weui-cell__bd"><p>Footer</p></div><div class="weui-cell__ft"></div></a><a class="weui-cell weui-cell_access js_item" data-id="gallery" href="javascript:;"><div class="weui-cell__bd"><p>Gallery</p></div><div class="weui-cell__ft"></div></a><a class="weui-cell weui-cell_access js_item" data-id="grid" href="javascript:;"><div class="weui-cell__bd"><p>Grid</p></div><div class="weui-cell__ft"></div></a><a class="weui-cell weui-cell_access js_item" data-id="icons" href="javascript:;"><div class="weui-cell__bd"><p>Icons</p></div><div class="weui-cell__ft"></div></a><a class="weui-cell weui-cell_access js_item" data-id="loadmore" href="javascript:;"><div class="weui-cell__bd"><p>Loadmore</p></div><div class="weui-cell__ft"></div></a><a class="weui-cell weui-cell_access js_item" data-id="panel" href="javascript:;"><div class="weui-cell__bd"><p>Panel</p></div><div class="weui-cell__ft"></div></a><a class="weui-cell weui-cell_access js_item" data-id="preview" href="javascript:;"><div class="weui-cell__bd"><p>Preview</p></div><div class="weui-cell__ft"></div></a><a class="weui-cell weui-cell_access js_item" data-id="progress" href="javascript:;"><div class="weui-cell__bd"><p>Progress</p></div><div class="weui-cell__ft"></div></a></div></div></li><li><div class="weui-flex js_category"><p class="weui-flex__item">操作反馈</p><img src="./images/icon_nav_feedback.png" alt=""></div><div class="page__category js_categoryInner"><div class="weui-cells page__category-content"><a class="weui-cell weui-cell_access js_item" data-id="actionsheet" href="javascript:;"><div class="weui-cell__bd"><p>Actionsheet</p></div><div class="weui-cell__ft"></div></a><a class="weui-cell weui-cell_access js_item" data-id="dialog" href="javascript:;"><div class="weui-cell__bd"><p>Dialog</p></div><div class="weui-cell__ft"></div></a><a class="weui-cell weui-cell_access js_item" data-id="msg" href="javascript:;"><div class="weui-cell__bd"><p>Msg</p></div><div class="weui-cell__ft"></div></a><a class="weui-cell weui-cell_access js_item" data-id="picker" href="javascript:;"><div class="weui-cell__bd"><p>Picker</p></div><div class="weui-cell__ft"></div></a><a class="weui-cell weui-cell_access js_item" data-id="toast" href="javascript:;"><div class="weui-cell__bd"><p>Toast</p></div><div class="weui-cell__ft"></div></a></div></div></li><li><div class="weui-flex js_category"><p class="weui-flex__item">导航相关</p><img src="./images/icon_nav_nav.png" alt=""></div><div class="page__category js_categoryInner"><div class="weui-cells page__category-content"><a class="weui-cell weui-cell_access js_item" data-id="navbar" href="javascript:;"><div class="weui-cell__bd"><p>Navbar</p></div><div class="weui-cell__ft"></div></a><a class="weui-cell weui-cell_access js_item" data-id="tabbar" href="javascript:;"><div class="weui-cell__bd"><p>Tabbar</p></div><div class="weui-cell__ft"></div></a></div></div></li><li><div class="weui-flex js_category"><p class="weui-flex__item">搜索相关</p><img src="./images/icon_nav_search.png" alt=""></div><div class="page__category js_categoryInner"><div class="weui-cells page__category-content"><a class="weui-cell weui-cell_access js_item" data-id="searchbar" href="javascript:;"><div class="weui-cell__bd"><p>Search Bar</p></div><div class="weui-cell__ft"></div></a></div></div></li><li><div class="weui-flex js_item" data-id="layers"><p class="weui-flex__item">层级规范</p><img src="./images/icon_nav_z-index.png" alt=""></div></li></ul></div><div class="page__ft"><a href="javascript:home()"><img src="./images/icon_footer.png" /></a></div></div>';
		    }
		},

		post = {
		    url: '/post/:id',
		    className: 'post',
		    render: function (){
		        var id = this.params.id;
		        return '<h1>post</h1>';
		    }
		};

	var routerMap = [home, post],
		routerInstance;

	for (var i = 0; i < routerMap.length; i++) {
		var currentRouter = routerMap[i];
		routerInstance = router.push(currentRouter);
	};

	routerInstance.setDefault('/').init();

	//---------------------------初始化路由---------------------------

	var jq = jQuery.noConflict();
	var data;

	//获取父元素
	var parent_window = window.parent;

	window.addEventListener("message", function (evt) {

		var data = evt.data;

		var evtAction = {

			attrRefreshed: function() {
				console.log('attrRefreshed', data);
			},

			ctrlSelected: function() {
				console.log('ctrlSelected', data);
			},

			pageAdded: function() {
				console.log('pageAdded', data);
			},

			pageRemoved: function() {
				console.log('pageRemoved', data);
			},

			ctrlAdded: function() {
				console.log('ctrlAdded', data);
				var controller = data;
				var wrapper = allComponents.genWrapper(controller);
				var appended = jq(parent_window.currentTarget).append(wrapper);
			}
		}

		var eventName = '';

		for(var key in data) {
			eventName = key
		}

		if(evtAction[eventName]) {
			data = data[key];
			evtAction[eventName]();
		}

	});

	var source = jq("#dnd-row",window.parent.document).find('.ant-col-12');
	source.each(function(n) {
		jq(this).find(".app-components").attr("draggable",true);
		jq(this).find(".app-components").attr("id","source"+n);
		//开始拖拽
		jq(this).find(".app-components").on("dragstart",function(ev){
			data = jq(ev.target).clone();
			//ev.dataTransfer.setData("Text",ev.target.id);
		})
	});

	//拖拽结束
	jq("body").on("drop",function(e){
		e.preventDefault(); 
		// var data = e.dataTransfer.getData("Text");
		// var item = jq(data).cloneNode();//复制节点
		var classPrp = data.attr("class").split(" ")[1]
		//获取父元素的window对象上的数据
		var controller = parent_window.dndData;
		console.log("接收到的组件数据结构是：");
		console.log(controller);
		parent_window.currentTarget = e.target;
		postMessageToFather.ctrlToBeAdded(controller);
		hideBorder();
	});


	//点击i，删除当前组件
	jq(document).on("click",".control-box i",function(e){
		e.stopPropagation();
		jq(e.target).parent(".control-box").remove();
	})

	//点击组件
	jq(document).on("click",".control-box",function(e){
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
		
	jq(document).on("mousedown",".control-box",function(e){
		jq(this).dragging({
			move : 'both'
		});
	});
	jq(document).on("mouseenter",".control-box",function(e){
		jq(this).find("i").show();
		jq(this).addClass("hight-light");
	});
	jq(document).on("mouseleave",".control-box",function(e){
		hideBorder();
	});


	//点击其他区域隐藏border和i
	jq("body").on("click", function(){
		hideBorder();
	});

	//隐藏border和i
	function hideBorder(){
		jq(".control-box i").hide();
		jq(".control-box").removeClass("hight-light");
	}

	//拖拽结束
	jq("body").on("dragover",function(e){
		e.preventDefault(); 
		e.stopPropagation();
	});


	var allComponents={
		genButton:function(c){
			var btn = $("<"+c.tag[0]+"/>");
			btn.addClass(c.baseClassName);
			btn.addClass(c.attr.class._value);
			btn.html(c.attr.value._value);
			return btn;
		},
		//生成组件
		genComponent:function (controller){
			switch (controller.type){
				case "button":return this.genButton(controller);
			}
		},
		//生成组件外包装
		genWrapper:function (controller){
			var wrapper =$('<div class="control-box hight-light" id="controlBox"></div>');
			wrapper.attr("data-control",JSON.stringify(controller));
			var i = '<i class="weui-icon-cancel delete-com"></i>';
			var component = this.genComponent(controller);
			wrapper.append(i);
			wrapper.append(component);
			return wrapper;
		},
		genChilden:function(c){
			var div1 = $("<"+c.tag[0]+"/>");
			div1.addClass(c.baseClassName);
			div1.attr('id'.c.key);
			for(var att in c.attr){
				//是html
				if(!att.isClassName&&att.isHTML){
					div1.html(att._value);
				}else if(att.isClassName&&!att.isHTML){	//是class
					div1.attr(att, att._value);
				}
			}
			return div1;
		},
		//递归生成组件
		genCom:function(c){
			var container = this.genChilden(c);
			if(c.childen==null){
				return container;
			}else{
				for(var i=0;i<c.childen.length;i++){
					container.append(this.genCom(c.childen[i]));
				}
				return container;
			}
		}
	}

	//发送信息给父级页面
	var postMessageToFather = {
		ctrlClicked:function(c){
			console.log("向父级发送信息");
			parent_window.postMessage({'ctrlClicked':c},"*");
		},
		ctrlToBeAdded:function(c){
			console.log("向父级发送信息");
			parent_window.postMessage({'ctrlToBeAdded':c},"*");
		},
		ctrlEdited:function(c){
			console.log("向父级发送信息");
			parent_window.postMessage({'ctrlEdited':c},"*");
		},
		ctrlRemoved:function(c){
			console.log("向父级发送信息");
			parent_window.postMessage({'ctrlRemoved':c},"*");
		}
	}
})()