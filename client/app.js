var myApp = angular.module('myApp',['ngRoute','ngCookies','moment-picker']);

myApp.factory("user",function($http,$q,$rootScope,$cookies) {
	return {
		getUser: function() {return $cookies.getObject("user_account");
		}
	}
});

myApp.config(function($routeProvider){
	$routeProvider.when('/', {
		controller:'DashboardController',
		templateUrl: 'views/dashboard.html'
	})
	.when('/partidas', {
		controller:'DashboardController',
		templateUrl: 'views/partidas.html'
	})
	.when('/novotorneio', {
		controller:'NovoTorneioController',
		templateUrl: 'views/novo_torneio.html'
	})
	.when('/account',{
		controller:'UsersController',
		templateUrl: 'views/account.html'
	})
	.otherwise({
		redirectTo: '/'
	});
});

