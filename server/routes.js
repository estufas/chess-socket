var path 			= require('path');
var app 			= require('express');
var http            = require('http').Server(app);
var io              = require('socket.io')(http);

module.exports = {

  '/' : function(req, res){
	res.sendFile(path.join(__dirname, '../client/index.html'));
  }
};
// console.log('TEST');
// io.on('connection', function(socket){
//   socket.on('chat message', function(msg){
//     io.emit('chat message', msg);
//   });
// });