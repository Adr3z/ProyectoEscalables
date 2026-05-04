const { Router } = require('express');
const { login, changePassword } = require('../controllers/auth.controller');
const { verifyToken } = require('../middlewares/auth.middleware'); // Assuming middleware exists

const router = Router();

router.post('/login', login);
router.put('/change-password', verifyToken, changePassword);

module.exports = router;