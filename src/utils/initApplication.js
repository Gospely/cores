import fetch from 'dva/fetch';
import configs from '../configs.js';

import { message, Spin, notification } from 'antd';

const openNotificationWithIcon = (type, title, description) => (
  notification[type]({
    message: title,
    description: description,
  })
);

const initApplication = function (props){

  var applicationId = props.params.id,
  url = configs.baseURL + "applications/" + applicationId;
  console.log("===============initApplication===========");

  if(applicationId != localStorage.applicationId) {

  	console.log(applicationId);
  	console.log("===============initApplication different===========");
  	if(applicationId != null && applicationId != undefined) {

  		fetch(url).then(function(response){
  			if (response.status >= 200 && response.status < 300) {
  		    return response;
  		  }
  		  const error = new Error(response.statusText);
  		  error.response = response;
  		  openNotificationWithIcon('error', '出错了: ' + response.status, response.statusText);
  		  throw error;
  		})
      .then(function(response){
  			return response.json();
  		})
      .then(function(data){

  			console.log(data);
  			if(data.code == 200 || data.code == 1) {
  		    if(data.message != null) {
  		      message.success(data.message);
  		    }
  		  }else {
  		    if(typeof data.length == 'number') {
  		      return data;
  		    }
  		    openNotificationWithIcon('error', data.message, data.fields);
  		  }
  			var application = data.fields;
  			localStorage.dir = localStorage.user + '/' + application.name + '_' + localStorage.userName + "/";
  			localStorage.currentProject = application.name;
  			localStorage.port = application.port;
  			localStorage.sshPort = application.sshPort;
  			localStorage.socketPort = application.socketPort;
  			localStorage.domain = application.domain;
  			localStorage.currentFolder = localStorage.user + '/' + application.name + '_' + localStorage.userName;
        localStorage.terminal = application.docker;
        localStorage.applicationId = application.id;


  			props.dispatch({
  				type: 'file/fetchFileList'
  			});
  			props.dispatch({
  				type: 'devpanel/handleImages',
  				payload: { id : application.image}
  			});
  		});
    }
  }
	return true;

}
export default initApplication;
