#!/usr/bin/env node

'use strict'

const http = require('http')
const debug = require('debug')
const dotenv = require('dotenv');

// terminate if environment not found
const result = dotenv.config();
if (result.error) {
  console.log(result.error);
  process.exit(1);
}

const env = process.env.NODE_ENV;
const port = process.env.PORT;

const app = require('./config/gateway');

// set app environment
app.set('env', env)

const server = http.createServer(app)

 // event listener for "error" event
const onError = error => {
  if (error.syscall !== 'listen') {
    throw error
  }

  let bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}

// event listener for "listening" event.
const onListening = () => {
  let addr = server.address()
  let bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
  // console.error('bind', bind)
  debug('listening on ' + bind)
}

// listen on provided port, on all network interfaces.
server.listen(port)
server.on('error', onError)
server.on('listening', onListening)


