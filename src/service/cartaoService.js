const dotenv = require('dotenv').config();
const CartaoCredito = require('../db/models/cartaoCredito.model');

const createCartao = async (objCartao) => {
  let {
    bandeira,
    banco,
    numeroCartao,
    limiteCartao,
    dateAtualizacao,
  } = objCartao;
  let newCartao;

  const ultimoCartao = await CartaoCredito.aggregate([
    { $group: { _id: null, maxCod: { $max: '$idCartao' } } },
  ]);

  const novoid = ultimoCartao.length > 0 ? ultimoCartao[0].maxCod + 1 : 1;

  newCartao = new CartaoCredito({
    idCartao: novoid,
    bandeira,
    banco,
    numeroCartao,
    limiteCartao,
    dateAtualizacao,
  });

  console.log('objeto inteiro', newCartao);

  if (numeroCartao === '') {
    console.log('Error: Invalid estabelecimento');
  } else {
    newCartao
      .save()
      .then((doc) => console.log('Documento Salvo: ', doc))
      .catch((err) => console.log('Error ao salvar o novo documento: ', err));
  }

  return newCartao;
};

const searchCartao = async (objCartao) => {
  let { idCartao } = objCartao;
  let cartaoEncontrado;

  // if (tipoTransacao === 'conta-fisica') {
  cartaoEncontrado = await CartaoCredito.findOne({ idCartao });
  // }

  if (!cartaoEncontrado) {
    // return res.status(404).json({ mensagem: 'Transacação não encontrada' });
    console.log('Cartao não encontrado (searchTransaction)');
  }

  // Incluindo o campo 'cod' na resposta
  return cartaoEncontrado;
  // return res.json({
  //   ...cartaoEncontrado.toObject(),
  //   idCartao: idCartao,
  // });
};

const searchCartoes = async (objCartao) => {
  let { tipoTransacao } = objCartao;
  let transacoesEncontradas;

  transacoesEncontradas = await CartaoCredito.find();

  return transacoesEncontradas;
  // return res.status(200).json(transacoesEncontradas);
};

// Atualiza uma transação por id
const updateCartao = async (objCartao) => {
  const { idCartao, ...data } = objCartao;
  const cartaoEncontrado = await CartaoCredito.findOne({
    idCartao: idCartao,
  });

  console.log("updateTransaction(1) - data: ", data)

  if (!cartaoEncontrado) {
    // return res.status(404).json({ mensagem: "Atleta não encontrado." });
    console.log('Transacão não encontrada (updateTransaction)');
  }

  await CartaoCredito.updateOne({ idCartao: idCartao }, data);

  // Atualizando o objeto atletaEncontrado com os dados atualizados
  const transacaoAtualizada = { ...cartaoEncontrado.toObject(), ...data };

  // Incluindo o campo 'cod' na resposta
  return transacaoAtualizada;
  // return data;
};

// Deleta uma transação por id
const deleteCartao = async (objCartao) => {
  console.log('FoiChamadoo delete');
  const { idCartao } = objCartao;
  const cartaoEncontrado = await CartaoCredito.findOne({
    idCartao: idCartao,
  });

  if (!cartaoEncontrado) {
    // res.status(404).json({ mensagem: "Atleta não encontrado." });
    console.log('Transacão não encontrada (deleteTransaction)');
  } else {
    await CartaoCredito.deleteOne({ idCartao: idCartao });
    // return res.status(200).json({});
  }
};

module.exports = {
  createCartao,
  searchCartao,
  searchCartoes,
  updateCartao,
  deleteCartao,
};
