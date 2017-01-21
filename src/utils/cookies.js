function GetCookieDomain() {
	var host = location.hostname;
	var ip = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
	if (ip.test(host) === true || host === 'localhost') return host;
	var regex = /([^]*).*/;
	var match = host.match(regex);
	if (typeof match !== "undefined" && null !== match) host = match[1];
	if (typeof host !== "undefined" && null !== host) {
		var strAry = host.split(".");
		if (strAry.length > 1) {
			host = strAry[strAry.length - 2] + "." + strAry[strAry.length - 1];
		}
	}
	return '.' + host;
}

export default {

    setCookie: function(c_name, value, expiredays) {
      	var exdate = new Date()
      	exdate.setDate(exdate.getDate() + expiredays)
      	document.cookie = c_name + "=" + escape(value) +
        ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString() + ';domain=' + GetCookieDomain())
    },

	getCookie: function(c_name) {
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

}
