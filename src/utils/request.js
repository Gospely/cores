import fetch from 'dva/fetch';
import configs from '../configs.js';

import { message, Spin, notification } from 'antd';
import cookie from './cookies';

window.openNotificationWithIcon = (type, title, description) => (
  notification[type]({
    message: title,
    description: description,
  })
);

function parseJSON(response) {
  return response.json();
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  openNotificationWithIcon('error', '出错了: ' + response.status, response.statusText);
  throw error;
}

function checkResData(data) {
  if(data.code == 200 || data.code == 1) {
    if(data.message != null) {
      message.success(data.message);
    }
  }else {

    if(typeof data.length == 'number') {
      return data;
    }
    openNotificationWithIcon('error', '服务器提了个问题', data.message);

    if(data.code == -100) {

        setTimeout(function(){
            cookie.setCookie('token','','Thu, 01 Jan 1970 00:00:00 GMT');
            cookie.setCookie('user','','Thu, 01 Jan 1970 00:00:00 GMT');
            if(document.domain != 'localhost') {
                window.location.href = 'http://dash.gospely.com/#!/accounts/login?where=fromIde';
            }else {
                window.location.href = 'http://localhost:8088/#!/accounts/login?where=fromIde';
            }
        }, 2000);
        return false;
    }
  }
  return data;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
    if(url.split('?')[0] == 'applications' || url.split('?')[0] == 'applications'){
        url = configs.baseURL + url;
    }else{
        url = (localStorage.baseURL || configs.baseURL) + url;
    }z
    if(options == null || options == undefined){
        return fetch(url, {
                  'headers': { 'Authorization': localStorage.token }
               })
                .then(checkStatus)
                .then(parseJSON)
                .then(checkResData)
                .then((data) => ({ data }))
                .catch((err) => ({ err }));
    }else{
        if(options.headers == null || options.headers == undefined){
            options.headers = {
                'Authorization': localStorage.token
            }
        }else{
            options.headers['Authorization'] = localStorage.token;
        }
        return fetch(url, options)
               .then(checkStatus)
               .then(parseJSON)
               .then(checkResData)
               .then((data) => ({ data }))
               .catch((err) => ({ err }));
    }


}
