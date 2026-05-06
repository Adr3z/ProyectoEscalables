const { Router } = require('express');
const { verifyToken, allowRoles } = require('../middlewares/auth.middleware');

const {
    getVentas,
    getVentaById,
    registrarVenta,
} = require('../controllers/venta.controller');

const router = Router();

router.get('/', verifyToken, allowRoles('Administrador'), getVentas);
router.get('/:id', verifyToken, allowRoles('Administrador'), getVentaById);
router.post('/', verifyToken, allowRoles('Administrador', 'Empleado'), registrarVenta);

module.exports = router;