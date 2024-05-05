const { createTransaction, readTransaction, readTransactions, searchTransactions, updateTransaction, deleteTransaction, resumoTransactions } = require('../service/alimentacaoService')

exports.Create = async (req, res) => {
  const data = await createTransaction(
    req.body || []
  )
  return res.status(200).json(data)
}

exports.Read = async (req, res) => {
  const data = await readTransaction(
    req.query || []
  )
  return res.status(200).json(data)
}

exports.ReadList = async (req, res) => {
  const data = await readTransactions(
    req.body || []
  )
  return res.status(200).json(data)
}

exports.Update = async (req, res) => {
  console.log('informações chegou',req.body)
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

exports.Search = async (req, res) => {
  const data = await searchTransactions(
    req.body || []
  )
  return res.status(200).json(data)
}

exports.Resumo = async (req, res) => {
  const data = await resumoTransactions(
    req.body || []
  )
  return res.status(200).json(data)
}