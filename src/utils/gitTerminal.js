import fetch from 'dva/fetch';
import Xterm from './../components/Panel/TerminalFit';
import { message, Spin, notification } from 'antd';
import md5 from 'md5';

const createTerminal = function(props) {

    const openNotificationWithIcon = (type, title, description) => (
	  notification[type]({
	    message: title,
	    description: description,
        duration: 0,
	  })
	);
    var protocol,
        socketURL,
        socket,
        pid,
        port = localStorage.socketPort || 0,
        domain = 'gospely.com',
        baseUrl = 'http://' + domain + ':' + port,
        term = new Xterm({
            cursorBlink: false
        });
    var terminalContainer = document.getElementById("git-terminal");
    var show = document.getElementById("git-show");
    var msgHandler = function(data){
        console.log(data);
    }

    function setTerminalSize() {

        var termParent = document.getElementById('');


        var termWidth = 10,
            termHeight = 10;

        var cols = 16,
            rows = 1,
            width =  '100px',
            height = '100x';

        terminalContainer.style.width = width;
        terminalContainer.style.height = height;
        term.resize(cols, rows);
    }

    term.open(terminalContainer);
    window.term = term;
    fetch(baseUrl + '/terminals?cols=' + 1 + '&rows=' + 2, {
        method: 'POST',
        'headers': {
            'Authorization': localStorage.token
        }
    }).then(function(res) {

        res.text().then(function(pid) {

            window.pid = pid;
            socketURL += pid;
            protocol = (location.protocol === 'https:') ? 'wss://' : 'ws://';
            socketURL = protocol + domain + ':' + port + '/terminals/' + pid;
            socket = new WebSocket(socketURL);
            window.socket = socket;
            // window.socket.send('cd /root/workspace && clear\n');
            localStorage.message = '';
            socket.onopen =runRealTerminal;
            socket.onclose = function(evt){
                console.log("=======onclose");
            };
            socket.onerror = function(evt){
                console.log("=======onclose");
            };

            socket.onmessage = function (evt) {
                //收到服务器消息，使用evt.data提取
                // var check = md5(evt.data);
                // console.log(evt.data.split('root@'));
                if(evt.data.indexOf('root@') < 1 && evt.data.trim() != '' && window.processMsg){
                    console.log(evt.data);
                    if(evt.data.indexOf('begin') > 1){
                        window.begin = 1;
                    }
                    if(window.begin = 1){
                        var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
                		    var isok = reg.test(evt.data);
                        if(isok){
                            props.dispatch({
                                type: 'sidebar/handleModifyGitConfigEmailInputChange',
            					payload: evt.data
                            });
                            window.begin = null;
                        }else {
                            props.dispatch({
                                type: 'sidebar/handleModifyGitConfigInputChange',
                                payload: evt.data
                            });
                        }

                    }
                }
            };
            setTerminalSize()
        });
    });
    function runRealTerminal() {
        term.attach(socket);
        term._initialized = true;
    }
}
export default createTerminal;
