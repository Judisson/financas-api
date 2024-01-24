const dotenv = require('dotenv').config();
const Transaction = require('../db/models/transaction.model');

const receiveTransaction = async (objTransaction) => {
  let { title } = objTransaction;

  let newTransaction = new Transaction({
    title: title
  })

  newTransaction.save().then((doc) => console.log('Documento Salvo: ', doc)).catch((err) => console.log('Error ao salvar o novo documento: ', err));
}

module.exports = { receiveTransaction }