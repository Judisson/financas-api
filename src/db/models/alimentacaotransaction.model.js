const mongoose = require('mongoose')

const alimentacaoSchema = new mongoose.Schema({
  idTransacao: { type: Number, unique: true, required: true },
  title: String,
  valor: Number,
  categoria: String,
  tipoValor: String,
  produtos: [{ nomeProduto: String, valorProduto: Number}],
  statusTransacao: String,
  date: Date,
  horaTransacao: String
})

const AlimentacaoTransaction = mongoose.model('alimentacaoTransactions', alimentacaoSchema);

module.exports = AlimentacaoTransaction