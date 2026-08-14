import { env } from './env.js';

const allowedOrigins = env.frontendUrl.split(',').map((url) => url.trim());

export const corsConfig = {
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
