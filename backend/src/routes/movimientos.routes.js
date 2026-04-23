const { Router } = require('express');

const {
    getMovimientos,
    updateMovimiento,
    deleteMovimiento,
} = require('../controllers/movimiento.controller');

const router = Router();

router.get('/', getMovimientos);
router.put('/:id', updateMovimiento);
router.delete('/:id', deleteMovimiento);

module.exports = router;