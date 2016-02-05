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



.controller('SocketCtrl', ['$scope', '$http', '$location','$timeout', function($scope, $http, $location, $timeout) {
  var socket = io();
  $scope.message;
  $scope.rooms = [];

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
    socket.emit('adduser');
  })
//Posts messages from server to chatbox
  socket.on('chat message', function(user, obj){
    $('#messages').append($('<li>').text(obj['user'] + ' ' + obj['msg']));
  })

  socket.on('updaterooms', function(rooms, current_room) {
    $scope.rooms = rooms;
    console.log(rooms, current_room);
    // $.each(rooms, function(key, value) {
    //   if (value == current_room){
    //     $('#rooms').append($('<div>').text(value));
    //   } else {
    //     $('#rooms').append('<div><a href="#" onclick="switchRoom(\''+value+'\')">' + value + '</a></div>');
    //   }
    // })
  })
  // $scope.pageSwitch = function(room) {
  //   $location.path('/multi-player'+room);
  // };

  $scope.switchRoom = function(room) {
    socket.emit('switchRoom', room);
    console.log('Hola', room);
  }
//What happens when user leaves room
  socket.on('user leave', function(users) {
    console.log('user left')
    $scope.objKeys = Object.keys(users);
    })
  $timeout(function(){
  if($location.path() === '/multi-player1') {
    $scope.switchRoom('1')
  }  else if($location.path() === '/multi-player2') {
    $scope.switchRoom('2')
  }  else if($location.path() === '/multi-player3') {
    console.log('TEST TETSEgsggs')
    $scope.switchRoom('3')
  }
}, 700)
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