const { sequelize } = require('./models');

sequelize.sync({ force: true }) // usa `force: true` para limpiar todo y rehacer las tablas
  .then(() => {
    console.log("Base de datos sincronizada correctamente.");
    process.exit(0);
  })
  .catch(err => {
    console.error("Error sincronizando la base de datos:", err);
    process.exit(1);
  });
