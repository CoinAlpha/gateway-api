#!/usr/bin/env node

// absolute imports
import https from 'https';
import fs from 'fs';

// relative imports
import app from './app';
import { logger } from './services/logger';

const globalConfig =
  require('./services/configuration_manager').configManagerInstance.readAllConfigs();

const env = globalConfig.CORE.NODE_ENV;
const port = globalConfig.CORE.PORT;
const certPassphrase = globalConfig.CERT_PASSPHRASE;
const ethereumChain = globalConfig.ETHEREUM_CHAIN;
const terraChain = globalConfig.TERRA_CHAIN;
let certPath = globalConfig.CERT_PATH;

if ((typeof certPath === 'undefined' && certPath == null) || certPath === '') {
  // assuming it is local development using test script to generate certs
  certPath = './certs';
} else {
  certPath = certPath.replace(/\/$/, '');
}

// set app environment
app.set('env', env);
const options = {
  key: fs.readFileSync(certPath.concat('/server_key.pem'), {
    encoding: 'utf-8',
  }),
  cert: fs.readFileSync(certPath.concat('/server_cert.pem'), {
    encoding: 'utf-8',
  }),
  // request client certificate from user
  requestCert: true,
  // reject requests with no valid certificate
  rejectUnauthorized: true,
  // use ca cert created with own key for self-signed
  ca: [fs.readFileSync(certPath.concat('/ca_cert.pem'), { encoding: 'utf-8' })],
  passphrase: certPassphrase,
};

const server = https.createServer(options, app);

// event listener for "error" event
const onError = (error: Record<string, any>) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// event listener for "listening" event.
const onListening = () => {
  const addr = server.address();
  if (addr) {
    const bind =
      typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    logger.debug('listening on ' + bind);
  } else {
    logger.debug('server.address() failed, not listening');
  }
};

// listen on provided port, on all network interfaces.
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

const serverConfig = {
  app: 'gateway-api',
  port: port,
  ethereumChain: ethereumChain,
  terraChain: terraChain,
};

logger.info(JSON.stringify(serverConfig));
