
const HotKeyHandler = {
	currentMainKey:null,
	currentValueKey:null,
	init:function(){
		console.log('register');
		HotKeyHandler.register(0,"S",function(){alert("注册成功");});
	},
	register:function(tag,value,func){
		var MainKey="";
		switch(tag){
		case 0:
		MainKey=17; //Ctrl
		break;
		case 1:
		MainKey=16; //Shift
		break;
		case 2:
		MainKey="18"; //Alt
		break;
	}
	document.onkeyup=function(e){
		HotKeyHandler.currentMainKey=null;
	}

	document.onkeydown=function(event){
		console.log('keydown');
		//获取键值
		var keyCode= event.keyCode ;
		console.log(keyCode);
		var keyValue = String.fromCharCode(event.keyCode);
		console.log(keyValue);

		if(HotKeyHandler.currentMainKey!=null){
			if(keyValue==value){
				HotKeyHandler.currentMainKey=null;
				if(func!=null)func();
			}
		}
		if(keyCode==MainKey)
		HotKeyHandler.currentMainKey=keyCode;
	}
	}
}
export default HotKeyHandler;
