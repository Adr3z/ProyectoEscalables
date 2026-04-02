const { Router } = require('express');

const {
    getCategorias, 
    getCategoriaById,
    createCategoria,
    updateCategoria,
    deleteCategoria,
} = require('../controllers/categoria.controller');

const router = Router();

router.get('/', getCategorias);
router.get('/:id', getCategoriaById);
router.post('/', createCategoria);
router.put('/:id', updateCategoria);
router.delete('/:id', deleteCategoria);

module.exports = router;