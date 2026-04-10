const { Router } = require('express');

const {
    getInventario,
    getInventarioById,
    registrarEntrada,
} = require('../controllers/inventario.controller');

const router = Router();

router.get('/', getInventario);
router.get('/:id', getInventarioById);
router.post('/entrada', registrarEntrada);

module.exports = router;