const express = require('express')
const controller = require('../controllers/alimentacao.controller');
const router = express.Router();

router.post('/transaction/create', controller.Create)
router.get('/transaction/list', controller.ReadList)
router.get('/transaction/read', controller.Read)
router.put('/transaction/update', controller.Update)
router.delete('/transaction/delete', controller.Delete)
router.post('/transaction/search', controller.Search)
router.post('/transactions/resumo', controller.Resumo)
// router.post('/transaction/teste', )

module.exports = router