const { createConfiguracoes, readConfiguracoes, searchTransactions, updateConfiguracoes, deleteTransaction, resumoTransactions } = require('../service/configuracoesService')

exports.Create = async (req, res) => {
  const data = await createConfiguracoes(
    req.body || []
  )
  return res.status(200).json(data)
}

exports.Read = async (req, res) => {
  const data = await readConfiguracoes(
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
  const data = await updateConfiguracoes(
    req.body || []
  )
  return res.status(200).json(data)
}

exports.Delete = async (req, res) => {
  const data = await deleteTransaction(
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