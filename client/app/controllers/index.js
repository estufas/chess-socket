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

.controller('UserCtrl', ['$scope', '$http', '$location', 'Alerts',  function($scope, $http, $location, Alerts) {
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
  $scope.userLogin = function() {
    $http.post('/api/auth', $scope.user).then(function success(res) {
      Auth.saveToken(res.data.token);
      $location.path('/')
    }, function error(res) {
      console.log(res)
    })
  }
  //  $scope.showModal = false;
  //   $scope.toggleModal = function(){
  //       $scope.showModal = !$scope.showModal;
  //   };

  // mymodal.directive('modal', function () {
  //     return {
  //       template: '<div class="modal fade">' +
  //           '<div class="modal-dialog">' +
  //             '<div class="modal-content">' +
  //               '<div class="modal-header">' +
  //                 '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
  //                 '<h4 class="modal-title">{{ title }}</h4>' +
  //               '</div>' +
  //               '<div class="modal-body" ng-transclude></div>' +
  //             '</div>' +
  //           '</div>' +
  //         '</div>',
  //       restrict: 'E',
  //       transclude: true,
  //       replace:true,
  //       scope:true,
  //       link: function postLink(scope, element, attrs) {
  //         scope.title = attrs.title;

  //         scope.$watch(attrs.visible, function(value){
  //           if(value == true)
  //             $(element).modal('show');
  //           else
  //             $(element).modal('hide');
  //         });

  //         $(element).on('shown.bs.modal', function(){
  //           scope.$apply(function(){
  //             scope.$parent[attrs.visible] = true;
  //           });
  //         });

  //         $(element).on('hidden.bs.modal', function(){
  //           scope.$apply(function(){
  //             scope.$parent[attrs.visible] = false;
  //           });
  //         });
  //       }
  //     };
}])

.controller('SocketCtrl', ['$scope', '$http', '$location', function($scope, $http, $location) {
  var socket = io();
  $scope.message;
  $scope.sendChat = function(event) {
    socket.emit('chat message', $scope.message);
    $scope.message = '';
  };
    socket.on('chat message', function(obj){
      console.log(obj);
      $('#messages').append($('<li>').text(obj.user + ' ' + obj.msg));
  })
    socket.on('user connected', function(users) {
      console.log(users);
      $scope.objKeys = Object.keys(users);
      $scope.$watch(function() {
        console.log(users);
        return $scope.objKeys
      }, function(data) {
        // $scope.watchObj = $scope.objKeys
        console.log(data)
      })
      console.log(Object.keys(users)); 
    })
    socket.on('user leave', function(users) {
      console.log()
      $scope.objKeys = Object.keys(users);
    })
}])
