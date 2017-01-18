const fileListen = function (props, namespace) {

	const fileListHandle = {

		change: function() {
			props.dispatch({
				type: 'file/fetchFileList'
			});
		},
		remove: function() {
			props.dispatch({
				type: 'file/fetchFileList'
			});
		},
		add: function() {
			props.dispatch({
				type: 'file/fetchFileList'
			});
		},
		addDir: function() {
			props.dispatch({
				type: 'file/fetchFileList'
			});
		},
		'git success'() {

			if(window.gitSocket != null) {
		        window.gitSocket.emit('leave', namespace);
		        window.gitSocket.disconnect();
		    }
		},
		'git error'(){
			if(window.gitSocket != null) {
		        window.gitSocket.emit('leave', namespace);
		        window.gitSocket.disconnect();
		    }
		}
	}

	let protocol = (location.protocol === 'https:') ? 'wss://' : 'ws://';
	//let socketURL = protocol + localStorage.domain + ':9999';
	let socketURL = protocol + 'localhost:8089';

	let socket = io(socketURL, {'reconnect':false,'auto connect':false} );
	console.log(socket);

	socket.on('message', function(data) {

		console.log(data);
		var data = data.split('-:-');
		console.log(data);
		fileListHandle[data[0]]();

	})
	socket.on('connections', function(data) {

		console.log(data);

	})
	socket.on('connect', function(data) {

		console.log('connect');

		socket.emit( 'message', namespace)

	});
	window.fileSocket = socket;

	// socket.emit('join listen',{
    //     user_id : localStorage.user
    // });
	//
	//
	// socket.on('connect_failed', function() {
	// 	// alert('失败')
	// })
	//
	// socket.on('error', function() {
	// 	// alert('错误')
	// })
	//
	// socket.on('connecting', function() {
	// 	console.log('正在连接')
	// })
	//
	// socket.on('join', function(ev) {
	// 	console.lgo(ev)
	// })
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
