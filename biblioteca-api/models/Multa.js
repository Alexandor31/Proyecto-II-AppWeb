const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Multa = sequelize.define('Multa', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  usuarioId: { type: DataTypes.BIGINT, allowNull: false },
  fecha_inicio: DataTypes.DATE,
  dias_acumulados: DataTypes.INTEGER,
  fecha_finalizacion: DataTypes.DATE,
}, {
  tableName: 'multas',
});

module.exports = Multa;
