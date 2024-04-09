const dotenv = require('dotenv').config();
const AlimentacaoTransaction = require('../db/models/alimentacaotransaction.model');

const createTransaction = async (objTransaction) => {
  let {
    estabelecimento,
    valor,
    categoriaEstabelecimento,
    tipoValor,
    produtos,
    date,
    idTransacao,
    statusTransacao,
    horaTransacao,
  } = objTransaction;
  let newTransaction;

  const ultimaTransacao = await AlimentacaoTransaction.aggregate([
    { $group: { _id: null, maxCod: { $max: '$idTransacao' } } },
  ]);

  const novoid = ultimaTransacao.length > 0 ? ultimaTransacao[0].maxCod + 1 : 1;

  // console.log('novoid', novoid)

  newTransaction = new AlimentacaoTransaction({
    idTransacao: novoid,
    estabelecimento,
    valor,
    categoriaEstabelecimento,
    produtos,
    statusTransacao,
    tipoValor,
    date,
    horaTransacao,
  });

  // console.log("newTransaction", newTransaction)

  if (estabelecimento === '') {
    console.log('Error: Não pode estar vazio o Estabelecimento');
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

  transacaoEncontrada = await AlimentacaoTransaction.findOne({ idTransacao });

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

  transacoesEncontradas = await AlimentacaoTransaction.find();
  // console.log("transacoesEncontradas", transacoesEncontradas)

  // return res.status(200).json(transacoesEncontradas);
  return transacoesEncontradas;
};

// Atualiza uma transação por id
const updateTransaction = async (objTransaction, id) => {
  console.log('vai tentar atualizar', objTransaction);
  const { ...data } = objTransaction;
  const { idTransacao } = id;
  const transacaoEncontrada = await AlimentacaoTransaction.findOne({
    idTransacao: idTransacao,
  });

  if (!transacaoEncontrada) {
    // return res.status(404).json({ mensagem: "Atleta não encontrado." });
    console.log('Transacão não encontrada (updateTransaction)');
  }

  await AlimentacaoTransaction.updateOne({ idTransacao: idTransacao }, data);

  // Atualizando o objeto atletaEncontrado com os dados atualizados
  const transacaoAtualizada = { ...transacaoEncontrada.toObject(), ...data };

  // Incluindo o campo 'cod' na resposta
  // return res.json(transacaoAtualizada);
  return transacaoAtualizada;
};

// Deleta uma transação por id
const deleteTransaction = async (objTransaction) => {
  console.log('objTransaction 92', objTransaction);
  const { idTransacao } = objTransaction;
  const transacaoEncontrada = await AlimentacaoTransaction.findOne({
    idTransacao: idTransacao,
  });

  if (!transacaoEncontrada) {
    // res.status(404).json({ mensagem: "Atleta não encontrado." });
    console.log('Transacão não encontrada (deleteTransaction)');
  } else {
    await AlimentacaoTransaction.deleteOne({ idTransacao: idTransacao });
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
    transacoesEncontradas = await AlimentacaoTransaction.find();
    
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
  createTransaction,
  searchTransaction,
  searchTransactions,
  updateTransaction,
  deleteTransaction,
  resumoTransactions,
};
