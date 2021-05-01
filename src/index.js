#!/usr/bin/env node

// absolute imports
import https from 'https'
import dotenv from 'dotenv'
import fs from 'fs'

// relative imports
import app from './app'
import { logger } from './services/logger'

// terminate if environment not found
const result = dotenv.config()
if (result.error) {
  logger.info(result.error)
  process.exit(1)
}

const env = process.env.NODE_ENV
const port = process.env.PORT
const certPassphrase = process.env.CERT_PASSPHRASE
const ethereumChain = process.env.ETHEREUM_CHAIN
const terraChain = process.env.TERRA_CHAIN
let certPath = process.env.CERT_PATH

if ((typeof certPath === 'undefined' && certPath == null) || certPath === '') {
  // assuming it is local development using test script to generate certs
  certPath = './certs'
} else {
  certPath = certPath.replace(/\/$/, '')
}

// set app environment
app.set('env', env)
const options = {
  key: fs.readFileSync(certPath.concat('/server_key.pem'), {
    encoding: 'utf-8'
  }),
  cert: fs.readFileSync(certPath.concat('/server_cert.pem'), {
    encoding: 'utf-8'
  }),
  // request client certificate from user
  requestCert: true,
  // reject requests with no valid certificate
  rejectUnauthorized: true,
  // use ca cert created with own key for self-signed
  ca: [fs.readFileSync(certPath.concat('/ca_cert.pem'), { encoding: 'utf-8' })],
  passphrase: certPassphrase
}

const server = https.createServer(options, app)

// event listener for "error" event
const onError = (error) => {
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
  console.log('listening on ' + bind)
  logger.debug('listening on ' + bind)
}

// listen on provided port, on all network interfaces.
server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

const serverConfig = {
  app: 'gateway-api',
  port: port,
  ethereumChain: ethereumChain,
  terraChain: terraChain
}

logger.info(JSON.stringify(serverConfig))
console.log(serverConfig)
