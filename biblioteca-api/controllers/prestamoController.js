const { Prestamo, Usuario, Ejemplar, Multa, HistorialPrestamos } = require('../models');
const { actualizarEstadoUsuario } = require('./usuarioController');

exports.crearPrestamo = async (req, res) => {
  try {
    const { usuarioId, ejemplarId } = req.body;

    const usuario = await Usuario.findByPk(usuarioId);
    const ejemplar = await Ejemplar.findByPk(ejemplarId);

    if (!usuario || !ejemplar) {
      return res.status(404).json({ error: 'Usuario o ejemplar no encontrado' });
    }

    if (usuario.estado !== 'activo') {
      return res.status(403).json({ error: 'Usuario no autorizado a tomar préstamos' });
    }

    const prestamosActivos = await Prestamo.count({ where: { usuarioId } });

    const limite = usuario.tipo === 'profesor' ? 8 : 5;
    const diasPrestamo = usuario.tipo === 'profesor' ? 30 : 7;

    if (prestamosActivos >= limite) {
      return res.status(400).json({ error: `Supera el límite de préstamos (${limite})` });
    }

    const fechaPrestamo = new Date();
    const fechaDevolucion = new Date();
    fechaDevolucion.setDate(fechaPrestamo.getDate() + diasPrestamo);

    // Verificar si el ejemplar ya está prestado
    const yaPrestado = await Prestamo.findOne({ where: { ejemplarId } });
    if (yaPrestado) {
      return res.status(400).json({ error: 'Este ejemplar ya está prestado' });
    }


    const nuevoPrestamo = await Prestamo.create({
      usuarioId,
      ejemplarId,
      fecha_prestamo: fechaPrestamo,
      fecha_devolucion: fechaDevolucion,
    });

    res.status(201).json(nuevoPrestamo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear préstamo' });
  }
};

exports.obtenerPrestamosPorUsuario = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const prestamos = await Prestamo.findAll({ where: { usuarioId } });
    res.json(prestamos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener préstamos del usuario' });
  }
};

exports.devolverPrestamo = async (req, res) => {
  try {
    const { id } = req.params;
    const prestamo = await Prestamo.findByPk(id);
    if (!prestamo) {
      return res.status(404).json({ error: 'Préstamo no encontrado' });
    }

    const usuario = await Usuario.findByPk(prestamo.usuarioId);
    const hoy = new Date();
    const fechaDevolucion = new Date(prestamo.fecha_devolucion);

    // Guardar en historial antes de borrar
    await HistorialPrestamos.create({
    usuarioId: prestamo.usuarioId,
    ejemplarId: prestamo.ejemplarId,
    fecha_prestamo: prestamo.fecha_prestamo,
    fecha_devolucion: prestamo.fecha_devolucion,
    fecha_real_devolucion: hoy // ✅ muy importante
  });

    await prestamo.destroy();

    // Si hay retraso en la devolución, crear multa
    if (hoy > fechaDevolucion) {
      const diasRetraso = Math.ceil((hoy - fechaDevolucion) / (1000 * 60 * 60 * 24));
      const diasPenalizacion = diasRetraso * 2;

      const fechaFinal = new Date();
      fechaFinal.setDate(hoy.getDate() + diasPenalizacion);

      await Multa.create({
        usuarioId: usuario.id,
        fecha_inicio: hoy,
        dias_acumulados: diasPenalizacion,
        fecha_finalizacion: fechaFinal
      });

      usuario.estado = 'multado';
      await usuario.save();
    }

    await actualizarEstadoUsuario(usuario.id);

    res.json({ mensaje: 'Libro devuelto con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al devolver préstamo' });
  }
};

exports.historialPrestamosPorUsuario = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const historial = await HistorialPrestamos.findAll({ where: { usuarioId } });
    res.json(historial);
  } catch (error) {
    console.error('Error al obtener historial de préstamos:', error);
    res.status(500).json({ error: 'Error al obtener historial de préstamos' });
  }
};

exports.obtenerTodosLosPrestamos = async (req, res) => {
  try {
    const prestamos = await Prestamo.findAll();
    res.json(prestamos);
  } catch (error) {
    console.error('Error al obtener todos los préstamos:', error);
    res.status(500).json({ error: 'Error al obtener préstamos' });
  }
};
