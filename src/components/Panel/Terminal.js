import React, { PropTypes, Component }from 'react';
import { Tabs, Icon, Popover } from 'antd';

const TabPane = Tabs.TabPane;

import Xterm from './TerminalFit';

import randomWord from '../../utils/randomString';

class Terminal extends Component {

	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			terminalId: randomWord()
		}
	}

	componentDidMount() {

		var self = this,
			activePane = this.props.ctx.devpanel.panels.panes[this.props.ctx.devpanel.panels.activePane.key],
			tabKey = activePane.activeTab.key,
			activeTab = activePane.tabs[tabKey - 1];

		var terminalTypeName = false;

		var activeTerminalAction = {

			'git commit' () {
				terminalTypeName = 'commitTerminal';
				window.commitTerminalID = self.props.title;
			},

			'git pull' () {
				terminalTypeName = 'pullTerminal';
				window.pullTerminalID = self.props.title;
			},

			'git push' () {
				terminalTypeName = 'pushTerminal';
				window.pushTerminalID = self.props.title;
			}

		}

		if(activeTab && activeTerminalAction[activeTab.title]) {
			activeTerminalAction[activeTab.title]();
		}

		var setTerminalType = function(socket) {
			if(terminalTypeName) {
				window[terminalTypeName] = socket;
			}
		}

		if(window[terminalTypeName]) {
			return false;
		}

		var init = function() {

			var term,
				protocol,
				socketURL,
				socket,
				pid,
				charWidth,
				charHeight,
				port = localStorage.socketPort || 0,
				domain = localStorage.host,
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

				var cols = 10000,
					rows = Math.ceil((termHeight - 90) / 17),
					width = (cols * charWidth).toString() + 'px',
					height = (rows * charHeight).toString() + 'px';

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
					// console.log("============openTerminal===========");
					// console.log(activeTab);
					fetch(baseUrl + '/terminals?cols=' + cols + '&rows=' + rows, {
						method: 'POST',
						'headers': {
			                'Authorization': localStorage.token
			            }
					}).then(function(res) {
						console.log(res);
						if (res.status != 200){
							fetch(baseUrl + '/container/start/' + localStorage.applicationId ,{
								method: 'GET',
								'headers': {
					                'Authorization': localStorage.token
					            }
							}).then(function(res){
								if(res.status == 200) {
									setTimeout(function () {
									  fetch(baseUrl + '/terminals?cols=' + cols + '&rows=' + rows, {
										method: 'POST',
										'headers': {
							                'Authorization': localStorage.token
							            }
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
											setTerminalType(socket);						
											socket.onmessage = function (evt) {
											  //收到服务器消息，使用evt.data提取
											  if(/^\{[\s*"\w+":"\w+",*\s*]+\}$/.test(evt.data)){
												var data = JSON.parse(evt.data);
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
						  setTerminalType(socket);						
						  socket.onmessage = function (evt) {
							//收到服务器消息，使用evt.data提取
							if(/^\{[\s*"\w+":"\w+",*\s*]+\}$/.test(evt.data)){
							  var data = JSON.parse(evt.data);
							}
						  };
						  setTerminalSize();
						});
					});
				}else{
					socketURL += activeTab.editorId;
					socket = new WebSocket(socketURL);
					socket.onopen = runRealTerminal;
					window.socket = socket;
					socket.onclose = runFakeTerminal;
					socket.onerror = runFakeTerminal;
					setTerminalType(socket);
					socket.onmessage = function (evt) {
						//收到服务器消息，使用evt.data提取
						if(/^\{[\s*"\w+":"\w+",*\s*]+\}$/.test(evt.data)){
							var data = JSON.parse(evt.data);
						}
					};
					setTerminalSize();
				}

			}

			function runRealTerminal() {
				term.attach(socket);
				setTimeout(function(){
					socket.send(self.props.ctx.devpanel.cmd);
					self.props.ctx.dispatch({
						type: 'devpanel/initCmd',
					});
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
