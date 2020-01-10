var myApp = angular.module('myApp');

myApp.controller('NovoTorneioController', 
	['$scope', '$cookies', '$interval', '$timeout', '$http', '$location', '$routeParams','user', 
	function($scope,$cookies, $interval, $timeout, $http, $location, $routeParams,user){
	console.log('Novo Torneio...');

	novotorneioController = this;
	novotorneioController.user = $cookies.getObject("user_account");

	novotorneioController.criarTorneio = function(){
		console.log('criando novo torneio...');
		$http.post('/api/sortear',novotorneioController.jogadores).then(function(response) {
			novotorneioController.lista_partidas = response.data;
			// console.log(response.data);
			alert("ssshhhxxRRRRaaaaaiiiiaaaiiiiiii meeeu parxxxxceeiiiroooo!!!! 💦💦💦💦💦 \r\n Éééerr éérrr que comecem os duelos!!");
			$location.path("/dashboard");
			// location.reload();
		});
    }
    novotorneioController.cadastroJogadores = function(num){
        novotorneioController.jogadores = [];
        for (i=0;i<num;i++) {
            var cont = i + 1;
            novotorneioController.jogadores.push("jogador"+cont);
        }
    }
}]);