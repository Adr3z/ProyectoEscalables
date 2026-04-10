const { Router } = require('express');

const {
    getMovimientos,
} = require('../controllers/movimiento.controller');

const router = Router();

router.get('/', getMovimientos);

module.exports = router;