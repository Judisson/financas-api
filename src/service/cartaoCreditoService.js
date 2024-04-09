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
  quantidadeParcelas,
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
  quantidadeParcelas,
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

// const searchTransactions = async (objPesquisa) => {
//   console.log('objPesquisa', objPesquisa);
//   let { estabelecimento, cartaoCredito, mesesdoAno } = objPesquisa;
//   let transacoesEncontradas;
//   let query = {};

//   if (estabelecimento) {
//     query.estabelecimento = estabelecimento;
//   }

//   if (cartaoCredito) {
//     query.cartaoCredito = cartaoCredito;

//     const cartao = await Cartao.findById(cartaoCredito);
//     if (cartao && mesesdoAno !== undefined) {
//       const dateAtualizacao = cartao.dateAtualizacao;

//       // Obtém o primeiro dia do mês atual e o primeiro dia do próximo mês
//       // const primeiroDiaAtual = new Date();
//       // primeiroDiaAtual.setDate(1);

//       // const primeiroDiaProximoMes = new Date();
//       // primeiroDiaProximoMes.setMonth(primeiroDiaProximoMes.getMonth() + 1);
//       // primeiroDiaProximoMes.setDate(1);

//       // // Configura a consulta para o intervalo entre o dia de atualização e o próximo mês
//       // query.data = {
//       //   $gte: new Date(primeiroDiaAtual.getFullYear(), mesesdoAno, dateAtualizacao),
//       //   $lt: new Date(primeiroDiaProximoMes.getFullYear(), primeiroDiaProximoMes.getMonth(), dateAtualizacao),
//       // };

//       const dataInicial = new Date(`${mesesdoAno}-01`);
//       const dataFinal = new Date(`${mesesdoAno + 1}-01`);

//       // Define a data de atualização do cartão no intervalo do mês fornecido
//       query.dataAtualizacaoCartao = {
//         $gte: new Date(`${mesesdoAno}-${dateAtualizacao}`),
//         $lt: new Date(`${mesesdoAno + 1}-${dateAtualizacao}`),
//       };

//       // Adiciona a condição para a data da transação estar dentro do intervalo do mês
//       query.dataTransacao = {
//         $gte: dataInicial,
//         $lt: dataFinal,
//       };
//     }
//   }

//   if (mesesdoAno) {
//     query.mesesdoAno = mesesdoAno;
//   }

//   transacoesEncontradas = await CartaoCreditoTransaction.find(query);

//   return transacoesEncontradas;
//   // return transacoesEncontradas;
// }

const searchTransactions = async (objPesquisa) => {
  // console.log('objPesquisa', objPesquisa);
  let { dataSearch } = objPesquisa;
  let { estabelecimento, cartaoCredito, mesesdoAno } = dataSearch;
  let transacoesEncontradas;
  // let query = {};

  // if (estabelecimento) {
  //   query.estabelecimento = estabelecimento;
  // }

  if (cartaoCredito) {
    // query.cartaoCredito = cartaoCredito;

    const cartao = await Cartao.findOne({numeroCartao: cartaoCredito});
    // console.log('cartao', cartao);
    if (cartao && mesesdoAno !== undefined) {
      const dateAtualizacao = cartao.dateAtualizacao;

      const dataInicial = new Date(`2024-${mesesdoAno}-01`);
      const dataFinal = new Date(`2024-${mesesdoAno + 1}-01`);

      // console.log('dataInicial', dataInicial);
      console.log('cartao.dateAtualizacao', cartao);
      console.log('cartao.dateAtualizacao', cartao.dateAtualizacao);

      transacoesEncontradas = await CartaoCreditoTransaction.aggregate([
        {
          $unwind: "$parcelas" // Desconstruir o array 'parcelas'
        },
        {
          $match: {
            "parcelas.dataParcela": {
              $gte: new Date(`2024-${mesesdoAno}-${cartao.dateAtualizacao}`),
              $lt: new Date(`2024-${mesesdoAno + 1}-${cartao.dateAtualizacao}`)
            }
          }
        },
        {
          $group: {
            _id: "$_id", // Agrupando pelo ID original do documento
            // Manter todos os campos do documento original
            doc: { $first: "$$ROOT" }
          }
        },
        {
          $replaceRoot: { newRoot: "$doc" } // Promover o documento agrupado para o nível superior
        }
      ])
    }
    // console.log('transacoesEncontradas', transacoesEncontradas);
  }  

  // transacoesEncontradas = await CartaoCreditoTransaction.find(query);

  return transacoesEncontradas;
  // return transacoesEncontradas;
}

const resumoTransactions = async (objTransaction) => {
  let transacoesEncontradas;

  try {
    cartoesEncontrados = await Cartao.find();

    const resumos = await Promise.all(cartoesEncontrados.map(async (cartao) => {
      const dataMes = new Date();

      transacoesEncontradas = await CartaoCreditoTransaction.aggregate([
        {
          $match: {
            cartaoCredito: cartao.numeroCartao,
          }
        },
        {
          $unwind: "$parcelas" // Desenrolar o array de parcelas
        },
        {
          $match: {
            "parcelas.dataParcela": {
              $gte: new Date(`2024-${dataMes.getMonth() + 1}-${cartao.dateAtualizacao}`)
            },
            "parcelas.statusParcela": "Agendado" // Filtrar somente as parcelas com status "Pago"
          }
        },
        {
          $group: {
            _id: "$_id",
            // doc: { $first: "$$ROOT" },
            date: { $first: "$date" },
            parcelas: { $push: "$parcelas" }
          }
        },
        // {
        //   $replaceRoot: { newRoot: "$doc" }
        // }
      ])
      console.log('transacoesEncontradas: ', transacoesEncontradas);

      let limiteUsado = 0;
      if (transacoesEncontradas && transacoesEncontradas.length > 0) {
        transacoesEncontradas.forEach(transacao => {
            // console.log("transacao.parcelas: ", transacao.parcelas)
            // console.log("entrou 1 ")
            // transacao.doc.parcelas.forEach(parcela => limiteUsado += parcela.valorParcela);
            if (transacao.parcelas && transacao.parcelas.length > 0) {
              // console.log("entrou 2")
              transacao.parcelas.forEach(parcela => limiteUsado += parcela.valorParcela);
            } else {
              // console.log("entrou 3")
              limiteUsado += transacao.parcelas.valorParcela;
            }
        });
      }

      // console.log("cartao.limiteCartao: ", cartao.limiteCartao)
      // console.log("limiteUsado: ", limiteUsado)
      // console.log("transacoesEncontradas: ", transacoesEncontradas)

      const limiteDisponivel = cartao.limiteCartao - parseFloat(limiteUsado.toFixed(2));

      const resumoCartao = {
        numeroCartao: cartao.numeroCartao,
        limiteCartao: cartao.limiteCartao,
        banco: cartao.banco,
        bandeira: cartao.bandeira,
        limiteUsado: Number(limiteUsado).toFixed(2),
        limiteDisponivel,
      };

      return resumoCartao;
    }))

    return resumos;

  } catch (error) {
    console.error('Erro ao resumir transações:', error);
    throw error;
  }
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
