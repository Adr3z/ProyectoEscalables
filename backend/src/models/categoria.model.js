const { Schema, model } = require('mongoose');

const CategoriaSchema = Schema({

    nombre: {
        type: String,
        required: [true, 'El nombre de la categoría es obligatorio'],
        trim: true,
        unique:true,
    },
    
    descripcion: {
        type: String,
        trim: true,
    },

    padreId: {
    type: Schema.Types.ObjectId,
    ref: 'Categoria',
    default: null, // null = categoría principal
    }
});

module.exports = model('Categoria', CategoriaSchema);