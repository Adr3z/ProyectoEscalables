const Producto = require('../models/producto.model');
const Inventario = require('../models/inventario.model');

//GET /api/productos
//Obtener todos los productos
const getProductos = async( req, res) => {
    try {
        const productos = await Producto.find().populate('categoriaId', 'nombre');
        res.status(200).json(productos);
    }catch (error) {
        res.status(500).json({
            message: 'Error al obtener los productos', error
        });
    }
};


//GET /api/productos/:id
//Obtener un producto
const getProductoById = async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id).populate('categoriaId', 'nombre');
        if(!producto) {
            return res.status(404).json({
                message: 'Producto no encontrado'
            });
        }
        res.status(200).json(producto);
    }catch (error) {
        res.status(500).json({
            message: 'Error al encontrar el producto', error
        });
    }
};


//GET /api/productos/publicos
//Obtener productos para el catalogo publico
const getProductosPublicos = async( req, res) => {
    try {
        const productos = await Producto.find({ stockActual: { $gt: 0} }).populate('categoriaId', 'nombre').select('nombre descripcion precio categoriaId stockActual');
        res.status(200).json(productos);
    }catch (error) {
        res.status(500).json({
            message: 'Error al obtener los productos', error
        })
    }
}


//POST /api/productos
//Crear un nuevo producto
const createProducto = async( req, res) => {
    try {
        const { nombre, descripcion, precio, categoriaId, stockMinimo, stockMaximo } = req.body;

        //Validación de los stocks
        if(stockMinimo > stockMaximo) {
            return res.status(400).json({
                message: 'El stock mínimo no puede ser mayor que el stock máximo',
            });
        }

        const producto = new Producto({ nombre, descripcion, precio, categoriaId });
        await producto.save();

        //Crear un registro de inventario para el nuevo producto
        await new Inventario({
            productoId: producto._id,
            stockMinimo,
            stockMaximo,
        }).save();

        res.status(201).json(producto);
    }catch (error) {
        res.status(500).json({
            message: 'Error al crear el producto', error
        });
    }
};


//PUT /api/productos/:id
//Actualizar un producto
const updateProducto = async (req, res) => {
    try {
        const { nombre, descripcion, precio, categoriaId, stockMinimo, stockMaximo } = req.body;
        
        //Validacion de limites de stock
        if(stockMinimo !== undefined && stockMaximo !== undefined) {
            if(stockMinimo > stockMaximo) {
                return res.status(400).json({
                    message: 'El stock mínimo no puede ser mayor que el stock máximo',
                });
            }

            await Inventario.findOneAndUpdate(
                { productoId: req.params.id },
                { stockMinimo, stockMaximo, fechaActualizacion: Date.now() },
                { runValidators: true },
            );
        }
        
        const producto = await Producto.findByIdAndUpdate(
            req.params.id,
            { nombre, descripcion, precio, categoriaId },
            { new: true, runValidators: true}
        ).populate('categoriaId', 'nombre');

        if(!producto) {
            return res.status(404).json({
                message: 'Producto no encontrado'
            });
        }

        res.status(200).json(producto);
    }catch (error) {
        res.status(500).json({
            message: 'Error al actualizar el producto', error
        });
    }
};


//DELETE /api/productos/:id
//Eliminar un producto
const deleteProducto = async (req, res) => {
    try {
        const producto = await Producto.findByIdAndDelete(req.params.id);

        if(!producto) {
            return res.status(404).json({
                message: 'Producto no encontrado'
            });
        }

        //Eliminar el registro de inventario asociado
        await Inventario.findOneAndDelete({ productoId: req.params.id });

        res.status(200).json({
            message: 'Producto eliminado correctamente'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al eliminar el producto', error
        });
    }
};


module.exports = {
    getProductos,
    getProductoById,
    getProductosPublicos,
    createProducto, 
    updateProducto,
    deleteProducto,
};