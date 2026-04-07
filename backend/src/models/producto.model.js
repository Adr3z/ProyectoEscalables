const { Schema, model } = require('mongoose');

const ProductoSchema = new Schema({

    nombre: {
        type: String,
        required: [true, 'El nombre del producto es obligatorio'],
        trim: true,
    },

    descripcion: {
        type: String,
        trim: true,
    },

    precio:{
        type: Number, 
        required: [true, 'El precio del producto es obligatorio'],
        min: [0, 'El precio del producto no puede ser negativo'],
    },

    categoriaId: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: [true, 'La categoría del producto es obligatoria'],
    },
    
    stockActual: {
        type: Number, 
        default: 0,
        min: [0, 'El stock no puede ser negativo'],
    },
});

module.exports = model('Producto', ProductoSchema);