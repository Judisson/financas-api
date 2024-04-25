const mongoose = require('mongoose')

const configuracoesSchema = new mongoose.Schema({
  idConfiguracoes: { type: Number, unique: true, required: true },
  date: Date,
})

const ConfiguracoesGerais = mongoose.model('configuracoesGerais', configuracoesSchema);

module.exports = ConfiguracoesGerais