const { Router } = require('express');
const { verifyToken, allowRoles } = require('../middlewares/auth.middleware');

const {
    getInventario,
    getInventarioById,
    registrarEntrada,
    registrarSalida,
    actualizarInventario,
} = require('../controllers/inventario.controller');

const router = Router();

router.get('/', verifyToken, allowRoles('Administrador', 'Empleado'), getInventario);
router.get('/:id', verifyToken, allowRoles('Administrador', 'Empleado'), getInventarioById);
router.post('/entrada', verifyToken, allowRoles('Administrador'), registrarEntrada);
router.post('/salida', verifyToken, allowRoles('Administrador'), registrarSalida);
router.put('/:id', verifyToken, allowRoles('Administrador'), actualizarInventario);

module.exports = router;