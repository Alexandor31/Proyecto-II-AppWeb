const express = require('express');
const router = express.Router();

router.use('/libros', require('./libroRoutes'));
router.use('/usuarios', require('./usuarioRoutes'));
router.use('/prestamos', require('./prestamoRoutes'));
router.use('/ejemplares', require('./ejemplarRoutes'));


module.exports = router;
