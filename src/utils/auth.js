import fetch from 'dva/fetch';
import configs from '../configs.js';

const auth = function (router) {

	console.log("====================auth=======================");
	console.log(router);
	function getCookie(c_name) {
		if (document.cookie.length > 0) {
		  	var c_start = document.cookie.indexOf(c_name + "=");
		  if (c_start != -1) {
		    c_start = c_start + c_name.length + 1;
		    var c_end = document.cookie.indexOf(";",c_start);
		    if (c_end == -1) c_end=document.cookie.length;
		    return unescape(document.cookie.substring(c_start,c_end));
		  }
		}
		return "";
	}

	var user = getCookie('user'),
		token =  getCookie('token'),
		userName =  getCookie('userName');

	if(token != null && token != undefined && token != '') {
		var url = configs.baseURL + "innersessions/" + token;
		fetch(url).then(function(res){
			console.log(res);
		});
		// if(localStorage.applicationId != null){
		// 	window.location.href = 'http://localhost:8989/#/project/' + localStorage.applicationId;
		// }
	}else{

		// window.location.href = 'http://dash.gospely.com';
		sessionStorage.from = 'ide';
		window.location.href = 'http://localhost:8088/#!/accounts/login?where=fromIde';
	}
	localStorage.user = user;
	localStorage.token = token;
	localStorage.userName = userName;
	return true;

}

export default auth;
