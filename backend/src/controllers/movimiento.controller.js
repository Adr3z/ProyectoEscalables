const Movimiento = require('../models/movimiento.model');
const Producto = require('../models/producto.model');
const Inventario = require('../models/inventario.model');

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

//PUT /api/movimientos/:id
//Actualizar un movimiento
const updateMovimiento = async (req, res) => {
    try {
        const { id } = req.params;
        const { cantidad } = req.body;

        const movimientoActual = await Movimiento.findById(id);
        if (!movimientoActual) {
            return res.status(404).json({ message: 'Movimiento no encontrado' });
        }

        if (cantidad <= 0) {
            return res.status(400).json({ message: 'La cantidad debe ser mayor a cero' });
        }

        const diferencia = cantidad - movimientoActual.cantidad;

        // Actualizar stock del producto
        const producto = await Producto.findById(movimientoActual.productoId);
        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        const inventario = await Inventario.findOne({ productoId: movimientoActual.productoId });
        if (!inventario) {
            return res.status(404).json({ message: 'Registro de inventario no encontrado' });
        }

        if (movimientoActual.tipo === 'ENTRADA') {
            producto.stockActual += diferencia;
            if (producto.stockActual > inventario.stockMaximo) {
                return res.status(400).json({ message: 'La actualización excede el stock máximo permitido' });
            }
        } else if (movimientoActual.tipo === 'SALIDA') {
            producto.stockActual -= diferencia;
        }

        // Validar que el stock no sea negativo
        if (producto.stockActual < 0) {
            return res.status(400).json({ message: 'La actualización resultaría en stock negativo' });
        }

        await producto.save();

        // Actualizar fecha de inventario
        await Inventario.findOneAndUpdate(
            { productoId: movimientoActual.productoId },
            { fechaActualizacion: Date.now() }
        );

        const movimiento = await Movimiento.findByIdAndUpdate(id, { cantidad }, { returnDocument: 'after' })
            .populate('productoId', 'nombre')
            .populate('usuarioId', 'nombre email');

        res.status(200).json(movimiento);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el movimiento', error });
    }
};

//DELETE /api/movimientos/:id
//Eliminar un movimiento
const deleteMovimiento = async (req, res) => {
    try {
        const { id } = req.params;

        const movimiento = await Movimiento.findById(id);
        if (!movimiento) {
            return res.status(404).json({ message: 'Movimiento no encontrado' });
        }

        // Revertir el cambio en el stock del producto
        const producto = await Producto.findById(movimiento.productoId);
        if (producto) {
            if (movimiento.tipo === 'ENTRADA') {
                producto.stockActual -= movimiento.cantidad;
            } else if (movimiento.tipo === 'SALIDA') {
                producto.stockActual += movimiento.cantidad;
            }

            // Asegurar que el stock no sea negativo
            if (producto.stockActual < 0) {
                producto.stockActual = 0;
            }

            await producto.save();

            // Actualizar fecha de inventario
            await Inventario.findOneAndUpdate(
                { productoId: movimiento.productoId },
                { fechaActualizacion: Date.now() }
            );
        }

        await Movimiento.findByIdAndDelete(id);

        res.status(200).json({ message: 'Movimiento eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el movimiento', error });
    }
};

module.exports = {
    getMovimientos,
    updateMovimiento,
    deleteMovimiento,
};