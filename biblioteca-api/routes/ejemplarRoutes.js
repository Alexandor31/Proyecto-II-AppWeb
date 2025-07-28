const express = require('express');
const router = express.Router();
const ejemplarController = require('../controllers/ejemplarController');

router.post('/', ejemplarController.crearEjemplar);

module.exports = router;
