const dotenv = require('dotenv').config();
const ConfiguracoesGerais = require('../db/models/configuracoes.model');

const createConfiguracoes = async (objTransaction) => {
  let {
    date,
  } = objTransaction;
  let newConfiguracoes;

  const ultimaConfiguracao = await ConfiguracoesGerais.aggregate([
    { $group: { _id: null, maxCod: { $max: '$idConfiguracoes' } } },
  ]);

  const novoid = ultimaConfiguracao.length > 0 ? ultimaConfiguracao[0].maxCod + 1 : 1;

  newConfiguracoes = new ConfiguracoesGerais({
    idConfiguracoes: novoid,
    date,
  });

  console.log('objeto inteiro', newConfiguracoes);

  if (!date) {
    console.log('Error: Invalid configurações');
  } else {
    newConfiguracoes
      .save()
      .then((doc) => console.log('Documento Salvo: ', doc))
      .catch((err) => console.log('Error ao salvar o novo documento: ', err));
  }

  return newConfiguracoes;
};

const readConfiguracoes = async (objTransaction) => {
  let { idConfiguracoes } = objTransaction;
  let configuracoesEncontrada;
  console.log('Inexistente (readConfiguracoes)');

  // if (tipoTransacao === 'conta-fisica') {
  configuracoesEncontrada = await ConfiguracoesGerais.findOne({ idConfiguracoes });
  // }

  if (!configuracoesEncontrada) {
    // return res.status(404).json({ mensagem: 'Transacação não encontrada' });
    console.log('Transacão não encontrada ou Inexistente (readConfiguracoes)');
  }

  // Incluindo o campo 'cod' na resposta
  return configuracoesEncontrada;
  // return res.json({
  //   ...transacaoEncontrada.toObject(),
  //   idTransacao: idTransacao,
  // });
};

const searchTransactions = async (objTransaction) => {
  let { tipoTransacao } = objTransaction;
  let transacoesEncontradas;

  transacoesEncontradas = await ConfiguracoesGerais.find();

  return transacoesEncontradas;
  // return res.status(200).json(transacoesEncontradas);
};

// Atualiza uma transação por id
const updateConfiguracoes = async (objTransaction) => {
  const { idConfiguracoes, ...data } = objTransaction;
  const configuracoesEncontrada = await ConfiguracoesGerais.findOne({
    idConfiguracoes: idConfiguracoes,
  });

  console.log("updateTransaction(1) - data: ", data)

  if (!configuracoesEncontrada) {
    // return res.status(404).json({ mensagem: "Atleta não encontrado." });
    console.log('Transacão não encontrada (updateTransaction)');
  }

  await ConfiguracoesGerais.updateOne({ idConfiguracoes: idConfiguracoes }, data);

  // Atualizando o objeto atletaEncontrado com os dados atualizados
  const configuracoesAtualizada = { ...configuracoesEncontrada.toObject(), ...data };

  // Incluindo o campo 'cod' na resposta
  return configuracoesAtualizada;
  // return data;
};

// Deleta uma transação por id
const deleteTransaction = async (objTransaction) => {
  console.log('FoiChamadoo delete');
  const { idTransacao } = objTransaction;
  const transacaoEncontrada = await ConfiguracoesGerais.findOne({
    idTransacao: idTransacao,
  });

  if (!transacaoEncontrada) {
    // res.status(404).json({ mensagem: "Atleta não encontrado." });
    console.log('Transacão não encontrada (deleteTransaction)');
  } else {
    await ConfiguracoesGerais.deleteOne({ idTransacao: idTransacao });
    // return res.status(200).json({});
  }
};

const resumoTransactions = async (objTransaction) => {
  let transacoesEncontradas,
    saidas = 0,
    entradas = 0,
    total = 0
    previsao = 0;
    entradaTotal = 0,
    saidaTotal = 0;

  try {
    transacoesEncontradas = await ConfiguracoesGerais.find();

    

    total = transacoesEncontradas.forEach((transacao) => {
      if (transacao.tipoValor === 'Entrada' & transacao.statusTransacao === 'Recebido') {
        entradas += transacao.valor;
      } else if (transacao.tipoValor === 'Saída' & transacao.statusTransacao === 'Pago') {
        saidas += transacao.valor;
      }
    });

    previsao = transacoesEncontradas.forEach((transacao) => {
      if (transacao.tipoValor === 'Entrada') {
        entradaTotal += transacao.valor;
      } else if (transacao.tipoValor === 'Saída') {
        saidaTotal += transacao.valor;
      }
    });

    total = entradas - saidas;
    previsao = entradaTotal - saidaTotal;

    return {
      previsao: Number(previsao).toFixed(2),
      total: Number(total).toFixed(2),
      entradas: Number(entradas).toFixed(2),
      saidas: Number(saidas).toFixed(2),
    };
  } catch (error) {
    console.error('Erro ao resumir transações:', error);
    throw error; // Relança o erro para ser tratado onde a função é chamada
  }
  // return res.status(200).json(transacoesEncontradas);
};

module.exports = {
  createConfiguracoes,
  readConfiguracoes,
  searchTransactions,
  updateConfiguracoes,
  deleteTransaction,
  resumoTransactions,
};
