const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
//const session = require('express-session');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const { sequelize } = require('./models');
const routes = require('./routes');
// const { keycloak, memoryStore } = require('./config/keycloak');

const app = express();
const PORT = process.env.PORT || 3000;


// Middlewares generales
app.use(cors());
app.use(bodyParser.json());

// Rutas 
app.use('/api', routes);


// Swagger
const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: { title: 'API Biblioteca', version: '1.0.0' },
  },
  apis: ['./routes/*.js'],
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// DB
sequelize.authenticate()
  .then(() => {
    console.log('Conectado a PostgreSQL');

    return sequelize.sync({ alter: true }); // ✅ Esto sincroniza los modelos
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error en la BD:', err);
  });



app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
