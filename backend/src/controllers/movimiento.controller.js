const Movimiento = require('../models/movimiento.model');

//GET /api/movimientos
//Obtener todos los movimientos
const getMovimientos = async (req, res) => {
    try {
        const movimientos = await Movimiento.find()
        .populate('productoId', 'nombre')
        .populate('usuarioId', 'nombre email')
        .sort({ fecha: -1 });

        res.status(200).json(movimientos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los movimientos', error});
    }
};

module.exports = {
    getMovimientos,
};