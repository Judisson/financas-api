const express = require('express');
const router = express.Router();
const transactionRoutes = require('./transaction.route')

router.use('/', transactionRoutes);

router.get('/', (req, res) => {
    res.send('Servidor rodando!');
});

module.exports = router;