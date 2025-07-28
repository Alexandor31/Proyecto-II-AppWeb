const { Ejemplar } = require('../models');

exports.crearEjemplar = async (req, res) => {
  try {
    const { codigo, libroId, fecha_adquisicion, observaciones } = req.body;

    const nuevoEjemplar = await Ejemplar.create({
      codigo,
      libroId,
      fecha_adquisicion,
      observaciones
    });

    res.status(201).json(nuevoEjemplar);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear ejemplar' });
  }
};
