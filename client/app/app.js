var app = angular.module('ChessApp', ['ngRoute']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
		$routeProvider
			.when(
				'/', {
					templateUrl: 'app/views/index.html'
				}
			).otherwise ({
				templateUrl: 'views/404.html'
			});

			//$locationProvider.html5Mode(true);
}]);