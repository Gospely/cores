'use strict';

const fs = require('fs');

module.exports = {

  	'GET /static/*': function (req, res) {
    	var fileName = './' + req.url,
    		srcList = req.url.split('/'),
    		file = srcList.pop(),
    		imgExt = ['jpg', 'png', 'bmp', 'jpeg', 'gif'],

    		fileInfo = file.split('.'),

    		isImg = false;

		if(fileInfo.length >= 2) {
			var fileExt = fileInfo[1];
			isImg = imgExt.indexOf(fileExt) === -1 ? false : true ;
		}

    	if(!isImg) {

			fs.readFile(fileName, {
				flag: 'r+',
				encoding: 'utf8'
			}, function(error, data) {
				if (error) {
					res.end(error);
				}else {
					res.end(data);
				}
			});

    	}else {
    		try {
	    		var content =  fs.readFileSync(fileName, "binary");    			
	    		res.end(content, "binary");
    		} catch(err) {
    			res.end(err);
    		}
    	}
  	},
    'GET /snippets/*': function (req, res) {
    	var fileName = './' + req.url;
		fs.readFile(fileName, {
			flag: 'r+',
			encoding: 'utf8'
		}, function(error, data) {
			if (error) {
				res.end(error);
			}else {
				res.end(data);
			}
		});
  	},

};
