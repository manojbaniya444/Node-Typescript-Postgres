import { logger } from '../utils/logger';
import { config } from './env.config';
import pg from 'pg';

const pool = new pg.Pool({
  host: config.db.host,
  user: config.db.user,
  database: config.db.name,
  password: config.db.password,
  port: Number(config.db.port),
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  max: 10,
});

const handleErrorLog = (errorMessage: string, error: any) => {
  if (error instanceof Error) {
    logger.error(
      errorMessage,
      { error: error.message, stack: error.stack },
      error
    );
    console.log(error);
  } else {
    logger.error(errorMessage, { error: 'Unknown error occur' });
  }
};

export const connectDb = async () => {
  try {
    await pool.connect();
  } catch (error) {
    handleErrorLog('Error on connecting database', error);
    process.exit(1);
  }
};

export const disconnectDb = async () => {
  try {
    await pool.end();
    logger.info('Database disconnect done');
  } catch (error) {
    handleErrorLog('Error on disconneting database', error);
  }
};

export const queryDb = async (query: string, values: any[] = []) => {
  try {
    const response = await pool.query(query, values);
    return response
  } catch (error) {
    handleErrorLog('Error querying database', error);
    throw error;
  }
};
