import React , {PropTypes} from 'react';
import { message, notification } from 'antd';
import request from './request';
import config from '../configs'
import fileListen from './fileListen';
import initState from './initUIState'
import initData from './initData'


const initApplication = function (application, props, flag, layout){

    //清除定时器
    console.log('initApplication');
    window.clearInterval(window.uistateSave)
    window.VDDnddata = {};
    //断开上一个socket
    if(window.fileSocket != null && !flag) {
        window.fileSocket.emit('leave', localStorage.applicationId + localStorage.userName);
        window.fileSocket.disconnect();
    }
    window.socket = null;
    if(localStorage.applicationId == application.id){
        window.reload = false;
    }else{
        window.reload = true;
    }
    if(application.creator != localStorage.user){
        window.location.href = window.location.origin;
        return false;
    }
    if(location.hash.indexOf('project') == -1) {
        return false;
    }

    window.isWeapp = true;

    if(application.image == 'wechat:latest'){

        localStorage.image = application.image;
        localStorage.currentProject = application.name;
        localStorage.applicationId = application.id;

        props.dispatch({
          type: 'sidebar/hideModalSwitchApp'
        });
        props.dispatch({
          type: 'sidebar/setActiveMenu',
          payload: 'controllers'
        });

        localStorage.activeMenu = 'attr';

        if(!flag){
            var title = (
                    <span>
                        <i className="fa fa-weixin"></i> Gospel 小程序 UI 设计器
                    </span>
                ),

                type = 'designer';

            props.dispatch({
                type: 'devpanel/add',
                payload: {title, type}
            });
        }
        props.dispatch({
            type: 'UIState/readConfig',
            payload: {
                id: application.id
            }
        });

        if(localStorage.UIState != '' && localStorage.UIState != null && localStorage.UIState != undefined && window.reload == false){

            var UIState = JSON.parse(localStorage.UIState);
            props.dispatch({
                type: 'designer/initState',
                payload: { UIState: UIState.UIState.designer }
            });
            props.dispatch({
                type: 'cpre/initState',
                payload: { UIState: UIState.UIState.previewer }
            });
            var key = 'single'
            props.dispatch({
              type: 'layout/handleClick',
              payload: key
            });
        }else {
            props.dispatch({
                type: 'devpanel/wechatInit',
            });

            setTimeout(function(){
                props.dispatch({
                  type: 'designer/getConfig',
                  payload: { id : application.id}
                });
            }, 200);

            var key = 'single'
            props.dispatch({
              type: 'layout/handleClick',
              payload: key
            });
        }
        setTimeout(function() {
            props.dispatch({
              type: 'rightbar/setActiveMenu',
              payload: 'attr'
            });
        }, 200);

        var inter = setInterval(function() {

            if(window.gospelDesigner) {
                clearInterval(inter);

                props.dispatch({
                    type: 'attr/setFormItemsByDefault'
                });

                props.dispatch({
                    type: 'designer/handleCtrlSelected'
                });

            }

        }, 200);
        if(window.reload && ! flag){
            setTimeout(function(){
                window.location.reload();
            }, 2000);

        }
        localStorage.flashState = 'true'
    }else{

        props.dispatch({
            type: 'devpanel/showLoading',
            payload: {
              tips: '打开应用中...'
            }
        });
        localStorage.dir = localStorage.user + '/' + application.docker.replace('gospel_project_', '') + "/";
        localStorage.currentFolder = localStorage.user + '/' + application.name + '_' + localStorage.userName;
        localStorage.baseURL = 'http://' + ( localStorage.host ) + ':9999/';
        localStorage.sshKey = application.sshKey;
        localStorage.exposePort = application.exposePort;

        if(application.version){
            localStorage.version = application.version;
        }else {
            localStorage.version = 'null';
        }

        localStorage.currentProject = application.name;
        localStorage.port = application.port;
        localStorage.sshPort = application.sshPort;
        localStorage.socketPort = application.socketPort;
        localStorage.image = application.image;
        localStorage.docker = application.docker;
        localStorage.applicationId = application.id;
        if(!flag) {
            if(localStorage.UIState){

                var UIState = JSON.parse(localStorage.UIState);
                if(UIState.applicationId == application.id){
                    initState(props, application.id);
                }else {
                    props.dispatch({
                        type: 'vdcore/handleLoading',
                        payload: true
                    });
                    // if(window.frames["vdsite-designer"]){
                    //     window.frames["vdsite-designer"].location.reload();
                    // }
                    props.dispatch({
                        type: 'UIState/readConfig',
                        payload: {
                            id: application.id,
                            ctx: props
                        }
                    });
                }
            }else {
                props.dispatch({
                    type: 'vdcore/handleLoading',
                    payload: true
                });
                // if(window.frames["vdsite-designer"]){
                //     window.frames["vdsite-designer"].location.reload();
                // }
                props.dispatch({
                    type: 'UIState/readConfig',
                    payload: {
                        id: application.id,
                        ctx: props
                    }
                });
            }
        }else {
            if(layout){
                initState(props, application.id, layout);
            }else {
                localStorage.image = application.image;
                initData(props, application.id)
            }
        }


        window.isWeapp = false;

        // localStorage.defaultActiveKey = 'file';
        // localStorage.activeMenu = "setting";


        document.title = localStorage.currentProject + ' - Gospel:先进的在线Web可视化集成开发环境';

        var namespace = localStorage.user + localStorage.currentProject + '_' + localStorage.userName;
        // fileListen(props, namespace);
        if((application.domain != null && application.domain != '') && !config.dev){
            props.dispatch({
                type: 'sidebar/getDomains'
            })
        }else{
            localStorage.domain = application.host + ':' + application.port;
        }



        var command = JSON.parse(application.cmds);

        if(command) {
            //初始化命令
            props.dispatch({
              type: 'sidebar/initRunCommond',
              payload: { command: command.default, port: application.exposePort}
            });

        }
        props.dispatch({
          type: 'sidebar/hideModalSwitchApp'
        });
        if(application.git == null || application.git == ''){
            props.dispatch({
              type: 'sidebar/setGitOrigin',
              payload: {
                  gitOrigin: application.git,
                  isGit: false,
                  userName: application.gitUser,
                  email: application.gitEmail,
                  password: application.gitPassword
              }
            });
        }else {
            props.dispatch({
              type: 'sidebar/setGitOrigin',
              payload: {
                  gitOrigin: application.git,
                  isGit: true,
                  userName: application.gitUser,
                  email: application.gitEmail,
                  password: application.gitPassword
              }
            });
        }
        notification.open({
            message: '应用初始化成功'
        });
        props.dispatch({
            type: 'devpanel/hideLoading'
        });
    }

    props.dispatch({
        type: 'devpanel/startDocker',
        payload: { docker:  application.docker, id: application.id, ctx: props}
    });
    props.dispatch({
        type: 'devpanel/handleImages',
        payload: { id: application.image}
    });
    props.dispatch({
        type: 'UIState/setDySaveEffects'
    });
}

export default initApplication;
