const { Schema, model } = require('mongoose');

const InventarioSchema = new Schema({

    productoId: {
        type: Schema.Types.ObjectId,
        ref: 'Producto',
        required: [true, 'El producto es obligatorio'],
        unique: true,
    },

    stockMinimo: {
        type: Number,
        required: [true, 'El stock mínimo es obligatorio'],
        min: [0, 'El stock mínimo no puede ser negativo'],
    },

    stockMaximo: {
        type: Number,
        required: [true, 'El stock máximo es obligatorio'],
        min: [0, 'El stock máximo no puede ser negativo'],
    },
    
    fechaActualizacion: {
        type: Date,
        default: Date.now,
    },
});

module.exports = model('Inventario', InventarioSchema);