import configs from './config';
import keymap from './keymap';

const HotKeyHandler = {

	currentMainKey: null,
	currentSecondKey: null,
	currentThirdKey: null,
	currentValueKey: null,
	props: null,
	handlers: [],

	init: function (props) {

		HotKeyHandler.props = props;
		HotKeyHandler.handlers = new Array();

		configs.bindKey.map(config => {

			config.mainKey.map(key =>{

				var keys = key.split('+');
				if(keys.length == 1){
					HotKeyHandler.register(key,null,keymap[keys[0]],config.handler);
				}
				if(keys.length == 2){
					HotKeyHandler.register(key,keymap[keys[0]],null,keymap[keys[1]], config.handler);
				}
				if(keys.length == 3 ){
					HotKeyHandler.register(key,keymap[keys[0]],keymap[keys[1]],keymap[keys[2]],config.handler);
				}
			});
		});
	},

	register: function(shortcuts, mainKey,secondKey,key,func) {

		HotKeyHandler.handlers.push({
			shortcuts: shortcuts,
			mainKey: mainKey,
			secondKey: secondKey,
			key: key,
			func: func
		});

		document.onkeyup = function(e) {
			HotKeyHandler.currentMainKey = null;
			HotKeyHandler.currentSecondKey = null;
			HotKeyHandler.currentThirdKey = null;
		}

		document.onkeydown = function(event) {
			//获取键值
			var keyCode = event.keyCode;
			var exec = false;

			console.log(keyCode);

			for (var i = 0; i < HotKeyHandler.handlers.length; i++) {
				var handler = HotKeyHandler.handlers[i];
				var bool = true;
				if(handler.mainKey != null){

					if(handler.mainKey == HotKeyHandler.currentMainKey || handler.mainKey == HotKeyHandler.currentThirdKey){
						bool = bool && true;
					}else{
						bool = bool && false;
					}
				}
				if(handler.secondKey != null) {

					if(handler.secondKey == HotKeyHandler.currentSecondKey){
						bool = bool && true;
					}else{
						bool = bool && false;
					}
				}else{
					if(HotKeyHandler.currentSecondKey != null){
						bool = bool && false;
					}
				}
				if(!handler.mainKey && !handler.secondKey && handler.key == keyCode){
					bool = bool && true;
				}
				if(handler.key != null) {
					if(handler.key == keyCode){
						bool = bool && true;
						if(bool){
							handler.func(HotKeyHandler.props);
							exec = true;
							return !exec;
						}
					}else{
						bool = bool && false;
					}
				}
			}
			if(keyCode == keymap['ctrl'] || keyCode == keymap['command']){
				HotKeyHandler.currentMainKey = keyCode;
			}
			if(keyCode == keymap['shift']){
				HotKeyHandler.currentSecondKey = keyCode;
			}
			if(keyCode == keymap['alt'] || keyCode == keymap['options']){
				HotKeyHandler.currentThirdKey  = keyCode;
			}

			return !exec;
		}
	}
}

export default HotKeyHandler;
