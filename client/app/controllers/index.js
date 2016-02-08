angular.module('Authctrl', ['ChessServices'])
.controller('HomeCtrl', ['$scope', function($scope) {
}])
.controller('NavCtrl', ['$scope', 'Auth', 'Alerts', function($scope, Auth, Alerts) {
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
    $scope.users = users;
    socket.emit('adduser');
  })
//Posts messages from server to chatbox
  socket.on('chat message', function(msg, tokenName){
    chatWindow = $('#chatWindow')
    
    isScrolledToBottom = chatWindow[0].scrollHeight - chatWindow.outerHeight() <= chatWindow.scrollTop() + 1;      
    if (tokenName) {
      chatWindow.append($('<p>').text(tokenName + ":  " + msg));
    } else {
      chatWindow.append($('<p>').text("guest:  " + msg));
    }

    if(isScrolledToBottom) {
      scrollWindow();
    }
  })

  $scope.setTeam = function(team) {
      socket.emit('set room', team)
      console.log(team);
    };

  // socket.on('updaterooms', function(rooms, current_room) {
  //   $scope.rooms = rooms;
  //   console.log(rooms, current_room);
  // })

  // $scope.switchRoom = function(room) {
  //   socket.emit('switchRoom', room);
  //   console.log('Hola', room);
  // }
//What happens when user leaves room
  socket.on('user leave', function(users) {
    console.log('user left')
    $scope.objKeys = Object.keys(users);
  })
  // $timeout(function(){
  //     if($location.path() === '/multi-player1') {
  //       $scope.switchRoom('1')
  //     }
  // }, 700)

  var scrollWindow = function() {
    var chatWindow = $('#chatWindow');
    chatWindow[0].scrollTop = chatWindow[0].scrollHeight - chatWindow.outerHeight();
  }
}])




//separate controllers for login/signup
.controller('UserCtrl', ['$scope', '$http', '$location', 'Alerts', 'Auth',  function($scope, $http, $location, Alerts, Auth) {
  $scope.modalShown1 = false;
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
  $scope.toggleModal1 = function() {
    $scope.modalShown1 = !$scope.modalShown1;
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