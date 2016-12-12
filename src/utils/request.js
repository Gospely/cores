import fetch from 'dva/fetch';
import configs from '../configs.js';

import { message, Spin, notification } from 'antd';

const openNotificationWithIcon = (type, title, description) => (
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
  console.log(response.statusText);
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
    console.log(data.message);
    openNotificationWithIcon('error', data.message, data.fields);
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
  url = configs.baseURL + url;
  return fetch(url, options)
    .then(checkStatus)
    .then(parseJSON)
    .then(checkResData)
    .then((data) => ({ data }))
    .catch((err) => ({ err }));
}
