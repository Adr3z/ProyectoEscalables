const { Router } = require('express');
const { verifyToken, allowRoles } = require('../middlewares/auth.middleware');

const {
    getProductos, 
    getProductoById,
    getProductosPublicos,
    createProducto, 
    updateProducto,
    deleteProducto,
} = require('../controllers/producto.controller');

const router = Router();

router.get('/publicos', getProductosPublicos);
router.get('/', verifyToken, allowRoles('Administrador', 'Empleado'), getProductos);
router.get('/:id', verifyToken, allowRoles('Administrador', 'Empleado'), getProductoById);
router.post('/', verifyToken, allowRoles('Administrador'), createProducto);
router.put('/:id', verifyToken, allowRoles('Administrador'), updateProducto);
router.delete('/:id', verifyToken, allowRoles('Administrador'), deleteProducto);

module.exports = router;