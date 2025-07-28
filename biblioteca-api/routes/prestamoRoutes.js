const express = require('express');
const router = express.Router();
const prestamoController = require('../controllers/prestamoController');

// Crear un préstamo
router.post('/', prestamoController.crearPrestamo);

// Obtener préstamos por usuario
router.get('/usuario/:usuarioId', prestamoController.obtenerPrestamosPorUsuario);

// Devolver préstamo
router.delete('/:id', prestamoController.devolverPrestamo);

// Obtener historial de préstamos por usuario
router.get('/historial/:usuarioId', prestamoController.historialPrestamosPorUsuario);

router.get('/', prestamoController.obtenerTodosLosPrestamos);


module.exports = router;

