const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Prestamo = sequelize.define('Prestamo', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  usuarioId: { type: DataTypes.BIGINT, allowNull: false },
  ejemplarId: { type: DataTypes.BIGINT, allowNull: false },
  fecha_prestamo: { type: DataTypes.DATE, allowNull: false },
  fecha_devolucion: { type: DataTypes.DATE, allowNull: false },
}, {
  tableName: 'prestamos',
});

module.exports = Prestamo;
