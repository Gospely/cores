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
            };
            socket.onerror = function(evt){
            };

            socket.onmessage = function (evt) {
                //收到服务器消息，使用evt.data提取
                if(evt.data.indexOf('root@') < 1 && evt.data.length > 2 && evt.data.indexOf('workspace') < 1){

                    if(window.gitOrigin){

                        if (/https:\/\/github.com\/?/.test(evt.data) || /git@github.com:?/.test(evt.data)) {
                            props.dispatch({
        						type: 'sidebar/setGitOrigin',
                                payload: { gitOrigin: evt.data, isGit: true }
        					})
                            window.gitOrigin = false;
                        }
                    }
                    if(window.getConfig){
                        if(window.Pname){
                            props.dispatch({
                                type: 'sidebar/handleModifyGitConfigInputChange',
                                payload: evt.data
                            });
                            window.Pname = false;
                        }
                        if(window.email){
                            window.email = false;
                            props.dispatch({
                                type: 'sidebar/handleModifyGitConfigEmailInputChange',
                                payload: evt.data
                            });
                        }
                        if(evt.data.indexOf('Pname') >= 0){
                            window.Pname = true;
                        }
                        if(evt.data.indexOf('Pemail') >= 0){
                            window.email = true;
                        }

                        // var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
                        //     var isok = reg.test(evt.data);
                        // if(isok){}

                    }
                }
            };
            setTerminalSize()
        });
    });
    function runRealTerminal() {
        term.attach(socket);
        window.gitOrigin = true;
        socket.send("cd /root/workspace && git remote -v | head -1 | awk '{print $2}'\n");
        socket.send('echo begin');
        notification.open({
            message: 'git 设置服务已启动'
        });
        term._initialized = true;
    }
}
export default createTerminal;
