angular.module('Authctrl', ['ChessServices'])
.controller('HomeCtrl', ['$scope', function($scope) {
}])
.controller('NavCtrl', ['$scope', 'Auth', 'Alerts', function($scope, Auth, Alerts) {
  $scope.alerts = Alerts.get();
  $scope.user = Auth.currentUser();

  $scope.closeAlert = function(idx) {
    Alerts.remove(idx);
  };
  $scope.logout = function() {
    Auth.removeToken();
  }
}])



.controller('SocketCtrl', ['$scope', '$http', '$location', function($scope, $http, $location) {
  var socket = io();
  $scope.message;

//Sends chat message to io server
   $scope.sendChat = function(event) {
    socket.emit('chat message', $scope.message);
    $scope.message = '';
  };
//Client response when user connects to server
  socket.on('user connected', function(users) {
    console.log(users);
    $scope.objKeys = Object.keys(users);
    $scope.$watch(function() {
      return $scope.objKeys
    }, function(data) {
    // $scope.watchObj = $scope.objKeys
    console.log(data)
    })
  console.log(Object.keys(users));
  })
//Posts messages from server to chatbox
  socket.on('chat message', function(obj){
    $('#messages').append($('<li>').text(obj['user'] + ' ' + obj['msg']));
  })
//What happens when user leaves room
  socket.on('user leave', function(users) {
    console.log('user left')
    $scope.objKeys = Object.keys(users);
    })
}])




//separate controllers for login/signup
.controller('UserCtrl', ['$scope', '$http', '$location', 'Alerts', 'Auth',  function($scope, $http, $location, Alerts, Auth) {
  $scope.modalShown = false;
  $scope.user = {
    email: '',
    password: ''
  };
  $scope.userSignup = function() {
    $http.post('/api/users', $scope.user).then(function success(res) {
      $http.post('/api/auth', $scope.user).then(function success(res) {
        Auth.saveToken(res.data.token);
        $location.path('/dash-board');
      }, function error(res) {
        console.log(data);
      });
    }, function error(res) {
      console.log(data);
    });
  }
  $scope.toggleModal = function() {
    $scope.modalShown = !$scope.modalShown;
  };
}])
.controller('User1Ctrl', ['$scope', '$http', '$location', 'Alerts', 'Auth',  function($scope, $http, $location, Alerts, Auth) {
  console.log(Auth.isLoggedIn());
  var socket = io();
  $scope.user = {
    email: '',
    password: ''
  };
 $scope.userLogin = function() {
    $http.post('/api/auth', $scope.user).then(function success(res) {
      Auth.saveToken(res.data.token);
      console.log(res.data);
      if(res.data.token) {
        $location.path('/dash-board');
      } else {
        console.log('failure');
      }
    }, function error(res) {
      console.log(data);
    });
  }
  $scope.modalShown = false;
  $scope.toggleModal = function() {
    $scope.modalShown = !$scope.modalShown;
  };
}])