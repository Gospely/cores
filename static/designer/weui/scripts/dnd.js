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


	//同步获取components.json数据
	var  components = {};
	jq.ajaxSettings.async = false;
	jq.getJSON("/static/designer/weui/scripts/components.json",function(result){
		components = result;
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
		console.log(classPrp);
		//获取父元素的window对象上的数据
		console.log( parent_window.dndData);
		var controllersList = parent_window.dndData;
		var elem = '<a href="javascript:;" class="weui-btn weui-btn_primary" id="btn-1">页面主操作 Normal</a>';
		var myId = 'btn2';
		var controlBoxId = 'box2';
		var ctrlHTML = '<div class="control-box hight-light" id="controlBox"><i class="weui-icon-cancel" style="position:absolute; top:-8px; right:-12px; z-index:99;"></i>'+elem+'</div>';
		jq(e.target).append(ctrlHTML);
		hideBorder();
	});

	jq("#controlBox").dragging({
		move: 'both',
        	randomPosition: false
	});

	jq(document).on("click","#controlBox i",function(e){
		console.log("123456");
		e.stopPropagation();
		jq(e.target).parent("#controlBox").remove();
		console.log(jq(e.target));
	})

	jq(document).on("click","#controlBox",function(e){
		hideBorder();
		showCurrent(e);
		parent_window.postMessage({
		    opr: 'all'
		  },"*");  
	})

	jq("body").on("click", function(){
		hideBorder();
	});

	function hideBorder(){
		jq(".control-box i").hide();
		jq(".control-box").removeClass("hight-light");
	}
	function showCurrent(e){
		e.stopPropagation();
		jq(e.target).parent("#controlBox").find("i").show();
		jq(e.target).parent("#controlBox").addClass("hight-light");
	}
	jq("body").on("dragover",function(e){
		e.preventDefault(); 
		e.stopPropagation();
	});
})()