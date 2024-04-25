const express = require('express');
const router = express.Router();
const AlimentacaoRoutes = require('./alimentacao.route')
const CartaoCreditoRoutes = require('./cartaoCredito.route')
const ContaFisicaRoutes = require('./contaFisica.route')
const ContaPoupancaRoutes = require('./contaPoupanca.route')                                               
const ConfiguracoesRoutes = require('./configuracoes.route')

router.use('/alimentacao', AlimentacaoRoutes);
router.use('/cartao-credito', CartaoCreditoRoutes);
router.use('/conta-fisica', ContaFisicaRoutes);
router.use('/conta-poupanca', ContaPoupancaRoutes);
router.use('/config', ConfiguracoesRoutes);

router.get('/', (req, res) => {
    res.send('Servidor rodando!');
});

module.exports = router;