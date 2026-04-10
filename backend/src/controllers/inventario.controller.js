const Inventario = require('../models/inventario.model');
const Producto = require('../models/producto.model');
const Movimiento = require('../models/movimiento.model');

//Calcular el estao de stock segun los límites del inventario
const calcularEstado = (stockActual, stockMinimo, stockMaximo) => {
    if (stockActual === 0) {
        return 'AGOTADO';
    }
    if (stockActual <= stockMinimo) {
        return 'CRITICO';
    }  
    if (stockActual <= stockMinimo * 1.5) {
        return 'BAJO';
    }
    return 'SUFICIENTE';
} 


//GET /api/inventario
//Obtener el estado de inventario de todos los productos
const getInventario = async (req, res) => {
    try {
        const inventario = await Inventario.find().populate({
            path: 'productoId',
            select: 'nombre precio stockActual',
            populate: { path: 'categoriaId', select: 'nombre' },
        });

        //Adjuntar el estado calculado a cada registro
        const resultado = inventario.map((item) => {
            const objeto = item.toObject();
            return {
                ...objeto,
                producto: objeto.productoId,
                estado: calcularEstado(
                    objeto.productoId.stockActual,
                    objeto.stockMinimo,
                    objeto.stockMaximo
                ),
            };
        });

        res.status(200).json(resultado);
    }catch (error) {
        res.status(500).json({
            message: 'Error al obtener el inventario', error
        });
    }
};


//GET /api/inventario/:id
//Obtener el estado de inventario de un producto
const getInventarioById = async(req, res) => {
    try {
        const item = await Inventario.findById(req.params.id).populate({
            path: 'productoId',
            select: 'nombre precio stockActual',
            populate: {path: 'categoriaId', select: 'nombre' },
        });

        if(!item) {
            return res.status(404).json({
                message: 'Registro de inventario no encontrado'
            });
        }

        const objeto = item.toObject();
        res.json({
            ...objeto,
            producto: objeto.productoId,
            estado: calcularEstado(
                objeto.productoId.stockActual,
                objeto.stockMinimo, 
                objeto.stockMaximo
            ),
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener el registro', error
        });
    }
};


//POST /api/inventario/entrada
//Registrar una entrada de producto al inventario
const registrarEntrada = async (req, res) => {
    try {
        const {productoId, cantidad, notas, usuarioId } = req.body;

        if( cantidad <= 0) {
            return res.status(400).json({
                message: 'La cantidad debe ser mayor a cero'
            });
        }

        const producto = await Producto.findById(productoId);
        if (!producto){
            return res.status(404).json({
                message: 'Producto no encontrado'
            });
        }

        const inventario = await Inventario.findOne({ productoId });
        if (!inventario) {
            return res.status(404).json({
                message:' Registro de inventario no encontrado'
            });
        }

        const nuevoStock = producto.stockActual + cantidad;
        if( nuevoStock > inventario.stockMaximo) {
            return res.status(400).json({
                message: 'La cantidad excede el stock máximo permitido'
            });
        }

        producto.stockActual = nuevoStock;
        await producto.save();

        inventario.fechaActualizacion = Date.now();
        await inventario.save();

        const movimiento = await new Movimiento({
            tipo: 'ENTRADA',
            productoId,
            cantidad,
            usuarioId,
            notas
        }).save();

        res.status(201).json({
            message: 'Entrada registrada correctamente',
            stockActual: producto.stockActual,
            movimiento,
        });
    }catch (error){
        res.status(500).json({
            message: 'Error al registrar la entrada', error
        });
    }
};

const actualizarInventario = async (req, res) => {
    try {
        const { stockMinimo, stockMaximo } = req.body;
        const inventario = await Inventario.findById(req.params.id);

        if (!inventario) {
            return res.status(404).json({
                message: 'Registro de inventario no encontrado'
            });
        }

        inventario.stockMinimo = stockMinimo ?? inventario.stockMinimo;
        inventario.stockMaximo = stockMaximo ?? inventario.stockMaximo;
        inventario.fechaActualizacion = Date.now();

        const actualizado = await inventario.save();
        const actualizadoPopulado = await actualizado.populate({
            path: 'productoId',
            select: 'nombre precio stockActual',
            populate: { path: 'categoriaId', select: 'nombre' },
        });

        const objeto = actualizadoPopulado.toObject();
        res.json({
            ...objeto,
            producto: objeto.productoId,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al actualizar el inventario', error
        });
    }
};

module.exports = {
    getInventario,
    getInventarioById,
    registrarEntrada,
    actualizarInventario,
};