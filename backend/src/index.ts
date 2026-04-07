import { app } from './app';
import { config } from './config/env';
import { logger } from './config/logger';
import { runMigrations } from './db/migrate';
import { pool } from './db/client';

let server: ReturnType<typeof app.listen> | null = null;

async function bootstrap() {
  await runMigrations();

  server = app.listen(config.port, () => {
    logger.info(`Fincoin API running on port ${config.port} [${config.nodeEnv}]`);
  });

  process.on('SIGTERM', () => {
    logger.info('SIGTERM received. Closing server...');
    if (!server) {
      void pool.end().finally(() => process.exit(0));
      return;
    }
    server.close(async () => {
      await pool.end();
      logger.info('Server closed');
      process.exit(0);
    });
  });
}

void bootstrap();

export default server;
