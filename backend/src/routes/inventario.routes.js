const { Router } = require('express');

const {
    getInventario,
    getInventarioById,
    registrarEntrada,
    registrarSalida,
    actualizarInventario,
} = require('../controllers/inventario.controller');

const router = Router();

router.get('/', getInventario);
router.get('/:id', getInventarioById);
router.post('/entrada', registrarEntrada);
router.post('/salida', registrarSalida);
router.put('/:id', actualizarInventario);

module.exports = router;