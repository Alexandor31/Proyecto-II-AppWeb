const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

router.get('/:id', usuarioController.obtenerUsuarioConMulta);
router.get('/', usuarioController.obtenerTodosLosUsuarios);
router.post('/', usuarioController.crearUsuario);



module.exports = router;
