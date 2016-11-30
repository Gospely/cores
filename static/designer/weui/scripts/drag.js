
jQuery.fn.extend({
		//---元素拖动插件
    dragging:function(data){   
		var $this = jQuery(this);
		var xPage;
		var yPage;
		var X;//
		var Y;//
		var father = $this.parent();
		var defaults = {
			move : 'both',
			hander:1
		}
		var opt = jQuery.extend({},defaults,data);
		var movePosition = opt.move;
		
		var hander = opt.hander;
		
		if(hander == 1){
			hander = $this; 
		}else{
			hander = $this.find(opt.hander);
		}
		
		//初始化
		hander.css({"cursor":"move"});
		$width=$this.width();
		$height=$this.height();
		$this.css({"width":$width+"px","height":$height+"px"});

		var faWidth = father.width();
		var faHeight = father.height();
		var thisWidth = $this.width()+parseInt($this.css('padding-left'))+parseInt($this.css('padding-right'));
		var thisHeight = $this.height()+parseInt($this.css('padding-top'))+parseInt($this.css('padding-bottom'));
		
		var mDown = false;//
		var positionX;
		var positionY;
		var moveX ;
		var moveY ;
		var $width,$height;
		
		hander.mousedown(function(e){
			
			//console.log('宽度：',$width,' 高度:',$height);
			father.children().css({"zIndex":"0"});
			$this.css({"zIndex":"1"});
			mDown = true;
			X = e.pageX;
			Y = e.pageY;
			positionX = $this.position().left;
			positionY = $this.position().top;
			if(opt.onMouseDown) {
				opt.onMouseDown(e);				
			}
			return false;
		});
			
		jQuery(document).mouseup(function(e){
			mDown = false;
			if(opt.onMouseUp) {
				opt.onMouseUp(e);				
			}
		});
			
		jQuery(document).mousemove(function(e){
			xPage = e.pageX;//--
			moveX = positionX+xPage-X;
			
			yPage = e.pageY;//--
			moveY = positionY+yPage-Y;
			//console.log('宽度：',$width,' 高度:',$height);
			$this.css({"position":"absolute"});
			function thisXMove(){ //x轴移动
				if(mDown == true){
					$this.css({"left":moveX});
				}else{
					return;
				}
				if(moveX < 0){
					$this.css({"left":"0"});
				}
				if(moveX > (faWidth-thisWidth)){
					$this.css({"left":faWidth-thisWidth});
				}
				return moveX;
			}
			
			function thisYMove(){ //y轴移动
				if(mDown == true){
					$this.css({"top":moveY});
				}else{
					return;
				}
				if(moveY < 0){
					$this.css({"top":"0"});
				}
				if(moveY > (faHeight-thisHeight)){
					$this.css({"top":faHeight-thisHeight});
				}
				return moveY;
			}

			function thisAllMove(){ //全部移动
				if(mDown == true){
					$this.css({"left":moveX,"top":moveY});
				}else{
					return;
				}
				if(moveX < 0){
					$this.css({"left":"0"});
				}
				if(moveX > (faWidth-thisWidth)){
					$this.css({"left":faWidth-thisWidth});
				}

				if(moveY < 0){
					$this.css({"top":"0"});
				}
				if(moveY > (faHeight-thisHeight)){
					$this.css({"top":faHeight-thisHeight});
				}
			}

			if(movePosition.toLowerCase() == "x"){
				thisXMove();
			}else if(movePosition.toLowerCase() == "y"){
				thisYMove();
			}else if(movePosition.toLowerCase() == 'both'){
				thisAllMove();
			}

			if(opt.onMouseMove) {
				opt.onMouseMove(e, movePosition.toLowerCase, moveX, moveY);
			}

		});
    }
}); 