import fetch from 'dva/fetch';
import Xterm from './../components/Panel/TerminalFit';

import { message, Spin, notification } from 'antd';

import md5 from 'md5';


const createTerminal = function(props) {

    console.log(props);
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
        console.log(cols, rows, termWidth, termHeight, width, height, 30,
            30, '');
        terminalContainer.style.width = width;
        terminalContainer.style.height = height;
        term.resize(cols, rows);
    }

    term.open(terminalContainer);
    window.term = term;
    // fetch(baseUrl + '/terminals?cols=' + 1 + '&rows=' + 2, {
    //     method: 'POST'
    // }).then(function(res) {
    //
    //     res.text().then(function(pid) {
    //
    //         console.log("=======================getSocket============");
    //         window.pid = pid;
    //         socketURL += pid;
    //         protocol = (location.protocol === 'https:') ? 'wss://' : 'ws://';
    //         socketURL = protocol + domain + ':' + port + '/terminals/' + pid;
    //         socket = new WebSocket(socketURL);
    //         console.log(socket);
    //         window.socket = socket;
    //         // window.socket.send('cd /root/workspace && clear\n');
    //         localStorage.message = '';
    //         socket.onopen =runRealTerminal;
    //         socket.onclose = function(evt){
    //             console.log("=======onclose");
    //         };
    //         socket.onerror = function(evt){
    //             console.log("=======onclose");
    //         };
    //
    //         socket.onmessage = function (evt) {
    //             //收到服务器消息，使用evt.data提取
    //             console.log("=======message=======");
    //             // var check = md5(evt.data);
    //             if(localStorage.message != ''){
    //                 localStorage.message = localStorage.message + "\n\r" + evt.data;
    //                 console.log("=======message=======");
    //
    //                 console.log(terminalContainer);
    //                 var messages = terminalContainer.childNodes[0].childNodes[2].childNodes;
    //                 console.log(messages.length);
    //                 for (var i = 0; i < messages.length; i++) {
    //                     console.log(messages[i].childNodes)
    //                     if(i != 0 && i != messages.length-1 && messages[i].childNodes.length == 1 && messages[i].childNodes[0].nodeValue != '' && messages[i].childNodes[0].nodeValue != undefined){
    //
    //                         console.log(messages[i]);
    //                         localStorage.message = localStorage.message + messages[i].childNodes[0].nodeValue.replace(new RegExp("l", 'gm'), "");
    //                     }else{
    //
    //                     }
    //                 }
    //                 // localStorage.message = localStorage.message + "nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
    //                 // localStorage.message = localStorage.message + evt.data;
    //                 notification.destroy();
    //                 console.log(messages.innerHTML);
    //                 openNotificationWithIcon('info', localStorage.gitOperate, localStorage.message);
    //             }
    //         };
    //         setTerminalSize()
    //     });
    // });
    function runRealTerminal() {
        console.log(socket);
        term.attach(socket);
        term._initialized = true;
    }
}
export default createTerminal;
