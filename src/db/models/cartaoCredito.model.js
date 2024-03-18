const mongoose = require('mongoose')

const cartaoSchema = new mongoose.Schema({
  idCartao: { type: Number, unique: true, required: true },
  bandeira: String,
  banco: String,
  numeroCartao: Number,
  dateAtualizacao: Number,
})

const Cartao = mongoose.model('cartaoCredito', cartaoSchema);

module.exports = Cartao