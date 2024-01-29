const mongoose = require('mongoose')

const contaFisicaSchema = new mongoose.Schema({
  idTransacao: { type: Number, unique: true, required: true },
  title: String,
  valor: Number,
  categoria: String,
  tipoValor: String,
  statusTransacao: String,
  date: Date,
  horaTransacao: String
})

const ContaFisicaTransaction = mongoose.model('contaFisicaTransactions', contaFisicaSchema);

module.exports = ContaFisicaTransaction