const mongoose = require('mongoose')

const cartaoCreditoSchema = new mongoose.Schema({
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

const CartaoCreditoTransaction = mongoose.model('cartaoCreditoTransactions', cartaoCreditoSchema);

module.exports = CartaoCreditoTransaction