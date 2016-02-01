var app = angular.module('ChessApp', ['ngRoute', 'Authctrl', 'ChessCtrls', 'ChessServices', 'ui.bootstrap']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	$routeProvider
		.when(
			'/', {
				templateUrl: 'app/views/index.html',
				controller: 'ChessMultplyPlayer'
		})
		.when('/signup', {
		    templateUrl: 'app/views/userSignup.html',
		    controller: 'SignupCtrl'
		})
		.when('/login', {
		    templateUrl: 'app/views/userLogin.html',
		    controller: 'LoginCtrl'
		})
		.otherwise ({
			templateUrl: 'views/404.html'
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