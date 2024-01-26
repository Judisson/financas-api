const mongoose = require('mongoose')

const contaPoupancaSchema = new mongoose.Schema({
  valor: Number,
  categoria: String,
  title: String,
  tipoValor: String,
  date: Date,
  idTransacao: { type: Number, unique: true, required: true }
})

const ContaPoupancaTransaction = mongoose.model('contaPoupancaTransactions', contaPoupancaSchema);

module.exports = ContaPoupancaTransaction