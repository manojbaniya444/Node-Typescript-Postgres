import dotenv from 'dotenv';
import path from 'node:path';

export enum Environment {
  DEV = 'DEVELOPMENT',
  PROD = 'PRODUCTION',
  TEST = 'TEST',
}

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const config = {
  app: {
    port: process.env.PORT || 8080,
    env: process.env.NODE_ENV || 'DEVELOPMENT',
    tempFolder: process.env.TEMP_FOLDER_PATH,
  },
  db: {
    host: process.env.DB_HOST || 'localhost',
    type: process.env.DB_TYPE || 'postgres',
    port: process.env.DB_PORT || '5432',
    name: process.env.DB_NAME,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    logFilename: process.env.LOG_FILe || 'app.log',
  },
  url: {
    frontend: process.env.FRONTEND_URL,
    base: process.env.BASE_URL,
  },
};

export { config };
