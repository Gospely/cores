import fetch from 'dva/fetch';
import Xterm from './../components/Panel/TerminalFit';


const createTerminal = function(props) {

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
    function setTerminalSize() {

        var termParent = document.getElementById('');


        var termWidth = 1,
            termHeight = 1;

        var cols = 1,
            rows = 1,
            width =  '2px',
            height = '1px';

        console.log(cols, rows, termWidth, termHeight, width, height, 1,
            1, '');
        terminalContainer.style.width = width;
        terminalContainer.style.height = height;
        term.resize(cols, rows);
    }

    term.open(terminalContainer);
    fetch(baseUrl + '/terminals?cols=' + 1 + '&rows=' + 2, {
        method: 'POST'
    }).then(function(res) {

        res.text().then(function(pid) {

            console.log("=======================getSocket============");
            window.pid = pid;
            socketURL += pid;
            protocol = (location.protocol === 'https:') ? 'wss://' : 'ws://';
            socketURL = protocol + domain + ':' + port + '/terminals/' + pid;
            socket = new WebSocket(socketURL);
            console.log(socket);
            window.socket = socket;
            // window.socket.send('cd /root/workspace && clear\n');

            socket.onopen =runRealTerminal;
            socket.onclose = function(evt){
                console.log("=======onclose");
            };
            socket.onerror = function(evt){
                console.log("=======onclose");
            };

            socket.onmessage = function (evt) {
                //收到服务器消息，使用evt.data提取
                console.log("=======message=======");
                console.log(props);
                console.log(evt.data);
                props.dispatch({
                    type: 'editorTop/flashTerminalMessage',
                    payload: { message: evt.data }
                });
            };
            setTerminalSize()
        });
    });
    function runRealTerminal() {
        console.log(socket);
        term.attach(socket);
        term._initialized = true;
    }
}
export default createTerminal;
