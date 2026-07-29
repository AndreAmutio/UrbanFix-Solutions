import 'dotenv/config';

const requiredEnv = [
  'DATABASE_URL',
  'JWT_SECRET',
];

if (process.env.NODE_ENV === 'production') {
  requiredEnv.push('FRONTEND_URL');
}

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`${key} no está configurado`);
  }
});

export const env = {
  port: process.env.PORT || 3001,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  jwtExpiration: '7d',
};
