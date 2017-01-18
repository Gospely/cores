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
		unlinkDir: function(){
			props.dispatch({
				type: 'file/fetchFileList'
			});
		},
		unlink: function(){
			props.dispatch({
				type: 'file/fetchFileList'
			});
		},
		'git success'() {

			if(window.gitSocket != null) {
		        window.gitSocket.emit('leave', localStorage.user);
		        window.gitSocket.disconnect();
				console.log('success');
		        props.dispatch({
					type: 'file/fetchFileList'
				});

				props.dispatch({
					type: 'file/setTreeLoadingStatus',
					payload: 'clonded'
				});
		    }
		},
		'git error'(){
			if(window.gitSocket != null) {
		        window.gitSocket.emit('leave', namespace);
		        window.gitSocket.disconnect();

		        message.error('git clone 失败，请从终端手动 clone 或 pull')
		    }
		}
	}

	let protocol = (location.protocol === 'https:') ? 'wss://' : 'ws://';
	let socketURL = protocol + localStorage.host + ':9999';
	//let socketURL = protocol + 'localhost:8089';

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

}

export default fileListen;
