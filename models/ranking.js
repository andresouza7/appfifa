let mongoose = require('mongoose');

let rankingSchema = mongoose.Schema({
    posicao: Number,
    nome: {
        type: String,
        required: true
    },
    pontos: {
        type: Number,
        default: 0
    },
    jogos: {
        type: Number,
        default: 0
    },
    vitorias: {
        type: Number,
        default: 0
    },
    derrotas: {
        type: Number,
        default: 0
    },
    empates: {
        type: Number,
        default: 0
    },
    golsFeitos: {
        type: Number,
        default: 0
    },
    golsContra: {
        type: Number,
        default: 0
    },
    saldoGols: {
        type: Number,
        default: 0
    }
});

let Ranking = module.exports = mongoose.model('Ranking', rankingSchema, 'ranking');
