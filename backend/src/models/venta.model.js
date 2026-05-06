const { Schema, model } = require('mongoose');

const DetalleVentaSchema = new Schema({

    productoId: {
        type: Schema.Types.ObjectId,
        ref: 'Producto',
        required: true,
    },

    nombreProducto: { 
        type: String,
        required: true,
    },

    cantidad: {
        type: Number, 
        required: true,
        min: 1, //si vas a comprar algo tienes que comprar al menos uno
    },

    precioUnitario: {
        type: Number,
        required: true,
        min: 0,
    },
});


const VentaSchema = new Schema({

    fecha: {
        type: Date,
        default: Date.now,
    },

    total: {
        type: Number,
        required: true,
        min: 0,
    },

    usuarioId: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required:true,
    },
    
    detalles: {
        type: [DetalleVentaSchema],
        validate: {
            validator: (arr) => arr.length > 0,
            message: 'La venta debe tener al menos un producto',
        },
    },
});

module.exports = model('Venta', VentaSchema);