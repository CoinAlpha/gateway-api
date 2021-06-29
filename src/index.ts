import app from './app';
import https from './https';
import { logger } from './services/logger';

import { configManagerInstance } from './services/configuration_manager';
const globalConfig = configManagerInstance.readAllConfigs();

const useHTTPS = globalConfig.CORE.HTTPS;
const port = globalConfig.CORE.PORT;
const env = globalConfig.CORE.NODE_ENV;

// set app environment
app.set('env', env);

(useHTTPS ? https(app) : app)
  .listen(port, () => logger.info(`⚡️ Gateway API listening on port ${port}`))
  .on('error', (error: NodeJS.ErrnoException) => {
    if (error.syscall !== 'listen') {
      throw error;
    }

    if (!error.code || !['EACCES', 'EADDRINUSE'].includes(error.code)) {
      throw error;
    }

    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        logger.error(bind + ' requires elevated privileges');
        break;
      case 'EADDRINUSE':
        logger.error(bind + ' is already in use');
        break;
    }

    process.exit(1);
  });
