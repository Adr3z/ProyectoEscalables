const { Schema, model } = require('mongoose');

const UsuarioSchema = new Schema({
    nombre:{
        type: String,
        required: [true, 'El nombre es obligatorio'],
        trim: true,
    },

    email: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true,
        lowercase: true,
        trim: true,
    },

    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
    },

    passwordTemporal: {
        type: Boolean,
        default: false
    },

    rol: {
        type: String,
        enum: ['Administrador', 'Empleado'],
        default: 'Empleado',
        message: 'El rol debe ser Administrador o Empleado'
    },

    activo: {
        type: Boolean,
        default: true,
    },

    fechaCreacion: {
        type: Date,
        default: Date.now,
    },
});


module.exports = model('Usuario', UsuarioSchema);