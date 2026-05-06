const Venta = require('../models/venta.model');
const Producto = require('../models/producto.model');
const Usuario = require('../models/usuario.model');
const Movimiento = require('../models/movimiento.model');


//GET /api/ventas
//Obtener todas las ventas
const getVentas = async (req, res) => {
    try {
        const ventas = await Venta.find().populate({
            path: 'detalles.productoId',
            select: 'nombre precio',
        }).sort({ fecha: -1 });

        res.status(200).json(ventas);
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener las ventas', error
        });
    }
};


//GET /api/ventas/:id
//Obtener una venta
const getVentaById = async (req, res) => {
    try {
        const venta = await Venta.findById(req.params.id).populate({
            path: 'detalles.productoId',
            select:'nombre precio',
        });

        if(!venta) {
            return res.status(404).json({
                message:'Venta no encontrada'
            });
        }

        res.status(200).json(venta);
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener la venta', error
        });
    }
};


//POST /api/ventas
//Registrar una venta
const registrarVenta = async (req, res) => {
    try {
        const { detalles } = req.body;
        const usuarioId = req.user.id; // Usar usuario del token

        if(!detalles || detalles.length === 0) {
            return res.status(400).json({
                message: 'La venta debe contener al menos un producto'
            });
        }

        // Validar que el usuario existe
        const usuario = await Usuario.findById(usuarioId);
        if(!usuario) {
            return res.status(401).json({
                message: 'Usuario no válido'
            });
        }

        for (const detalle of detalles) {
            const producto = await Producto.findById(detalle.productoId);
            if(!producto) {
                return res.status(400).json({
                    message: 'Producto no encontrado',
                });
            }

            if(producto.stockActual < detalle.cantidad) {
                return res.status(400).json({
                    message: `Stock insuficiente para "${producto.nombre}". Disponible: ${producto.stockActual}, solicitado: ${detalle.cantidad}`
                });
            }
        }

        let total = 0;
        const detallesVenta = [];

        for (const detalle of detalles) {
            const producto = await Producto.findById(detalle.productoId);
            const precioUnitario = producto.precio;
            total += precioUnitario * detalle.cantidad;

            detallesVenta.push({
                productoId: producto._id,
                nombreProducto: producto.nombre,
                cantidad: detalle.cantidad,
                precioUnitario,
            });

            producto.stockActual -= detalle.cantidad;
            await producto.save();

            await new Movimiento({
                tipo: 'SALIDA',
                productoId: producto._id,
                nombreProducto: producto.nombre,
                cantidad: detalle.cantidad,
                usuarioId,
            }).save();
        }

        const venta = await new Venta({
            usuarioId,
            total,
            detalles: detallesVenta,
        }).save();

        res.status(201).json(venta);
    } catch (error) {
        console.error('Error en registrarVenta:', error);
        res.status(500).json({
            message: 'Error al registrar la venta', error: error.message
        });
    }
};


module.exports = {
    getVentas,
    getVentaById,
    registrarVenta,
};