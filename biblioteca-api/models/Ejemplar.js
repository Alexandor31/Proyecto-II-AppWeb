const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Ejemplar = sequelize.define('Ejemplar', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  codigo: { type: DataTypes.STRING, allowNull: false }, // código único por ejemplar
  libroId: { type: DataTypes.BIGINT, allowNull: false },
  fecha_adquisicion: DataTypes.DATE,
  observaciones: DataTypes.TEXT,
}, {
  tableName: 'ejemplares',
});

module.exports = Ejemplar;
