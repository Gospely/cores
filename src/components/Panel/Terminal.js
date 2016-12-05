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
		this.state = {
			terminalId: randomWord()
		}
	}

	componentDidMount() {

		var self = this;

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

				var cols = Math.ceil(termWidth / 8),
					rows = Math.ceil((termHeight - 90) / 12),
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

				fetch(baseUrl + '/terminals?cols=' + cols + '&rows=' + rows, {
					method: 'POST'
				}).then(function(res) {

					var offsetWidth = term.element.offsetWidth,
						offsetHeight = term.element.offsetHeight;

					if (offsetWidth === 0) {
						offsetWidth = 800;
						offsetHeight = 900;
					}

					console.log(offsetHeight);

					charWidth = Math.ceil(offsetWidth / cols);
					charHeight = Math.ceil(offsetHeight / rows);

					res.text().then(function(pid) {
						window.pid = pid;
						socketURL += pid;
						socket = new WebSocket(socketURL);
						socket.onopen = runRealTerminal;
						socket.onclose = runFakeTerminal;
						socket.onerror = runFakeTerminal;
						setTerminalSize();
					});
				});
			}

			function runRealTerminal() {
				console.log(socket);
				term.attach(socket);
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
