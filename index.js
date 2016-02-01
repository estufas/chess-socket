// var request         = require('request');
var express         = require('express');
var mongoose        = require('mongoose');
var bodyParser      = require('body-parser');
var expressJWT      = require('express-jwt');
var _               = require('lodash');
var path 			      = require('path');
var app             = express();
var User            = require('./models/user');
var secret          = "juicyjforpresident";


mongoose.connect('mongodb://localhost/final_project');
mongoose.connection.once('open', function(){

  //Load DB modelss
  app.models = require('./server/models/index');

  app.use(express.static(path.join(__dirname, 'client')));

  // Load the routes.
  var routes = require('./server/routes');
  _.each(routes, function(controller, route) {
    app.use(route, controller);
  });

  console.log("RUNNING");
  app.listen(process.env.PORT || 3000);
});