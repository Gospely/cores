import configs from './config';

const HotKeyHandler = {
	currentMainKey:null,
	currentValueKey:null,
	props:null,
	init:function(props){
		HotKeyHandler.props = props;
		console.log(configs.bindKey);
		console.log('register');
		configs.bindKey.map(config =>{
				HotKeyHandler.register(config.mainKey,config.key,config.hander);
		})
	},
	register:function(tag,value,func){
		var MainKey="";
		switch(tag){
		case 'Ctrl':
		MainKey=17; //Ctrl
		break;
		case 'Command':
		MainKey=17; //Ctrl
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
		//获取键值
		var keyCode= event.keyCode ;
		var keyValue = String.fromCharCode(event.keyCode);

		if(HotKeyHandler.currentMainKey!=null){
			if(keyValue==value){
				HotKeyHandler.currentMainKey=null;
				if(func!=null){
					func(HotKeyHandler.props);
					return false;
				}else{

				}
			}
		}
		if(keyCode==MainKey)
		HotKeyHandler.currentMainKey=keyCode;
		return true;
	}
	}
}
export default HotKeyHandler;
