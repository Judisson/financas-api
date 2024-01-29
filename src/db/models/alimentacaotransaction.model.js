const mongoose = require('mongoose')

const alimentacaoSchema = new mongoose.Schema({
  valor: Number,
  categoria: String,
  title: String,
  tipoValor: String,
  statusTransacao: String,
  date: Date,
  idTransacao: { type: Number, unique: true, required: true }
})

const AlimentacaoTransaction = mongoose.model('alimentacaoTransactions', alimentacaoSchema);

module.exports = AlimentacaoTransaction