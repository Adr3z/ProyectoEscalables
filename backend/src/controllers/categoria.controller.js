const Categoria = require('../models/categoria.model');

//GET /api/categorias
//Obtener todas las categorías
const getCategorias = async( req, res) => {
    try {
        const categorias = await Categoria.find();
        res.status(200).json(categorias);
    }catch (error) {
        res.status(500).json({
            message: 'Error al obtener las categorías', error
        });
    }
};


//GET /api/categorias/:id
//Obtener una categoría 
const getCategoriaById = async (req, res) => {
    try {
        const categoria = await Categoria.findById(req.params.id);
        if(!categoria) {
            return res.status(404).json({
                message: 'Categoría no encontrada'
            });
        }

        res.status(200).json(categoria);
    }catch (error) {
        res.status(500).json({
            message: 'Categoria no encontrada', error
        });
    }
};


//POST /api/categorias
//Crear una nueva categoría
const createCategoria = async (req, res) => {
    try {
        const { nombre, descripcion, padreId: rawPadreId } = req.body;
        const padreId = typeof rawPadreId === 'string' ? rawPadreId.trim() : rawPadreId;
        const categoria = new Categoria({ nombre, descripcion, padreId: padreId || null });

        await categoria.save();
        res.status(201).json(categoria);
    }catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                message: 'Ya existe una categoría con ese nombre'
            });
        }

        res.status(500).json({
            message: 'Error al crear la categoría', error
        });
    }
};


//PUT /api/categorias/:id
//Actualizar una categoria
const updateCategoria = async (req, res) => {
    try {
        const { nombre, descripcion, padreId: rawPadreId } = req.body;
        const padreId = typeof rawPadreId === 'string' ? rawPadreId.trim() : rawPadreId;
        const categoria = await Categoria.findByIdAndUpdate(
            req.params.id,
            { nombre, descripcion, padreId: padreId || null },
            { returnDocument: 'after' }
        );

        if (!categoria) {
            return res.status(404).json({
                message: 'Categoría no encontrada'
            });
        }
        res.status(200).json(categoria);
    } catch (error) {
        if (error.code === 11000){
            return res.status(400).json({
                message: 'Ya existe una categoría con ese nombre'
            });
        }
        res.status(500).json({
            message: 'Error al actualizar la categoría', error
        });
    }
};


//DELETE /api/categorias/:id
//Eliminar una categoria
const deleteCategoria = async( req, res) =>{
    try {
        const categoria = await Categoria.findByIdAndDelete(req.params.id);
        if(!categoria) {
            return res.status(404).json({
                message: 'Categoria no encontrada'
            });
        }
        res.json({
            message: 'Categoria eliminada correctamente'
        });

    }catch (error) {
        res.status(500).json({
            message: 'Error al eliminar la categoría', error
        });
    }
};


module.exports = {
    getCategorias,
    getCategoriaById,
    createCategoria,
    updateCategoria,
    deleteCategoria,
};