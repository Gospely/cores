'use strict';

const fs = require('fs');

module.exports = {

  	'GET /static/*': function (req, res) {
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
