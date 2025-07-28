const sequelize = require('../config/database');

const Usuario = require('./Usuario');
const Libro = require('./Libro');
const Ejemplar = require('./Ejemplar');
const Prestamo = require('./Prestamo');
const Multa = require('./Multa');
const HistorialPrestamos = require('./HistorialPrestamos');
const HistorialMultas = require('./HistorialMultas');
const Recomendacion = require('./Recomendacion');


// Relaciones

Libro.hasMany(Ejemplar, { foreignKey: 'libroId' });
Ejemplar.belongsTo(Libro, { foreignKey: 'libroId' });

Usuario.hasMany(Prestamo, { foreignKey: 'usuarioId' });
Prestamo.belongsTo(Usuario, { foreignKey: 'usuarioId' });

Ejemplar.hasMany(Prestamo, { foreignKey: 'ejemplarId' });
Prestamo.belongsTo(Ejemplar, { foreignKey: 'ejemplarId' });

Usuario.hasMany(Multa, { foreignKey: 'usuarioId' });
Multa.belongsTo(Usuario, { foreignKey: 'usuarioId' });

Usuario.hasMany(HistorialPrestamos, { foreignKey: 'usuarioId' });
HistorialPrestamos.belongsTo(Usuario, { foreignKey: 'usuarioId' });

Ejemplar.hasMany(HistorialPrestamos, { foreignKey: 'ejemplarId' });
HistorialPrestamos.belongsTo(Ejemplar, { foreignKey: 'ejemplarId' });

Usuario.hasMany(HistorialMultas, { foreignKey: 'usuarioId' });
HistorialMultas.belongsTo(Usuario, { foreignKey: 'usuarioId' });


// Recomendaciones entre libros
Libro.hasMany(Recomendacion, { as: 'recomendacionesOrigen', foreignKey: 'libroOrigenId' });
Libro.hasMany(Recomendacion, { as: 'recomendacionesDestino', foreignKey: 'libroRecomendadoId' });

module.exports = {
  sequelize,
  Usuario,
  Libro,
  Ejemplar,
  Prestamo,
  Multa,
  HistorialPrestamos,
  HistorialMultas,
  Recomendacion
};

