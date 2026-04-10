const { Router } = require('express');

const {
    getVentas,
    getVentaById,
    registrarVenta,
} = require('../controllers/venta.controller');

const router = Router();

router.get('/',      getVentas);
router.get('/:id',   getVentaById);
router.post('/',     registrarVenta);

module.exports = router;