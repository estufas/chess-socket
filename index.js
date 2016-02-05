// var request         = require('request');
var express     = require('express');
var mongoose    = require('mongoose');
var bodyParser  = require('body-parser');
var expressJWT  = require('express-jwt');
var _           = require('lodash');
var path        = require('path');
var app         = express();
var http        = require('http').Server(app);
var io          = require('socket.io')(http);
var User        = require('./models/user');
var sanitizeHtml = require('sanitize-html');
var jwt          = require('jsonwebtoken');
var secret       = "juicyjforpresident";

//Connect to mongo, then execute server logic
// mongoose.connect( 'mongodb://production:final@ds060968.mongolab.com:60968/final');
mongoose.connect('mongodb://localhost/final_project');
mongoose.connection.once('open', function(){
//Middleward etc.
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(express.static(path.join(__dirname, 'client')));
  app.use('/api/users', require('./controllers/users'));
  app.use('/api/users', expressJWT({secret: secret})
  .unless({path: ['/api/users'], method: 'post'}));
  app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
      res.status(401).send({message: 'You need an authorization token to view this information.'})
    }
});
//CHAT SOCKET STUFF
var users = {};
var currentUser;
var rooms = ['1', '2', '3'];
var userCount;


//Starts server, and logs to terminal when connection is made
io.sockets.on('connection', function(socket){
  console.log('user joined', users);
  io.emit('user connected', users);

  socket.on('adduser', function (user){
    console.log(currentUser);
    userCount = 1;
    userCount ++;
      if(currentUser) {
        users[currentUser] = socket.id
      } else {
        users['guest'+userCount] = socket.id
      }
    console.log("Add User Function" + users)
    socket.user = Object.keys(users);
    socket.room = '1';
    socket.join('1');
    // socket.emit('chat message', 'SERVER', 'you have connected to room1');
    // // echo to room 1 that a person has connected to their room
    socket.broadcast.to('1').emit('chat message',  user);
    console.log(rooms);
    socket.emit('updaterooms', rooms, '1');
  });

  socket.on('chat message', function(msg){
    var obj = {
      msg : msg,
      user : "guest " + userCount
    }
    io.sockets.in(socket.room).emit('chat message', socket.user, obj);
  });

  socket.on('switchRoom', function(newroom){
    socket.leave(socket.room);
    socket.join(newroom);
    console.log(newroom, "LOOOOOOOOOOOOK");
    socket.emit('updatechat', 'SERVER', 'you have connected to '+ newroom);
    // sent message to OLD room
    socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', socket.user +' has left this room');
    // update socket session room title
    socket.room = newroom;
    socket.broadcast.to(newroom).emit('updatechat', 'SERVER', socket.user +' has joined this room');
    socket.emit('updaterooms', rooms, newroom);
  });

  socket.on('disconnect', function(){
    if(currentUser) {
      delete users[currentUser]
      var obj = {
        // user  : user,
        users : users
      }
    } else {
    delete users["guest " + userCount];
      var obj = {
        // user  : user,
        users : users
      }
    console.log(users, "DELETE");
    io.emit('user leave', users);
  }
})

// CHESS SOCKET STUFF
// Called when the client calls socket.emit('move')
  socket.on('move', function(msg) {
    console.log("SEE ME now", msg)
    io.sockets.in(socket.room).emit('move', msg)
    // socket.broadcast.emit('move', msg);
  });
});

//Auth post routes
app.post('/api/auth', function(req, res) {
  User.findOne({email: req.body.email}, function(err, user) {
    if (err || !user) return res.send({message: 'User not found'});
    user.authenticated(req.body.password, function(err, result) {
      if (err || !result) return res.send({message: 'User not authenticated'});
      console.log(user.name + 'LOOOOOOOOOOKKKKK HHHHHHHEEEEEERRRRRREEE');
      currentUser = user.name;
      var token = jwt.sign(user, secret);
      res.send({user: user, token: token});
    });
  });
});
//Import routes from server file
  var routes = require('./server/routes');
  _.each(routes, function(controller, route) {
    app.use(route, controller);
  });
  http.listen(process.env.PORT || 3000);
})