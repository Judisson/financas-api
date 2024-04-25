const express = require('express')
const controller = require('../controllers/configuracoes.controller');
const router = express.Router();

router.post('/create', controller.Create)
// router.get('/transaction/list', controller.SearchList)
router.get('/read', controller.Read)
router.put('/update', controller.Update)
// router.delete('/transaction/delete', controller.Delete)
// router.get('/transactions/resumo', controller.Resumo)

module.exports = router