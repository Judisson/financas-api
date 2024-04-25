const dotenv = require('dotenv').config();
const ContaFisicaTransaction = require('../db/models/contaFisicaTransaction.model');
const ConfiguracoesGerais = require('../db/models/configuracoes.model');

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

const readTransactions = async (objTransaction) => {
  let { tipoTransacao } = objTransaction;
  let transacoesEncontradas;

  transacoesEncontradas = await ContaFisicaTransaction.find();

  return transacoesEncontradas;
  // return res.status(200).json(transacoesEncontradas);
};

const searchTransactions = async (objTransaction) => {
  const { dateMes } = objTransaction;
  let transacoesEncontradas;
  let diaResetConta;

  // let dateAtt = dateMes;
  let dategte = dateMes;
  let datelt = dateMes + 1;
  

  try {
    diaResetConta = await ConfiguracoesGerais.findOne({ idConfiguracoes: 1 })
  } catch (error) {
    console.error('Erro ao achar Configuração!');
    // console.error("Log do Erro: ", error);
    throw error;
  };

  let dataTeste = new Date(`2024-${dategte}-${diaResetConta.date.getDate() }`)
    console.log("teste de data: ", dataTeste)
    console.log("teste de data dia: ", dategte)


  transacoesEncontradas = await ContaFisicaTransaction.aggregate([
    {
      $match: {
        "date": {
          $gte: new Date(`2024-${dategte}-${diaResetConta.date.getDate() }`),
          $lt: new Date(`2024-${datelt}-${diaResetConta.date.getDate()}`)
        }, // Filtrar somente as parcelas com status "Pago"
      }
    },
    {
      $group: {
        _id: "$_id", // Agrupando pelo ID original do documento
        // Manter todos os campos do documento original
        doc: { $first: "$$ROOT" }
      }
      // $group: {
      //   _id: "$_id",
      //   estabelecimento: String,
      //   // doc: { $first: "$$ROOT" },
      //   categoriaEstabelecimento: String,
      //   subCategoria: String,
      //   date: { $first: "$date" },
      //   horaTransacao: String,
      //   valor: { $first: "$valor" },
      //   formaPagamento: String,
      //   tipoValor: { $first: "$tipoValor" },
      //   statusTransacao: { $first: "$statusTransacao" },
      //   produtos: [{ nomeProduto: String, valorProduto: Number}]
      // }
    },
    {
      $replaceRoot: { newRoot: "$doc" } // Promover o documento agrupado para o nível superior
    },
  ]);

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

const resumoTransactionsAntigo = async (objTransaction) => {
  let transacoesEncontradas,
    saidas = 0,
    entradas = 0,
    total = 0
    previsao = 0;
    entradaTotal = 0,
    saidaTotal = 0;

  try {
    transacoesEncontradas = await ContaFisicaTransaction.find();

    

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

const resumoTransactions = async (objTransaction) => {
  const { dateMes } = objTransaction;
  let transacoesEncontradas,
    saidas = 0,
    entradas = 0,
    total = 0
    previsao = 0;
    entradaTotal = 0,
    saidaTotal = 0;

    let diaResetConta;

    try {
      diaResetConta = await ConfiguracoesGerais.findOne({ idConfiguracoes: 1 })
    } catch (error) {
      console.error('Erro ao achar Configuração!');
      // console.error("Log do Erro: ", error);
      throw error;
    };

    let dataTeste = new Date(`2024-${dateMes - 1}-${diaResetConta.date.getDate() }`)
    console.log("teste de data: ", dataTeste)

  try {
    transacoesEncontradas = await ContaFisicaTransaction.aggregate([
      {
        $match: {
          "date": {
            $gte: new Date(`2024-${dateMes}-${diaResetConta.date.getDate() }`),
            $lt: new Date(`2024-${dateMes + 1}-${diaResetConta.date.getDate()}`)
          }, // Filtrar somente as parcelas com status "Pago"
        }
      },
      {
        $group: {
          _id: "$_id",
          // doc: { $first: "$$ROOT" },
          date: { $first: "$date" },
          valor: { $first: "$valor" },
          tipoValor: { $first: "$tipoValor" },
          statusTransacao: { $first: "$statusTransacao" },
        }
      },
      // {
      //   $replaceRoot: { newRoot: "$doc" }
      // }
    ]);

    console.log('transacoesEncontradas: ', transacoesEncontradas);

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
  readTransactions,
  updateTransaction,
  deleteTransaction,
  searchTransactions,
  resumoTransactions,
};
