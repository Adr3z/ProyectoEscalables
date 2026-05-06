const { Router } = require('express');
const { verifyToken, allowRoles } = require('../middlewares/auth.middleware');

const {
    getUsuarios,
    getUsuarioById,
    createUsuario,
    updateUsuario,
    deleteUsuario,
} = require('../controllers/usuario.controller');

const router = Router();

router.get('/',      verifyToken, allowRoles('Administrador'), getUsuarios);
router.get('/:id',   verifyToken, allowRoles('Administrador'), getUsuarioById);
router.post('/',     verifyToken, allowRoles('Administrador'), createUsuario);
router.put('/:id',   verifyToken, allowRoles('Administrador'), updateUsuario);
router.delete('/:id', verifyToken, allowRoles('Administrador'), deleteUsuario);

module.exports = router;