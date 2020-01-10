var myApp = angular.module('myApp');

myApp.controller('NovoTorneioController', 
	['$scope', '$cookies', '$interval', '$timeout', '$http', '$location', '$routeParams','user', 
	function($scope,$cookies, $interval, $timeout, $http, $location, $routeParams,user){
	console.log('Novo Torneio...');

	novotorneioController = this;
	novotorneioController.user = $cookies.getObject("user_account");
	$scope.estilo = {idaevolta: false};

	novotorneioController.criarTorneio = function(){
		console.log('criando novo torneio...');
		// alert($scope.estilo.idaevolta);
		$http.post('/api/sortear', {idaevolta: $scope.estilo.idaevolta,
			jogadores: novotorneioController.jogadores}).then(function(response) {
			novotorneioController.lista_partidas = response.data;
			// console.log(response.data);
			alert("RRRaaaaaiiiiaaaiiiiiii meeeu parxxxxceeiiiroooo!!!! 💦💦💦 \r\nQue comecem os duelos!!");
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