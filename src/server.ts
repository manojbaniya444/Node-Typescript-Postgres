import { app } from './app';
import { config } from './config/env.config';
import { logger } from './utils/logger';
import { connectDb } from './config/db.config';

const startServer = async () => {
  try {
    await connectDb();
    logger.info('Database connection successful.');

    app.listen(config.app.port, () => {
      logger.info(`Server running on port ${config.app.port}`);
    });
  } catch (error) {
    logger.error('Unable to start the server', error);
    process.exit(1);
  }
};

process.on('unhandledRejection', (err: Error) => {
  logger.error('Unhandled Rejection', err);
  process.exit(1);
});

startServer();
