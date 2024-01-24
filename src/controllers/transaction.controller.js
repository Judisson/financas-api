const { receiveTransaction } = require('../class/instance')

exports.Receive = async (req, res) => {
  const data = await receiveTransaction(
    req.body || []
  )
  return res.status(200).json({ data: data })
}