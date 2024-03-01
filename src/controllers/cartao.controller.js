const { createCartao, searchCartao, searchCartoes, updateCartao, deleteCartao } = require('../service/cartaoService')

exports.Create = async (req, res) => {
  const data = await createCartao(
    req.body || []
  )
  return res.status(200).json(data)
}

exports.Search = async (req, res) => {
  const data = await searchCartao(
    req.query || []
  )
  return res.status(200).json(data)
}

exports.SearchList = async (req, res) => {
  const data = await searchCartoes(
    req.body || []
  )
  return res.status(200).json(data)
}

exports.Update = async (req, res) => {
  const data = await updateCartao(
    req.body || []
  )
  return res.status(200).json(data)
}

exports.Delete = async (req, res) => {
  const data = await deleteCartao(
    req.body || []
  )
  return res.status(200).json(data)
}

exports.Resumo = async (req, res) => {
  const data = await resumoCartoes(
    req.body || []
  )
  return res.status(200).json(data)
}