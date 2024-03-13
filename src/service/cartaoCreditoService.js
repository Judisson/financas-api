const dotenv = require('dotenv').config();
const Cartao = require('../db/models/cartaoCredito.model');
const CartaoCreditoTransaction = require('../db/models/cartaoCreditoTransaction.model');

const createTransaction = async (objTransaction) => {
  let {
  estabelecimento,
  categoriaEstabelecimento,
  subCategoria,
  date,
  horaTransacao,
  valor,
  cartaoCredito,
  juros,
  parcelas,
  produtos,
  } = objTransaction;
  let newTransaction;

  const ultimaTransacao = await CartaoCreditoTransaction.aggregate([
    { $group: { _id: null, maxCod: { $max: '$idTransacao' } } },
  ]);

  const novoid = ultimaTransacao.length > 0 ? ultimaTransacao[0].maxCod + 1 : 1;

  newTransaction = new CartaoCreditoTransaction({
    idTransacao: novoid,
    estabelecimento,
  categoriaEstabelecimento,
  subCategoria,
  date,
  horaTransacao,
  valor,
  cartaoCredito,
  juros,
  parcelas,
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

const readTransaction = async (objTransaction) => {
  let { idTransacao, tipoTransacao } = objTransaction;
  let transacaoEncontrada;

  // if (tipoTransacao === 'conta-fisica') {
  transacaoEncontrada = await CartaoCreditoTransaction.findOne({ idTransacao });
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

const readTransactions = async (objTransaction) => {
  let { tipoTransacao } = objTransaction;
  let transacoesEncontradas;

  transacoesEncontradas = await CartaoCreditoTransaction.find();

  return transacoesEncontradas;
  // return res.status(200).json(transacoesEncontradas);
};

// Atualiza uma transação por id
const updateTransaction = async (objTransaction) => {
  const { idTransacao, ...data } = objTransaction;
  const transacaoEncontrada = await CartaoCreditoTransaction.findOne({
    idTransacao: idTransacao,
  });

  console.log("updateTransaction(1) - data: ", data)

  if (!transacaoEncontrada) {
    // return res.status(404).json({ mensagem: "Atleta não encontrado." });
    console.log('Transacão não encontrada (updateTransaction)');
  }

  await CartaoCreditoTransaction.updateOne({ idTransacao: idTransacao }, data);

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
  const transacaoEncontrada = await CartaoCreditoTransaction.findOne({
    idTransacao: idTransacao,
  });

  if (!transacaoEncontrada) {
    // res.status(404).json({ mensagem: "Atleta não encontrado." });
    console.log('Transacão não encontrada (deleteTransaction)');
  } else {
    await CartaoCreditoTransaction.deleteOne({ idTransacao: idTransacao });
    // return res.status(200).json({});
  }
};

const searchTransactions = async (objPesquisa) => {
  let { estabelecimento, cartaoCredito, mesesdoAno } = objPesquisa;
  let transacoesEncontradas;
  let query = {};

  if (estabelecimento) {
    query.estabelecimento = estabelecimento;
  }

  if (cartaoCredito) {
    query.cartaoCredito = cartaoCredito;

    const cartao = await Cartao.findById(cartaoCredito);
    if (cartao && mesesdoAno !== undefined) {
      const dateAtualizacao = cartao.dateAtualizacao;

      // Obtém o primeiro dia do mês atual e o primeiro dia do próximo mês
      // const primeiroDiaAtual = new Date();
      // primeiroDiaAtual.setDate(1);

      // const primeiroDiaProximoMes = new Date();
      // primeiroDiaProximoMes.setMonth(primeiroDiaProximoMes.getMonth() + 1);
      // primeiroDiaProximoMes.setDate(1);

      // // Configura a consulta para o intervalo entre o dia de atualização e o próximo mês
      // query.data = {
      //   $gte: new Date(primeiroDiaAtual.getFullYear(), mesesdoAno, dateAtualizacao),
      //   $lt: new Date(primeiroDiaProximoMes.getFullYear(), primeiroDiaProximoMes.getMonth(), dateAtualizacao),
      // };

      const dataInicial = new Date(`${mesesdoAno}-01`);
      const dataFinal = new Date(`${mesesdoAno + 1}-01`);

      // Define a data de atualização do cartão no intervalo do mês fornecido
      query.dataAtualizacaoCartao = {
        $gte: new Date(`${mesesdoAno}-${dateAtualizacao}`),
        $lt: new Date(`${mesesdoAno + 1}-${dateAtualizacao}`),
      };

      // Adiciona a condição para a data da transação estar dentro do intervalo do mês
      query.dataTransacao = {
        $gte: dataInicial,
        $lt: dataFinal,
      };
    }
  }

  if (mesesdoAno) {
    query.mesesdoAno = mesesdoAno;
  }

  transacoesEncontradas = await CartaoCreditoTransaction.find(query);

  return transacoesEncontradas;
  // return transacoesEncontradas;
}

const resumoTransactions = async (objTransaction) => {
  let transacoesEncontradas,
    saidas = 0,
    entradas = 0,
    total = 0;

  try {
    transacoesEncontradas = await CartaoCreditoTransaction.find();

    

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
  readTransaction,
  readTransactions,
  updateTransaction,
  deleteTransaction,
  searchTransactions,
  resumoTransactions,
};
