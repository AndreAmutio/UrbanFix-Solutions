import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'UrbanFix API',
      version: '1.0.0',
      description: 'API REST para gestión de servicios técnicos',
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:3001',
        description:
          process.env.NODE_ENV === 'production'
            ? 'Production server'
            : 'Local server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app) => {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
