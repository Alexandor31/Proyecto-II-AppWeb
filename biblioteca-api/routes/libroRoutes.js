const express = require('express');
const router = express.Router();
const libroController = require('../controllers/libroController');

/**
 * @swagger
 * /api/libros:
 *   get:
 *     summary: Obtiene todos los libros
 */
router.get('/', libroController.obtenerLibros);

/**
 * @swagger
 * /api/libros:
 *   post:
 *     summary: Crea un nuevo libro
 */
router.post('/', libroController.crearLibro);

module.exports = router;
