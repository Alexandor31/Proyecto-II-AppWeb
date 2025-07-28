const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  tipo: { type: DataTypes.ENUM('alumno', 'profesor'), allowNull: false },
  login: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  nombre: DataTypes.STRING,
  apellidos: DataTypes.STRING,
  correo: DataTypes.STRING,
  calle: DataTypes.STRING,
  numero: DataTypes.STRING,
  piso: DataTypes.STRING,
  ciudad: DataTypes.STRING,
  codigo_postal: DataTypes.STRING,
  telefono_padres: DataTypes.STRING, // solo si alumno
  departamento: DataTypes.STRING, // solo si profesor
  estado: {
    type: DataTypes.ENUM('activo', 'moroso', 'multado'),
    defaultValue: 'activo',
  },
}, {
  tableName: 'usuarios',
});

module.exports = Usuario;
