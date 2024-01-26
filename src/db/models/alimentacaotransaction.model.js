const mongoose = require('mongoose')

const alimentacaoSchema = new mongoose.Schema({
  valor: Number,
  categoria: String,
  title: String,
  tipoValor: String,
  date: Date,
  idTransaction: { type: Number, unique: true, required: true }
})

const AlimentacaoTransaction = mongoose.model('alimentacaoTransactions', alimentacaoSchema);

module.exports = AlimentacaoTransaction