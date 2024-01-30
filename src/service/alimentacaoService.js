const dotenv = require('dotenv').config();
const AlimentacaoTransaction = require('../db/models/alimentacaotransaction.model');

const createTransaction = async (objTransaction) => {
  let { title, valor, categoria, tipoValor, produtos, date, idTransacao, statusTransacao, horaTransacao } =
    objTransaction;
  let newTransaction;

  const ultimaTransacao = await AlimentacaoTransaction.aggregate([
    { $group: { _id: null, maxCod: { $max: '$idTransacao' } } },
  ]);

  const novoid = ultimaTransacao.length > 0 ? ultimaTransacao[0].maxCod + 1 : 1;

  // console.log('novoid', novoid)

  newTransaction = new AlimentacaoTransaction({
    idTransacao: novoid,
    title,
    valor,
    categoria,
    produtos,
    statusTransacao,
    tipoValor,
    date,
    horaTransacao
  });

  // console.log("newTransaction", newTransaction)

  if (title === '') {
    console.log('Error: Invalid title');
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
    console.log("Transacão não encontrada (searchTransaction)")
  }

  // Incluindo o campo 'cod' na resposta
  return transacaoEncontrada
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
  return transacoesEncontradas
};

// Atualiza uma transação por id
const updateTransaction = async (objTransaction, id) => {
  console.log('vai tentar atualizar', objTransaction)
  const { ...data } = objTransaction;
  const { idTransacao } = id
  const transacaoEncontrada = await AlimentacaoTransaction.findOne({ idTransacao: idTransacao });

  if (!transacaoEncontrada) {
    // return res.status(404).json({ mensagem: "Atleta não encontrado." });
    console.log("Transacão não encontrada (updateTransaction)")
  }

  await AlimentacaoTransaction.updateOne({ idTransacao: idTransacao }, data);

  // Atualizando o objeto atletaEncontrado com os dados atualizados
  const transacaoAtualizada = { ...transacaoEncontrada.toObject(), ...data };

  // Incluindo o campo 'cod' na resposta
  // return res.json(transacaoAtualizada);
  return transacaoAtualizada
}

// Deleta uma transação por id
const deleteTransaction = async (objTransaction) => {
  console.log("objTransaction 92", objTransaction)
  const { idTransacao } = objTransaction;
  const transacaoEncontrada = await AlimentacaoTransaction.findOne({ idTransacao: idTransacao });

  if (!transacaoEncontrada) {
    // res.status(404).json({ mensagem: "Atleta não encontrado." });
    console.log("Transacão não encontrada (deleteTransaction)")
  } else {
    await AlimentacaoTransaction.deleteOne({ idTransacao: idTransacao });
    // return res.status(200).json({});
  }
}

module.exports = { createTransaction, searchTransaction, searchTransactions, updateTransaction, deleteTransaction };
