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

//Starts server, and logs to terminal when connection is made
io.on('connection', function(socket){
  var userCount = 1;
      for (var user in users){
        userCount++;
      }
  users["guest " + userCount] = socket.id
  console.log('user joined', users);
  io.emit('user connected', users);

  socket.on('chat message', function(msg){
    var obj = {
      msg : msg,
      user : "guest " + userCount
    }
    io.emit('chat message', obj);
  });

  socket.on('disconnect', function(){
    delete users["guest " + userCount];
      var obj = {
        user  : user,
        users : users
      }
    console.log(users, "DELETE");
    io.emit('user leave', users);
  })

// CHESS SOCKET STUFF
// Called when the client calls socket.emit('move')
  socket.on('move', function(msg) {
    console.log("SEE ME now", msg)
    socket.broadcast.emit('move', msg);
  });
});

//Auth post routes
app.post('/api/auth', function(req, res) {
  User.findOne({email: req.body.email}, function(err, user) {
    if (err || !user) return res.send({message: 'User not found'});
    user.authenticated(req.body.password, function(err, result) {
      if (err || !result) return res.send({message: 'User not authenticated'});
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
  http.listen(3000, function(){
    console.log('listening on port 3000');
  });
})