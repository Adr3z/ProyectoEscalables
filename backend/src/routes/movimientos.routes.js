const { Router } = require('express');
const { verifyToken, allowRoles } = require('../middlewares/auth.middleware');

const {
    getMovimientos,
    updateMovimiento,
    deleteMovimiento,
} = require('../controllers/movimiento.controller');

const router = Router();

router.get('/', verifyToken, allowRoles('Administrador', 'Empleado'), getMovimientos);
router.put('/:id', verifyToken, allowRoles('Administrador'), updateMovimiento);
router.delete('/:id', verifyToken, allowRoles('Administrador'), deleteMovimiento);

module.exports = router;