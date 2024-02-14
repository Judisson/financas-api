const dotenv = require('dotenv').config();
const ContaFisicaTransaction = require('../db/models/contaFisicaTransaction.model');

const createTransaction = async (objTransaction) => {
  let {
    estabelecimento,
    valor,
    categoriaEstabelecimento,
    subCategoria,
    tipoValor,
    date,
    produtos,
    formaPagamento,
    statusTransacao,
    horaTransacao,
  } = objTransaction;
  let newTransaction;

  const ultimaTransacao = await ContaFisicaTransaction.aggregate([
    { $group: { _id: null, maxCod: { $max: '$idTransacao' } } },
  ]);

  const novoid = ultimaTransacao.length > 0 ? ultimaTransacao[0].maxCod + 1 : 1;

  newTransaction = new ContaFisicaTransaction({
    idTransacao: novoid,
    estabelecimento,
    categoriaEstabelecimento,
    subCategoria,
    date,
    horaTransacao,
    valor,
    formaPagamento,
    tipoValor,
    statusTransacao,
    produtos,
  });

  console.log('objeto inteiro', newTransaction);

  if (estabelecimento === '') {
    console.log('Error: Invalid estabelecimento');
  } else {
    newTransaction
      .save()
      .then((doc) => console.log('Documento Salvo: ', doc))
      .catch((err) => console.log('Error ao salvar o novo documento: ', err));
  }

  return newTransaction;
};

const searchTransaction = async (objTransaction) => {
  let { idTransacao, tipoTransacao } = objTransaction;
  let transacaoEncontrada;

  // if (tipoTransacao === 'conta-fisica') {
  transacaoEncontrada = await ContaFisicaTransaction.findOne({ idTransacao });
  // }

  if (!transacaoEncontrada) {
    // return res.status(404).json({ mensagem: 'Transacação não encontrada' });
    console.log('Transacão não encontrada (searchTransaction)');
  }

  // Incluindo o campo 'cod' na resposta
  return transacaoEncontrada;
  // return res.json({
  //   ...transacaoEncontrada.toObject(),
  //   idTransacao: idTransacao,
  // });
};

const searchTransactions = async (objTransaction) => {
  let { tipoTransacao } = objTransaction;
  let transacoesEncontradas;

  transacoesEncontradas = await ContaFisicaTransaction.find();

  return transacoesEncontradas;
  // return res.status(200).json(transacoesEncontradas);
};

// Atualiza uma transação por id
const updateTransaction = async (objTransaction) => {
  const { idTransacao, ...data } = objTransaction;
  const transacaoEncontrada = await ContaFisicaTransaction.findOne({
    idTransacao: idTransacao,
  });

  console.log("updateTransaction(1) - data: ", data)

  if (!transacaoEncontrada) {
    // return res.status(404).json({ mensagem: "Atleta não encontrado." });
    console.log('Transacão não encontrada (updateTransaction)');
  }

  await ContaFisicaTransaction.updateOne({ idTransacao: idTransacao }, data);

  // Atualizando o objeto atletaEncontrado com os dados atualizados
  const transacaoAtualizada = { ...transacaoEncontrada.toObject(), ...data };

  // Incluindo o campo 'cod' na resposta
  return transacaoAtualizada;
  // return data;
};

// Deleta uma transação por id
const deleteTransaction = async (objTransaction) => {
  console.log('FoiChamadoo delete');
  const { idTransacao } = objTransaction;
  const transacaoEncontrada = await ContaFisicaTransaction.findOne({
    idTransacao: idTransacao,
  });

  if (!transacaoEncontrada) {
    // res.status(404).json({ mensagem: "Atleta não encontrado." });
    console.log('Transacão não encontrada (deleteTransaction)');
  } else {
    await ContaFisicaTransaction.deleteOne({ idTransacao: idTransacao });
    // return res.status(200).json({});
  }
};

const resumoTransactions = async (objTransaction) => {
  let transacoesEncontradas,
    saidas = 0,
    entradas = 0,
    total = 0;

  try {
    transacoesEncontradas = await ContaFisicaTransaction.find();

    

    total = transacoesEncontradas.forEach((transacao) => {
      if (transacao.tipoValor === 'Entrada') {
        entradas += transacao.valor;
      } else if (transacao.tipoValor === 'Saída') {
        saidas += transacao.valor;
      }
    });

    total = entradas - saidas;

    return {
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
  createTransaction,
  searchTransaction,
  searchTransactions,
  updateTransaction,
  deleteTransaction,
  resumoTransactions,
};
