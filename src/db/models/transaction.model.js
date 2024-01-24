const mongoose = require('mongoose')

const alimentacaoSchema = new mongoose.Schema({
  valor: Number,
  categoria: String,
  title: String,
  tipoValor: String,
  date: Date,
  id: Number
})

const Transaction = mongoose.model('chats', alimentacaoSchema );

module.exports = Transaction