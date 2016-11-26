var jq = jQuery.noConflict();
jq(function(){
	var data;

	//同步获取components.json数据
	var  components = {};
	jq.ajaxSettings.async = false;
	jq.getJSON("/static/designer/weui/scripts/components.json",function(result){ 
		components = result;
	});

	var source = jq("#dnd-row",window.parent.document).find('.ant-col-12');
	source.each(function(n){
		jq(this).find(".app-components").attr("draggable",true);
		jq(this).find(".app-components").attr("id","source"+n);
		//开始拖拽
		jq(this).find(".app-components").on("dragstart",function(ev){
			data = $(ev.target).clone();
			//ev.dataTransfer.setData("Text",ev.target.id);
		})
	});

	// jq("body").find("#btn-1").attr("draggable",true);
	// jq("body").find("#btn-1").on("dragstart",function(ev){
	// 	data = $(ev.target);
	// 	//ev.dataTransfer.setData("Text",ev.target.id);
	// })

	//拖拽结束
	jq("body").on("drop",function(ev){
		ev.preventDefault(); 
		// var data = ev.dataTransfer.getData("Text");
		// var item = jq(data).cloneNode();//复制节点
		var classPrp = data.attr("class").split(" ")[1]
		console.log(classPrp);

		if(classPrp=="button"){
			jq(ev.target).append('<a href="javascript:;" class="weui-btn weui-btn_primary" id="btn-1">页面主操作 Normal</a>'); 
		}else{
			jq(ev.target).append(data);
		}

	})
	jq("body").on("dragover",function(ev){
		ev.preventDefault(); 
	});
})()