const express = require('express')
const controller = require('../controllers/cartaoCredito.controller');
const controllerCard = require('../controllers/cartao.controller');
const router = express.Router();

router.post('/transaction/create', controller.Create)
router.get('/transaction/readlist', controller.ReadList)
router.get('/transaction/read', controller.Read)
router.put('/transaction/update', controller.Update)
router.delete('/transaction/delete', controller.Delete)
router.post('/transaction/search', controller.Search)
router.get('/transactions/resumo', controller.Resumo)

router.post('/create', controllerCard.Create)
router.get('/list', controllerCard.SearchList)
router.get('/search', controllerCard.Search)
router.put('/update', controllerCard.Update)
router.delete('/delete', controllerCard.Delete)

module.exports = router