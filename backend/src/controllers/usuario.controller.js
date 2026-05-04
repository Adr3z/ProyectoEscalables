const Usuario = require('../models/usuario.model');
const bcrypt = require('bcryptjs');

//GET /api/usuarios
//Obtener todos los usuarios
const getUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find({ activo: true });
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener los usuarios', error
        });
    }
};


//GET /api/usuarios/:id
//Obtener un usuario
const getUsuarioById = async(req, res) => {
    try{
        const usuario = await Usuario.findById(req.params.id);

        if(!usuario) {
            return res.status(404).json({
                message: 'Usuario no encontrado'
            });
        }

        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener el usuario', error
        });
    }
};


//POST /api/usuarios
//Crear un usuario
const createUsuario = async (req, res) => {
    try {
        const { nombre, email, password, rol } = req.body;

        // Limpiar y validar el rol
        const rolLimpio = rol?.trim();
        console.log('Rol recibido:', rol, 'Rol limpio:', rolLimpio);

        if (!['Administrador', 'Empleado'].includes(rolLimpio)) {
            return res.status(400).json({
                message: `Rol inválido: ${rolLimpio}. Debe ser 'Administrador' o 'Empleado'`
            });
        }

        const emailExiste = await Usuario.findOne({ email });
        if(emailExiste){
            return res.status(400).json({
                message: 'El email ya está registrado'
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const usuario = new Usuario({ nombre, email, password: hashedPassword, rol: rolLimpio, passwordTemporal: true });
        await usuario.save();

        res.status(201).json(usuario);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el usuario', error });
    }
}


//PUT /api/usuarios/:id
//Editar usuario
const updateUsuario = async (req, res) => {
    try {
        const { nombre, email, rol } = req.body;

        const usuario = await Usuario.findByIdAndUpdate( 
            req.params.id,
            { nombre, email, rol },
            { returnDocument: 'after' }
        );

        if(!usuario){
            return res.status(404).json({ message: 'Usuario no encontrado '});
        }

        res.status(200).json(usuario);
    } catch (error) {
        if( error.code === 11000 ){
            return res.status(400).json({ message: 'El email ya está registrado'});
        }

        res.status(500).json({ message: 'Error al actualizar el usuario', error});
    }
};


//DELETE /api/usuarios/:id
//Soft delete
const deleteUsuario = async (req, res) =>{
    try {
        const usuario = await Usuario.findByIdAndUpdate(
            req.params.id,
            { activo: false },
            { returnDocument: 'after' }
        );

        if(!usuario){
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json( {message: 'Error al desactivar el usuario', error});
    } catch (error) {
        res.status(500).json({ message: 'Error al desactivar el usuario', error });
    }
};


module.exports = {
    getUsuarios, 
    getUsuarioById,
    createUsuario,
    updateUsuario,
    deleteUsuario,
};