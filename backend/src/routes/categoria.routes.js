const { Router } = require('express');
const { verifyToken, allowRoles } = require('../middlewares/auth.middleware');

const {
    getCategorias, 
    getCategoriaById,
    createCategoria,
    updateCategoria,
    deleteCategoria,
} = require('../controllers/categoria.controller');

const router = Router();

router.get('/publicas', getCategorias);
router.get('/', verifyToken, allowRoles('Administrador', 'Empleado'), getCategorias);
router.get('/:id', verifyToken, allowRoles('Administrador', 'Empleado'), getCategoriaById);
router.post('/', verifyToken, allowRoles('Administrador'), createCategoria);
router.put('/:id', verifyToken, allowRoles('Administrador'), updateCategoria);
router.delete('/:id', verifyToken, allowRoles('Administrador'), deleteCategoria);

module.exports = router;