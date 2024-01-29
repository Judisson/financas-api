const { createTransaction, searchTransaction, searchTransactions, updateTransaction, deleteTransaction } = require('../service/alimentacaoService')

exports.Create = async (req, res) => {
  const data = await createTransaction(
    req.body || []
  )
  return res.status(200).json(data)
}

exports.Search = async (req, res) => {
  const data = await searchTransaction(
    req.query || []
  )
  return res.status(200).json(data)
}

exports.SearchList = async (req, res) => {
  const data = await searchTransactions(
    req.body || []
  )
  return res.status(200).json(data)
}

exports.Update = async (req, res) => {
  const data = await updateTransaction(
    req.body, req.query || []
  )
  return res.status(200).json(data)
}

exports.Delete = async (req, res) => {
  const data = await deleteTransaction(
    req.body || []
  )
  return res.status(200).json(data)
}