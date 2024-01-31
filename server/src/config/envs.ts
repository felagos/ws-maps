import 'dotenv/config';

export const envs = {
  PORT: parseInt(process.env.PORT || '3000'),
  CORS: process.env.CORS,
} 