const fileListen = function (appId, port) {
	
	let protocol = (location.protocol === 'https:') ? 'wss://' : 'ws://';
	let socketURL = protocol + domain + ':' + port + '/listen/file';
	socket = new WebSocket(socketURL);
	socket.onopen = function() {
		console.log('文件监听')
	};
	socket.onclose = function() {
		console.log('文件监听')
	};
	socket.onerror = function() {
		console.log('文件监听')
	};
	socket.onmessage = function (evt) {
	  //收到服务器消息，使用evt.data提取
	console.log(evt.data);
	  	if(/^\{[\s*"\w+":"\w+",*\s*]+\}$/.test(evt.data)){
			console.log(evt.data);
			var data = JSON.parse(evt.data);
			console.log(JSON.parse(evt.data));
	  	}
	};

}

export default fileListen;