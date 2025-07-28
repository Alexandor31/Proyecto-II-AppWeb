const { Usuario, Prestamo, Multa } = require('../models');

exports.actualizarEstadoUsuario = async (usuarioId) => {
  try {
    const usuario = await Usuario.findByPk(usuarioId);
    if (!usuario) return;

    // Si tiene multa activa
    const multa = await Multa.findOne({ where: { usuarioId } });

    const hoy = new Date();
    const prestamos = await Prestamo.count({ where: { usuarioId } });

    // Si ya devolvió todos los libros y terminó la penalización
    if (usuario.estado === 'multado' && multa && prestamos === 0) {
      const fechaFinal = new Date(multa.fecha_finalizacion);
      if (hoy >= fechaFinal) {
        await multa.destroy();
        usuario.estado = 'activo';
        await usuario.save();
        console.log(`Usuario ${usuarioId} rehabilitado`);
      }
    }
  } catch (error) {
    console.error('Error actualizando estado del usuario:', error);
  }
};

exports.obtenerUsuarioConMulta = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

    const multa = await Multa.findOne({ where: { usuarioId: usuario.id } });

    res.json({
      id: usuario.id,
      nombre: usuario.nombre,
      estado: usuario.estado,
      tipo: usuario.tipo,
      multa: multa || null
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el usuario' });
  }
};

exports.obtenerTodosLosUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

exports.crearUsuario = async (req, res) => {
  try {
    const nuevoUsuario = await Usuario.create({
      ...req.body,
      estado: 'activo'
    });
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear usuario' });
  }
};
