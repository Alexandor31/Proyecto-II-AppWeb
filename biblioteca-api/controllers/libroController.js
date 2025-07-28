const { Libro, Ejemplar } = require('../models');

exports.obtenerLibros = async (req, res) => {
  try {
    const libros = await Libro.findAll();
    res.json(libros);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener libros' });
  }
};

exports.crearLibro = async (req, res) => {
  try {
    const { isbn, titulo, autor, num_paginas, num_ejemplares, portada_uri } = req.body;

    // Crear el libro
    const libro = await Libro.create({
      isbn,
      titulo,
      autor,
      num_paginas,
      num_ejemplares,
      ejemplares_disponibles: num_ejemplares,
      portada_uri
    });

    // Crear los ejemplares automáticamente
    const ejemplares = [];
    for (let i = 1; i <= num_ejemplares; i++) {
      ejemplares.push({
        codigo: `EJ-${libro.id}-${i}`,
        libroId: libro.id,
        fecha_adquisicion: new Date(),
        observaciones: 'Agregado automáticamente'
      });
    }

    await Ejemplar.bulkCreate(ejemplares);

    res.status(201).json(libro);
  } catch (error) {
    console.error('Error al crear libro y ejemplares:', error);
    res.status(500).json({ error: 'Error al agregar libro y ejemplares' });
  }
};
