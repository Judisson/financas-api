const mongoose = require('mongoose')

const contaFisicaSchema = new mongoose.Schema({
  idTransacao: { type: Number, unique: true, required: true },
  estabelecimento: String,
  categoriaEstabelecimento: String,
  subCategoria: String,
  date: Date,
  horaTransacao: String,
  valor: Number,
  formaPagamento: String,
  tipoValor: String,
  statusTransacao: String,
  produtos: [{ nomeProduto: String, valorProduto: Number}]
})

const ContaFisicaTransaction = mongoose.model('contaFisicaTransactions', contaFisicaSchema);

module.exports = ContaFisicaTransaction