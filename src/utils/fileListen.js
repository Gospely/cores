const fileListen = function (appId, port) {
	
	let protocol = (location.protocol === 'https:') ? 'wss://' : 'ws://';
	let socketURL = protocol + 'api.gospely.com';
	let socket = io(socketURL);
	console.log(socketURL)
	let baseUrl = 'http://' + localStorage.host + ':' + port;
	let url = baseUrl + '/listen/file?user_id=' + localStorage.user + '&project_name=' + localStorage.currentProject;
	console.log(socket)
	// socket.on('connect', function() {
	// 	fetch(url, {
	// 		method: 'POST'
	// 	}).then(function(res) {
	// 		console.log(res);
	// 	});
	// })
	 socket.emit('join listen',{
                    user_id : localStorage.user
                });


	socket.on('connect_failed', function() {
		// alert('失败')
	})

	socket.on('error', function() {
		// alert('错误')
	})

	socket.on('connecting', function() {
		console.log('正在连接')
	})

	socket.on('join', function(ev) {
		alert('来啊')
		console.lgo(ev)
	})
	// socket.onopen = function() {
	// 	console.log('文件监听打开')
	// };
	// socket.onclose = function() {
	// 	console.log('文件监听关闭')
	// };
	// socket.onerror = function() {
	// 	console.log('文件监听错误')
	// };
	// socket.onmessage = function (evt) {
	//   //收到服务器消息，使用evt.data提取
	// console.log(evt.data);
	//   	if(/^\{[\s*"\w+":"\w+",*\s*]+\}$/.test(evt.data)){
	// 		console.log(evt.data);
	// 		var data = JSON.parse(evt.data);
	// 		console.log(JSON.parse(evt.data));
	//   	}
	// };

}

export default fileListen;