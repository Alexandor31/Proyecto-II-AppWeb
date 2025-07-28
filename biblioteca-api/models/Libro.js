const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Libro = sequelize.define('Libro', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  isbn: { type: DataTypes.STRING, allowNull: false, unique: true },
  titulo: DataTypes.STRING,
  autor: DataTypes.STRING,
  num_paginas: DataTypes.INTEGER,
  num_ejemplares: DataTypes.INTEGER,
  ejemplares_disponibles: DataTypes.INTEGER,
  portada_uri: DataTypes.STRING,
}, {
  tableName: 'libros',
});

module.exports = Libro;
