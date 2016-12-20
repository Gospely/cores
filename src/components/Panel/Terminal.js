import React, {
	PropTypes, Component
}
from 'react';
import {
	Tabs, Icon, Popover
}
from 'antd';

const TabPane = Tabs.TabPane;

import Xterm from './TerminalFit';

import randomWord from '../../utils/randomString';

class Terminal extends Component {

	constructor(props) {

    

		super(props);
		console.log("====================init terminal============");
		console.log(props);
		this.props = props;
		this.state = {
			terminalId: randomWord()
		}
	}

	componentDidMount() {

		var self = this,
			activePane = this.props.ctx.devpanel.panels.panes[ this.props.ctx.devpanel.panels.activePane.key],
			tabKey = activePane.activeTab.key,
			activeTab = activePane.tabs[tabKey-1];


		var init = function() {

			var term,
				protocol,
				socketURL,
				socket,
				pid,
				charWidth,
				charHeight,
				port = localStorage.socketPort || 0,
				domain = 'gospely.com',
				baseUrl = 'http://' + domain + ':' + port;

			var terminalContainer = document.getElementById(self.state.terminalId);

			function setTerminalSize() {

				var termParent = document.getElementById('');


				var termWidth = 800,
					termHeight = 900;

				let splitType = self.props.ctx.devpanel.panels.splitType;

				if (splitType == 'single' || splitType == 'vertical-dbl') {
					termHeight = ( parseInt(document.body.clientHeight) - 62 );
				}else {
					termHeight = ( parseInt(document.body.clientHeight)) / 2;
				}

				var cols = Math.ceil(termWidth / 4),
					rows = Math.ceil((termHeight - 90) / 17),
					width = (cols * charWidth).toString() + 'px',
					height = (rows * charHeight).toString() + 'px';

				console.log(cols, rows, termWidth, termHeight, width, height, charWidth,
					charHeight, '');
				terminalContainer.style.width = width;
				terminalContainer.style.height = height;
				term.resize(cols, rows);
			}

			createTerminal();



			function createTerminal() {
				// Clean terminal
				while (terminalContainer.children.length) {
					terminalContainer.removeChild(terminalContainer.children[0]);
				}
				term = new Xterm({
					cursorBlink: false
				});
				term.on('resize', function(size) {
					if (!pid) {
						return;
					}
					var cols = size.cols,
						rows = size.rows,
						url = baseUrl + '/terminals/' + pid + '/size?cols=' + cols + '&rows=' +
						rows;

					fetch(url, {
						method: 'POST'
					});
				});
				protocol = (location.protocol === 'https:') ? 'wss://' : 'ws://';
				socketURL = protocol + domain + ':' + port + '/terminals/';

				term.open(terminalContainer);
				// term.fit();

				var cols = term.cols,
					rows = term.rows;
				var offsetWidth = term.element.offsetWidth,
					offsetHeight = term.element.offsetHeight;

				if (offsetWidth === 0) {
					offsetWidth = 800;
					offsetHeight = 900;
				}

				console.log(offsetHeight);

				charWidth = Math.ceil(offsetWidth / cols);
				charHeight = Math.ceil(offsetHeight / rows);

				if(true){
				// if(activeTab.editorId == null || activeTab.editorId == '') {
					console.log("============openTerminal===========");
					console.log(activeTab);
					fetch(baseUrl + '/terminals?cols=' + cols + '&rows=' + rows, {
						method: 'POST'
					}).then(function(res) {
						console.log(res);
						if (res.status != 200){
							fetch(baseUrl + '/container/start/' + localStorage.applicationId ,{
								method: 'GET'
							}).then(function(res){
								if(res.status == 200) {
									setTimeout(function () {
									  //wait for the terminal start it completely
									  fetch(baseUrl + '/terminals?cols=' + cols + '&rows=' + rows, {
										method: 'POST'
									  }).then(function(res) {

										  res.text().then(function(pid) {
											self.props.ctx.dispatch({
											  type: 'devpanel/setPID',
											  payload: { pid: pid}
											});
											window.pid = pid;
											socketURL += pid;
											socket = new WebSocket(socketURL);
											socket.onopen = runRealTerminal;
											socket.onclose = runFakeTerminal;
											socket.onerror = runFakeTerminal;
											socket.onmessage = function (evt) {
											  //收到服务器消息，使用evt.data提取
											  console.log(evt.data);i
											  if(/^\{[\s*"\w+":"\w+",*\s*]+\}$/.test(evt.data)){
												console.log(evt.data);
												var data = JSON.parse(evt.data);
												console.log(JSON.parse(evt.data));
											  }
											};
											setTerminalSize();
										  });
									  });
								  },1000);
							  }else{

							  }
							})
						}
						res.text().then(function(pid) {
						  self.props.ctx.dispatch({
							type: 'devpanel/setPID',
							payload: { pid: pid}
						  });
						  window.pid = pid;
						  socketURL += pid;
						  socket = new WebSocket(socketURL);
						  socket.onopen = runRealTerminal;
						  socket.onclose = runFakeTerminal;
						  socket.onerror = runFakeTerminal;
						  socket.onmessage = function (evt) {
							//收到服务器消息，使用evt.data提取
							console.log(evt.data);i
							if(/^\{[\s*"\w+":"\w+",*\s*]+\}$/.test(evt.data)){
							  console.log(evt.data);
							  var data = JSON.parse(evt.data);
							  console.log(JSON.parse(evt.data));
							}
						  };
						  setTerminalSize();
						});
						console.log("============openTerminal===========");
						console.log(activeTab);

					});
				}else{
					console.log("============connectTerminal===========");
					console.log(activeTab);
					socketURL += activeTab.editorId;
					socket = new WebSocket(socketURL);
					socket.onopen = runRealTerminal;
					window.socket = socket;
					socket.onclose = runFakeTerminal;
					socket.onerror = runFakeTerminal;

					socket.onmessage = function (evt) {
						//收到服务器消息，使用evt.data提取
						console.log(evt.data);
						if(/^\{[\s*"\w+":"\w+",*\s*]+\}$/.test(evt.data)){
								console.log(evt.data);
								var data = JSON.parse(evt.data);
								console.log(JSON.parse(evt.data));
							}
					};
					setTerminalSize();
				}

			}

			function runRealTerminal() {
				console.log(socket);
				term.attach(socket);
				setTimeout(function(){
					socket.send('cd /root/workspace && clear\n');
				},1000);
				term._initialized = true;
			}

			function runFakeTerminal() {
				if (term._initialized) {
					return;
				}

				term._initialized = true;

				var shellprompt = '$ ';

				term.prompt = function() {
					term.write('\r\n' + shellprompt);
				};

				term.writeln('欢迎使用 Gospel IDE 终端');
				term.writeln('');
				term.prompt();

				term.on('key', function(key, ev) {
					var printable = (!ev.altKey && !ev.altGraphKey && !ev.ctrlKey && !ev.metaKey);

					if (ev.keyCode == 13) {
						term.prompt();
					} else if (ev.keyCode == 8) {
						// Do not delete the prompt
						if (term.x > 2) {
							term.write('\b \b');
						}
					} else if (printable) {
						term.write(key);
					}
				});

				term.on('paste', function(data, ev) {
					term.write(data);
				});
			}


		}();


	}

	render() {

		return <div id = {
			this.state.terminalId
		} > < /div>;
	}
}


export default Terminal;
