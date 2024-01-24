const express = require('express')
const controller = require('../controllers/transaction.controller');
const router = express.Router();

router.post('/transactions', controller.Receive)

module.exports = router