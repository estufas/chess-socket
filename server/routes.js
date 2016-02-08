var path 		 = require('path');
var app 		 = require('express');

module.exports = {

  '/' : function(req, res){
	res.sendFile('client/index.html', { root: __dirname});
  }
};
