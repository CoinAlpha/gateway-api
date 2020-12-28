/*
  middleware for validating mutual authentication access
*/

import { logger } from './logger';
import { statusMessages } from './utils';

const debug = require('debug')('router')

export const validateAccess = (req, res, next) => {
  const cert = req.connection.getPeerCertificate()
  if (req.client.authorized) {
    debug('Access granted')
    next()
  } else if (cert.subject) {
    logger.error(statusMessages.ssl_cert_invalid)
    res.status(403).send({ error: statusMessages.ssl_cert_invalid })
  } else {
    logger.error(statusMessages.ssl_cert_required)
    res.status(401).send({ error: statusMessages.ssl_cert_required })
  }
}
