(function(){
	var jq = jQuery.noConflict();
	var data;

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

	//获取父元素
	var parent_window = window.parent;

	var source = jq("#dnd-row",window.parent.document).find('.ant-col-12');
	source.each(function(n){
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
		var wrapper = allComponents.genWrapper(controller);
		jq(e.target).append(wrapper);
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
		jq(this).find("i").show();
		jq(this).addClass("hight-light");
		//监听拖动事件
		jq(this).dragging({
			move : 'x',
			randomPosition : false
		});
	})

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
			btn.addClass("weui-btn_primary");
			btn.html("123");
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
			var i = '<i class="weui-icon-cancel" style="position:absolute; top:-8px; right:-12px; z-index:99;"></i>';
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
		}
	}
})()