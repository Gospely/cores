import React , {PropTypes} from 'react';
import { message, notification } from 'antd';
import request from './request';
import config from '../configs'
import fileListen from './fileListen';
import initState from './initUIState'

const initApplication = function (application, props, flag){

    //清除定时器
        window.clearInterval(window.uistateSave)
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
                    id: application.id,
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
        }else{
        props.dispatch({
            type: 'devpanel/showLoading',
            payload: {
              tips: '打开应用中...'
            }
        });

        window.isWeapp = false;
        // localStorage.defaultActiveKey = 'file';
        // localStorage.activeMenu = "setting";

        localStorage.dir = localStorage.user + '/' + application.docker.replace('gospel_project_', '') + "/";
        localStorage.currentFolder = localStorage.user + '/' + application.name + '_' + localStorage.userName;
        localStorage.baseURL = 'http://' + ( localStorage.host ) + ':9999/';
        localStorage.sshKey = application.sshKey;
        localStorage.exposePort = application.exposePort;

        if((application.domain != null && application.domain != '') && !config.dev){
            localStorage.domain = application.domain + '.gospely.com';
        }else{
            localStorage.domain = application.host + ':' + application.port;
        }

        if(application.version){
            localStorage.version = application.version;
        }else {
            localStorage.version = 'null';
        }

        props.dispatch({
            type: 'devpanel/initPanel'
        });

        if (!props.sidebar.appCreatingForm.fromGit) {
            props.dispatch({
                type: 'file/fetchFileList'
            });
        }

        props.dispatch({
            type: 'file/initFiles',
        });

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
                  email: application.gitEmail
              }
            });
        }else {
            props.dispatch({
              type: 'sidebar/setGitOrigin',
              payload: {
                  gitOrigin: application.git,
                  isGit: true,
                  userName: application.gitUser,
                  email: application.gitEmail
              }
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

        if(localStorage.UIState != null && localStorage.UIState != undefined){

            var UIState = JSON.parse(localStorage.UIState);
            if(UIState.applicationId != application.id){

                props.dispatch({
                    type: 'UIState/readConfig',
                    payload: {
                        id: application.id,
                        ctx: props
                    }
                });

            }else{
                initState(props, application.id);
            }
        }else {
            props.dispatch({
                type: 'UIState/readConfig',
                payload: {
                    id: application.id,
                    ctx: props
                }
            });
        }


        localStorage.currentProject = application.name;
        localStorage.port = application.port;
        localStorage.sshPort = application.sshPort;
        localStorage.socketPort = application.socketPort;
        localStorage.image = application.image;
        localStorage.docker = application.docker;
        localStorage.applicationId = application.id;

        var namespace = localStorage.user + localStorage.currentProject + '_' + localStorage.userName;
        fileListen(props, namespace)

        var command = JSON.parse(application.cmds);

        if(command) {
            //初始化命令
            props.dispatch({
              type: 'sidebar/initRunCommond',
              payload: { command: command.default, port: application.exposePort}
            });

        }

        notification.open({
            message: '应用初始化成功'
        });
        props.dispatch({
            type: 'devpanel/hideLoading'
        });
    }

    setTimeout(function(){
        localStorage.flashState = 'true';
    }, 10000);

}

export default initApplication;
