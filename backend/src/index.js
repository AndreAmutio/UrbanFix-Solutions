import express from 'express';
import cors from 'cors';

import { corsConfig } from './config/cors.js';
import { env } from './config/env.js';
import { errorHandler } from './middleware/error.middleware.js';
import { setupSwagger } from './config/swagger.js';
import routes from './routes/index.js';

const app = express();

app.use(cors(corsConfig));
app.use(express.json());

setupSwagger(app);

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date(),
  });
});

app.use('/api', routes);

app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Servidor ejecutándose en el puerto ${env.port}`);
});