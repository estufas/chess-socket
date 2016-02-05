var app = angular.module('ChessApp', ['ngRoute', 'Authctrl', 'ChessCtrls', 'ChessServices', 'ui.bootstrap']);

app.directive('modalDialog', function() {
  return {
    restrict: 'E',
    scope: {
      show: '='
    },
    replace: true, // Replace with the template below
    transclude: true, // we want to insert custom content inside the directive
    link: function(scope, element, attrs) {
      scope.dialogStyle = {};
      if (attrs.width)
        scope.dialogStyle.width = attrs.width;
      if (attrs.height)
        scope.dialogStyle.height = attrs.height;
      scope.hideModal = function() {
        scope.show = false;
      };
    },
    template: "<div class='ng-modal' ng-show='show'><div class='ng-modal-overlay' ng-click='hideModal()'></div><div class='ng-modal-dialog' ng-style='dialogStyle'><div class='ng-modal-close' ng-click='hideModal()'>X</div><div class='ng-modal-dialog-content' ng-transclude></div></div></div>"
  };
});

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	$routeProvider
		.when('/', {
		    templateUrl: 'app/views/index.html'
    		})
		.when(
			'/dash-board', {
				templateUrl: 'app/views/dashBoard.html'
		})
        	.when(
                    '/multi-player1', {
                        templateUrl: 'app/views/multplyPlayer1.html'
              })
              .when(
                    '/multi-player2', {
                      templateUrl: 'app/views/multplyPlayer2.html'
              })
              .when(
              	'/multi-player3', {
              	   templateUrl: 'app/views/multplyPlayer3.html'
        	})
		.otherwise ({
			templateUrl: 'app/views/404.html'
		});

		$locationProvider.html5Mode({
			  enabled: true,
			  requireBase: false
			});
		}])
		.config(['$httpProvider', function($httpProvider) {
		  $httpProvider.interceptors.push('AuthInterceptor');
		}]).run(['$rootScope', 'Auth', function($rootScope, Auth) {
		  $rootScope.isLoggedIn = function(){
		    return Auth.isLoggedIn.apply(Auth);
		  }
}]);