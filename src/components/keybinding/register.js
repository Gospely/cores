import configs from './config';
import keymap from './keymap';

const HotKeyHandler = {

	currentMainKey: null,
	currentValueKey: null,
	props: null,
	handlers: [],

	init: function (props) {

		HotKeyHandler.props = props;
		HotKeyHandler.handlers = new Array();
		// console.log(configs.bindKey);
		// console.log('register');

		configs.bindKey.map(config => {

			// console.log(config.mainKey);
			config.mainKey.map(key =>{

				// console.log(key);
				var keys = key.split('+');
				// console.log(keys.length);
				if(keys.length < 2){
					// console.log(key);
					HotKeyHandler.register(key,null,keymap[keys[1]],config.handler);
				}else{
					// console.log(keys);
					// console.log(keymap[keys[0]],keymap[keys[1]]);
					HotKeyHandler.register(key,keymap[keys[0]],keymap[keys[1]],config.handler);
				}

			});
		});
	},

	register: function(shortcuts, mainKey,key, func) {

		HotKeyHandler.handlers.push({
			shortcuts: shortcuts,
			mainKey:mainKey,
			key: key,
			func: func
		});

		document.onkeyup = function(e) {
			HotKeyHandler.currentMainKey=null;
		}

		document.onkeydown = function(event) {
			//获取键值
			var keyCode = event.keyCode;
			var exec = false;

			// console.log(keyCode, keyCode);

			HotKeyHandler.handlers.map(handler =>{

				// console.log(handler);
				if(handler.mainKey == HotKeyHandler.currentMainKey) {
					if(keyCode == handler.key) {
						HotKeyHandler.currentMainKey = null;
						if(func != null) {
							// console.log("exec");
							handler.func(HotKeyHandler.props);
							exec = true;
						}
					}
				}else{
					if(keyCode == handler.key && handler.mainKey == null) {
						if(func != null) {
							// console.log("exec");
							handler.func(HotKeyHandler.props);
							exec = true;
						}
					}
				}
			});

			if(keyCode == keymap['ctrl'] || keyCode == keymap['command']){
				HotKeyHandler.currentMainKey=keyCode;
				// console.log(HotKeyHandler.currentMainKey);

			}
			return !exec;
		}
	}
}

export default HotKeyHandler;
