// absolute imports
import https from 'https';
import fs from 'fs';
import debug from 'debug';
import dotenv from 'dotenv';

// relative imports
import app from './app'

// terminate if environment not found
const result = dotenv.config();
if (result.error) {
  console.log(result.error);
  process.exit(1);
}

const env = process.env.NODE_ENV;
const port = process.env.PORT;
const passphrase = process.env.CERT_PASSPHRASE

// set app environment
app.set('env', env)

// set rejectUnauthorized to 'false' for self-signed CA cert
const options = {
  key: fs.readFileSync('./certs/server-private-key.pem', { encoding: 'utf-8' }),
  cert: fs.readFileSync('./certs/server-public-key.pem', { encoding: 'utf-8' }),
  // passphrase: passphrase,
  requestCert: true,
  rejectUnauthorized: false
};

const server = https.createServer(options, app)

// event listener for "error" event
const onError = error => {
  if (error.syscall !== 'listen') {
    throw error
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
    default:
      throw error
  }
}

// event listener for "listening" event.
const onListening = () => {
  const addr = server.address()
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
  // console.error('bind', bind)
  debug('listening on ' + bind)
}

// listen on provided port, on all network interfaces.
server.listen(port)
server.on('error', onError)
server.on('listening', onListening)
