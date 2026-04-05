import { app } from './app';
import { config } from './config/env';
import { logger } from './config/logger';

const server = app.listen(config.port, () => {
  logger.info(`Fincoin API running on port ${config.port} [${config.nodeEnv}]`);
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Closing server...');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

export default server;
