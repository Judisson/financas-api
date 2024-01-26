const dotenv = require('dotenv').config();
const ContaPoupancaTransaction = require('../db/models/contaPoupancaTransaction.model');

const createTransaction = async (objTransaction) => {
  let { title, valor, categoria, tipoValor, date, idTransacao, tipoTransacao } =
    objTransaction;

  let newTransaction;

  const ultimaTransacao = await ContaPoupancaTransaction.aggregate([
    { $group: { _id: null, maxCod: { $max: '$idTransaction' } } },
  ]);
  const novoid = ultimaTransacao.length > 0 ? ultimaTransacao[0].maxCod + 1 : 1;

  newTransaction = new ContaPoupancaTransaction({
    title,
    valor,
    categoria,
    tipoValor,
    date,
    idTransacao: novoid
  });

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

  transacaoEncontrada = await ContaPoupancaTransaction.findOne({
    idTransacao,
  });

  if (!transacaoEncontrada) {
    return res.status(404).json({ mensagem: 'Transacação não encontrada' });
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

  transacoesEncontradas = await ContaPoupancaTransaction.find();

  // return res.status(200).json(transacoesEncontradas);
  return transacoesEncontradas
};

// Atualiza uma transação por id
const updateTransaction = async (objTransaction) => {
  const { idTransacao, ...data } = objTransaction;  
  const transacaoEncontrada = await ContaPoupancaTransaction.findOne({ idTransacao: idTransacao });

  if (!transacaoEncontrada) {
    return res.status(404).json({ mensagem: "Atleta não encontrado." });
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
  const { idTransacao } = objTransaction;
  const transacaoEncontrada = await ContaPoupancaTransaction.findOne({ idTransacao: idTransacao });

  if (!transacaoEncontrada) {
    res.status(404).json({ mensagem: "Atleta não encontrado." });
  } else {
    await ContaPoupancaTransaction.deleteOne({ idTransacao: idTransacao });
    // return res.status(200).json({});
  }
}

module.exports = { createTransaction, searchTransaction, searchTransactions, updateTransaction, deleteTransaction };
