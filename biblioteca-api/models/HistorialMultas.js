const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const HistorialMultas = sequelize.define('HistorialMultas', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  usuarioId: DataTypes.BIGINT,
  fecha_inicio: DataTypes.DATE,
  dias_acumulados: DataTypes.INTEGER,
  fecha_finalizacion: DataTypes.DATE,
}, {
  tableName: 'historial_multas',
});

module.exports = HistorialMultas;
