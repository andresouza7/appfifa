var myApp = angular.module('myApp');

myApp.controller('DashboardController', 
	['$scope', '$cookies', '$interval', '$timeout', '$http', '$location', '$routeParams','user', 
	function($scope,$cookies, $interval, $timeout, $http, $location, $routeParams,user){
	console.log('DashboardController loaded...');

	dashController = this;
	dashController.user = $cookies.getObject("user_account");

	dashController.verRanking = function(){
		console.log('tabela de ranking...');
		$http.get('/api/ranking').then(function(response) {
			dashController.ranking = response.data;
			// console.log(response.data);
			// location.reload();
		});
	}

	dashController.verPartidaAtual = function(){
		$http.get('/api/partidaAtual').then(function(response) {
			dashController.partidaAtual = response.data;

			var tempo = (dashController.partidas.length - dashController.partidaAtual.ordem)*8;
			dashController.tempoHoras = Math.trunc(tempo/60);
			dashController.tempoMinutos = Math.round(((tempo/60)-dashController.tempoHoras)*60);
			// console.log(response.data);
			// location.reload();
		});
	}

	dashController.verPartidas = function(){
		$http.get('/api/partidas').then(function(response) {
			dashController.partidas = response.data;
			// console.log(response.data);
			// location.reload();
		});
	}

	dashController.encerrarPartida = function(){
		$http.post('/api/encerrarPartida',dashController.partidaAtual).then(function(response) {
			dashController.verPartidaAtual();
			dashController.verRanking();
			dashController.verPartidas();
			// console.log(response.data);
			// location.reload();
		});
	}

	dashController.pularPartida = function(){
		$http.post('/api/pularPartida',dashController.partidaAtual).then(function(response) {
			if (response) {
				dashController.verPartidaAtual();
				dashController.verRanking();
				dashController.verPartidas();
			} else {
				alert("Erro, não foi possível pular a partida.");
			}
			// console.log(response.data);
			// location.reload();
		});
	}

}]);