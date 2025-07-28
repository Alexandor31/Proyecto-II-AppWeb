const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const HistorialPrestamos = sequelize.define('HistorialPrestamos', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  usuarioId: DataTypes.BIGINT,
  ejemplarId: DataTypes.BIGINT,
  fecha_prestamo: DataTypes.DATE,
  fecha_devolucion: DataTypes.DATE,
  fecha_real_devolucion: DataTypes.DATE // ✅ necesario
}, {
  tableName: 'historial_prestamos',
});

module.exports = HistorialPrestamos;
