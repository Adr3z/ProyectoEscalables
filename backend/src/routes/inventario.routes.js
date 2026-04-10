const { Router } = require('express');

const {
    getInventario,
    getInventarioById,
    registrarEntrada,
    actualizarInventario,
} = require('../controllers/inventario.controller');

const router = Router();

router.get('/', getInventario);
router.get('/:id', getInventarioById);
router.post('/entrada', registrarEntrada);
router.put('/:id', actualizarInventario);

module.exports = router;