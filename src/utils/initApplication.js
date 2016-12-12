const openNotificationWithIcon = (type, title, description) => (
  notification[type]({
    message: title,
    description: description,
  })
);

const initApplication = function (application,props){

  localStorage.dir = localStorage.user + '/' + application.name + '_' + localStorage.userName + "/";
  localStorage.currentProject = application.name;
  localStorage.port = application.port;
  localStorage.sshPort = application.sshPort;
  localStorage.socketPort = application.socketPort;
  localStorage.domain = application.domain;
  localStorage.image = application.image;
  localStorage.currentFolder = localStorage.user + '/' + application.name + '_' + localStorage.userName;
  localStorage.applicationId = application.id;
  var UIState = JSON.parse(localStorage.UIState);
  console.log(UIState);
  props.dispatch({
    type: 'file/fetchFileList'
  });
  props.dispatch({
    type: 'file/initFiles',
  });
  props.dispatch({
    type: 'UIState/readConfig',
    payload: {
      id: application.id
    }
  });
  props.dispatch({
    type: 'devpanel/getConfig',
    payload: { id : application.id, UIState: UIState.UIState.devpanel}
  });
  props.dispatch({
      type: 'sidebar/hideModalSwitchApp'
  });
  props.dispatch({
      type: 'sidebar/initState',
      payload: { UIState: UIState.UIState.sidebar }
  });
  console.log(UIState.UIState.rightbar);
  props.dispatch({
      type: 'rightbar/initState',
      payload: { UIState: UIState.UIState.rightbar }
  });
  props.dispatch({
    type: 'devpanel/openTerminal',
    payload: { id:  application.docker}
  });
  props.dispatch({
    type: 'devpanel/startDocker',
    payload: { id: application.id}
  });

}
export default initApplication;
