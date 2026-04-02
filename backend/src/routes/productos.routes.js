const { Router } = require('express');

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
router.get('/', getProductos);
router.get('/:id', getProductoById);
router.post('/', createProducto);
router.put('/:id', updateProducto);
router.delete('/:id', deleteProducto);

module.exports = router;