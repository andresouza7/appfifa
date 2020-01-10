const express = require('express');
const router = express.Router();

// Bring in ranking Model
let Ranking = require('../models/ranking');
// Bring in partida Model
let Partida = require('../models/partida');

//==== FIFA APP
// sortear partidas
function sortearPartidasLiga (jogadores, volta) {
	var lista_partidas = [];

	// SORTEIA TODOS OS JOGOS INCLUSIVE IDA E VOLTA
	var comparar = jogadores;
	//primeiro loop
	jogadores.forEach(function (jogador1){
		//segundo loop
		comparar.forEach( function(jogador2){
			//relaciona o jogador1 com todos menos ele mesmo
			if (jogador1 != jogador2) {
				let partida = new Partida();
				partida.player1 = jogador1;
				partida.player2 = jogador2;
				lista_partidas.push(partida);
			}
		});
	});
	
	// FILTRAR SÓ OS JOGOS DE IDA
	if (volta == false) {
		var partidas_ida = [...lista_partidas];
		var partidas_remover = [];
		var lista_ida = [];
		
		//primeiro loop
		for (i = 0; i < lista_partidas.length; i++) {
			//segundo loop
			for (k = i+1; k < lista_partidas.length; k++) {
				if (lista_partidas[i].player1 == lista_partidas[k].player2 && lista_partidas[i].player2 == lista_partidas[k].player1) {
					partidas_remover.push(lista_partidas[k]);
				}
			}
		}
		partidas_remover.forEach(function (partida){
			partidas_ida.splice(partidas_ida.indexOf(partida), 1 );
		});
		// === start - organizar para um jogador nao ficar muito tempo sem jogar
		var pt_atual = partidas_ida[0];
		lista_ida.push(pt_atual);
		for (cont=0; cont<partidas_ida.length; cont++) {
			partidas_ida.forEach(function(pt){ 
				// se achar uma partida com todos os jogadores diferentes dos da partida atual..
				if (pt.player1 != pt_atual.player1 && pt.player1 != pt_atual.player2 && pt.player2 != pt_atual.player1 && pt.player2 != pt_atual.player2 && lista_ida.indexOf(pt) < 0) {
					pt_atual = pt;
					lista_ida.push(pt_atual);
					// console.log("partida atual:");
					// console.log(pt_atual);
					// console.log("partida a comparar:");
					// console.log(pt);
				}
			});
		}
		// considerar os jogos que são impossíveis não serem em seguida
		partidas_ida.forEach(function(pt, index){ 
			if (lista_ida.indexOf(pt) < 0) {
				if (index == lista_partidas.length - 1)
					lista_ida.unshift(pt);
				else
					lista_ida.push(pt);
			}
		});
		// Finalmente, APLICA a ordem das partidas de IDA e salva no banco de dados, excluindo registros anteriores
		Partida.deleteMany({},function(err,response){
			lista_ida.forEach(function(pt, index){ 
				pt.ordem = index + 1;
			});
			Partida.insertMany(lista_ida,function(err){
				if(err){
					console.log(err);
				}
			});
		});
		// console.log(partidas_ida);
		// === end
		return lista_ida;
	} else {
		// === start - organizar para um jogador nao ficar muito tempo sem jogar
		var lista_idavolta = [];
		var pt_atual = lista_partidas[0];
		lista_idavolta.push(pt_atual);
		for (cont=0; cont<lista_partidas.length; cont++) {
			lista_partidas.forEach(function(pt){ 
				// console.log("partida atual:");
				// console.log(pt_atual);
				// console.log("partida a comparar:");
				// console.log(pt);
				// se achar uma partida com todos os jogadores diferentes dos da partida atual..
				if (pt.player1 != pt_atual.player1 && pt.player1 != pt_atual.player2 && pt.player2 != pt_atual.player1 && pt.player2 != pt_atual.player2 && lista_idavolta.indexOf(pt) < 0) {
					pt_atual = pt;
					lista_idavolta.push(pt_atual);
				}
			});
		}
		// considerar os jogos que são impossíveis não serem em seguida
		lista_partidas.forEach(function(pt, index){ 
			if (lista_idavolta.indexOf(pt) < 0) {
				if (index == lista_partidas.length - 1)
					lista_idavolta.unshift(pt);
				else
					lista_idavolta.push(pt);
			}
		});
		// Finalmente, APLICA a ordem das partidas de IDA e VOLTA e salva no banco de dados, excluindo registros anteriores
		Partida.deleteMany({},function(err,response){
			lista_idavolta.forEach(function(pt, index){ 
				pt.ordem = index + 1;
			});
			Partida.insertMany(lista_idavolta,function(err){
				if(err){
					console.log(err);
				}
			});
		});
		// console.log(lista_partidas);
		// === end
		return lista_idavolta;
	}
}

router.post('/sortear', function(req, res){
	// var lista_jogadores = ["bruno", "calouro", "hugo", "mura","andre", "brotz","vitolino","kinho"];
	// console.log(req.body);
	// console.log(req.body.idaevolta);
	var jogadores = req.body.jogadores;
	var idaevolta = req.body.idaevolta;
	res.json(sortearPartidasLiga(jogadores, idaevolta));

	Ranking.deleteMany({},function(err,response){
		jogadores.forEach(function(jogador, index){
			let novo_jogador = new Ranking();
			novo_jogador.posicao = index + 1;
			novo_jogador.nome = jogador;
			novo_jogador.save(function(err){
				if (err) console.log(err);
			})
		});
	});
});

router.get('/ranking', function(req,res){
	Ranking.find({},function(err,jogadores){
		res.json(jogadores);
	});
});

router.get('/partidaAtual', function(req,res){
	Partida.findOne({encerrada: false}).sort({ordem:1}).exec(function(err, partida){
		res.json(partida);
	});
});

router.get('/partidas', function(req,res){
	Partida.find({}).sort({ordem:1}).exec(function(err, partidas){
		res.json(partidas);
	});
});

router.post('/pularPartida', function(req, res){
	let partida_atual = req.body;
	// console.log(partida_atual);
	Partida.updateOne({ordem: partida_atual.ordem+1}, {ordem: partida_atual.ordem}, function(err, response){
		if (err) console.log(err);
		Partida.updateOne({_id: partida_atual._id}, {ordem: partida_atual.ordem+1}, function(err, response2){
			if (err) console.log(err);
			res.json(response2);
		});
	});
});

router.post('/encerrarPartida', function(req, res){
	let resultado = req.body;
	resultado.encerrada = true;
	Partida.update({ordem: resultado.ordem}, resultado, function(err, partida){
		if(err) console.log(err);
		// res.json(partida);

		let jogador1 = new Ranking();
		let jogador2 = new Ranking();
		// identificar vitoria, empate ou derrota e atribuir pontos e estatisticas aos jogadores
		if (resultado.player1_gols > resultado.player2_gols){
			jogador1.vitorias = 1;
			jogador1.pontos = 3;
			jogador2.derrotas = 1;
		}
		if (resultado.player2_gols > resultado.player1_gols){
			jogador2.vitorias = 1;
			jogador2.pontos = 3;
			jogador1.derrotas = 1;
		}
		if (resultado.player1_gols == resultado.player2_gols){
			jogador1.empates = 1;
			jogador1.pontos = 1;
			jogador2.empates = 1;
			jogador2.pontos = 1;
		}
		// computar os gols feitos e contra
		jogador1.golsFeitos = resultado.player1_gols;
		jogador1.golsContra = resultado.player2_gols;
		jogador2.golsFeitos = resultado.player2_gols;
		jogador2.golsContra = resultado.player1_gols;
		// computar saldo de gols e atualizar estatisticas no banco de dados
		Ranking.findOne({nome: resultado.player1}, function(err, jogador){
			jogador.pontos += jogador1.pontos;
			jogador.jogos += 1;
			jogador.vitorias += jogador1.vitorias;
			jogador.derrotas += jogador1.derrotas;
			jogador.empates += jogador1.empates;
			jogador.golsFeitos += jogador1.golsFeitos;
			jogador.golsContra += jogador1.golsContra;
			jogador.saldoGols = jogador.saldoGols + jogador1.golsFeitos - jogador1.golsContra;
			Ranking.update({_id: jogador.id}, jogador, function(err, response){
				if (err) console.log(err);

				Ranking.findOne({nome: resultado.player2}, function(err, jogador){
					jogador.pontos += jogador2.pontos;
					jogador.jogos += 1;
					jogador.vitorias += jogador2.vitorias;
					jogador.derrotas += jogador2.derrotas;
					jogador.empates += jogador2.empates;
					jogador.golsFeitos += jogador2.golsFeitos;
					jogador.golsContra += jogador2.golsContra;
					jogador.saldoGols = jogador.saldoGols + jogador2.golsFeitos - jogador2.golsContra;
					Ranking.update({_id: jogador.id}, jogador, function(err, response){
						if (err) console.log(err);

						// apurar nova classificacao dos jogadores apos resultado da partida
						// * regras de classificacao
						// 1- maior pontuação
						// 2- maior numero de vitorias
						// 3- maior saldo de gols
						// 4- maior numero de gols a favor
						Ranking.find({}, function(err, jogadores){
							// jogadores.sort((a, b) => (a.pontos > b.pontos) ? -1 : (a.pontos === b.pontos) ? ((a.vitorias > b.vitorias) ? -1 : 1) : 1);
							jogadores.sort(function (a,b){
								if (a.pontos > b.pontos) {
									return -1;
								} else if (a.pontos === b.pontos) {
									if (a.vitorias > b.vitorias) {
										return -1;
									} else if (a.vitorias === b.vitorias) {
										if (a.saldoGols > b.saldoGols) {
											return -1;
										} else if (a.saldoGols === b.saldoGols) {
											if (a.golsFeitos > b.golsFeitos) {
												return -1;
											} else {
												return 1;
											}
										}
									}
								} else {
									return 1;
								}
							});

							jogadores.forEach(function(jogador, index){
								jogador.posicao = index + 1;
								Ranking.updateOne({_id: jogador.id}, {posicao: jogador.posicao}, function (err, response){
									if (err) console.log(err);
									if (index == jogadores.length -1)
										// atualiza o browser só quando todos os cálculos foram concluídos
										res.sendStatus(200);
								});
							});
						});
					});
				});
			});
		});
	});
});

// END FIFA APP ====

module.exports = router;