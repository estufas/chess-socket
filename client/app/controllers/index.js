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
.controller('SignupCtrl', ['$scope', '$http', '$location', 'Alerts',  function($scope, $http, $location, Alerts) {
  $scope.user = {
    email: '',
    password: ''
  };

  $scope.userSignup = function() {
    $http.post('/api/users', $scope.user).then(function success(res) {
      Alerts.add('success', 'User Created!');
      $location.path('/')
    }, function error(res) {
      console.log(res);
    });
  }
}])
.controller('LoginCtrl', ['$scope', '$http', '$location', 'Auth', function($scope, $http, $location, Auth) {
  $scope.user = {
    email: '',
    password: ''
  }

  $scope.userLogin = function() {
    $http.post('/api/auth', $scope.user).then(function success(res) {
      Auth.saveToken(res.data.token);
      $location.path('/')
    }, function error(res) {
      console.log(res)
    })
  }
}])
.controller('SocketCtrl', ['$scope', '$http', '$location', function($scope, $http, $location) {
  var socket = io();
  $scope.message;
  $scope.sendChat = function(event) {
    socket.emit('chat message', $scope.message);
    $scope.message = '';
  }
}])
