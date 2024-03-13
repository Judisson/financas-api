const mongoose = require('mongoose');

const cartaoCreditoSchema = new mongoose.Schema({
  idTransacao: { type: Number, unique: true, required: true },
  estabelecimento: String,
  categoriaEstabelecimento: String,
  subCategoria: String,
  date: Date,
  horaTransacao: String,
  valor: Number,
  tipoValor: String,
  cartaoCredito: Number,
  statusTransacao: String,
  parcelas: [{ date: Date, valor: Number, numeroParcela: Number, statusParcela: String }],
  produtos: [{ nomeProduto: String, valorProduto: Number }],
});

const CartaoCreditoTransaction = mongoose.model(
  'cartaoCreditoTransactions',
  cartaoCreditoSchema
);

module.exports = CartaoCreditoTransaction;
