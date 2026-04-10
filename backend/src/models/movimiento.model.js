const { Schema, model } = require('mongoose');

const MovimientoSchema = new Schema({

    tipo: {
        type: String,
        enum: {
            values: ['ENTRADA', 'SALIDA'],
            message: 'Un movimiento solo puede ser ENTRADA o SALIDA',
        },
        required: [true, 'El tipo de movimiento es obligatorio'],
    },

    productoId: {
        type: Schema.Types.ObjectId,
        ref: 'Producto',
        required: true,
    },

    cantidad: {
        type: Number,
        required: [true, 'La cantidad es obligatoria'],
        min: 1,
    },

    fecha: {
        type: Date,
        default: Date.now,
    },

    usuarioId: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
    },

    notas: {
        type: String,
        trim: true,
    },
});

module.exports = model('Movimiento', MovimientoSchema);