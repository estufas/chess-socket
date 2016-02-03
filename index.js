// var request         = require('request');
var express         = require('express');
var mongoose        = require('mongoose');
var bodyParser      = require('body-parser');
var expressJWT      = require('express-jwt');
var _               = require('lodash');
var path 			      = require('path');
var app             = express();
var http            = require('http').Server(app);
var io              = require('socket.io')(http);
var User            = require('./models/user');
var secret          = "juicyjforpresident";


io.on('connection', function(socket){
  console.log('user joined chat');
  socket.on('chat message', function(msg){
    console.log('message');
    io.emit('chat message', msg);
  });
// Called when the client calls socket.emit('move')
  socket.on('move', function(msg) {
    console.log("SEE ME now", msg)
    socket.broadcast.emit('move', msg);
  });
});



mongoose.connect('mongodb://localhost/final_project');

mongoose.connection.once('open', function(){

  //Load DB modelss
  app.models = require('./server/models/index');

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

  // Load the routes.
  var routes = require('./server/routes');
  _.each(routes, function(controller, route) {
    app.use(route, controller);
  });

  http.listen(3000, function(){
    console.log('listening on port 3000');
  });
});