const express = require('express')
const controller = require('../controllers/contaFisica.controller');
const router = express.Router();

router.post('/transaction/create', controller.Create)
router.get('/transaction/list', controller.ReadList)
router.get('/transaction/read', controller.Read)
router.put('/transaction/update', controller.Update)
router.delete('/transaction/delete', controller.Delete)
router.post('/transactions/resumo', controller.Resumo)
router.post('/transaction/search', controller.Search)

module.exports = router