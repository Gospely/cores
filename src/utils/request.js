import fetch from 'dva/fetch';
import configs from '../configs.js';

import { message, Spin } from 'antd';

function parseJSON(response) {
  return response.json();
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

function checkResData(data) {
  console.log(data,  typeof data);
  if(data.code != 200) {
    if(typeof data.length == 'number') {
      return data;
    }

    message.error(data.message + '\r\n' + data.fields);
  }else {
    message.success(data.message);
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
  message.success('正在执行操作...');
  return fetch(url, options)
    .then(checkStatus)
    .then(parseJSON)
    .then(checkResData)
    .then((data) => ({ data }))
    .catch((err) => ({ err }));
}
