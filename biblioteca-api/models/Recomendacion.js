const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Recomendacion = sequelize.define('Recomendacion', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  libroOrigenId: { type: DataTypes.BIGINT, allowNull: false },
  libroRecomendadoId: { type: DataTypes.BIGINT, allowNull: false },
  comentario: DataTypes.TEXT,
}, {
  tableName: 'recomendaciones',
});

module.exports = Recomendacion;
