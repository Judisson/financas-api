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
  juros: Number,
  cartaoCredito: Number,
  quantidadeParcelas: Number,
  statusTransacao: String,
  parcelas: [{ dataParcela: Date, valorParcela: Number, numeroParcela: Number, statusParcela: String }],
  produtos: [{ nomeProduto: String, valorProduto: Number }],
});

const CartaoCreditoTransaction = mongoose.model(
  'cartaoCreditoTransactions',
  cartaoCreditoSchema
);

module.exports = CartaoCreditoTransaction;
