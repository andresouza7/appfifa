let mongoose = require('mongoose');

let partidaSchema = mongoose.Schema({
    ordem: {
        type: Number,
        default: 0
    },
    player1: {
        type: String,
        required: true
    },
    player1_gols: {
        type: Number,
        default: 0
    },
    player2: {
        type: String,
        required: true
    },
    player2_gols: {
        type: Number,
        default: 0
    },
    encerrada: {
        type: Boolean,
        default: false
    }
});

let Partida = module.exports = mongoose.model('Partida', partidaSchema, 'partidas');
