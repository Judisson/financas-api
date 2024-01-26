const mongoose = require('mongoose')

const contaFisicaSchema = new mongoose.Schema({
  valor: Number,
  categoria: String,
  title: String,
  tipoValor: String,
  date: Date,
  idTransacao: { type: Number, unique: true, required: true }
})

const ContaFisicaTransaction = mongoose.model('contaFisicaTransactions', contaFisicaSchema);

module.exports = ContaFisicaTransaction