/*
  middleware for validating mutual authentication access
*/

import { logger } from './logger';
import { statusMessages } from './utils';

export const validateAccess = (req, res, next) => {
  const cert = req.connection.getPeerCertificate();
  if (req.client.authorized) {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const method = req.method;
    const url = req.url;
    const requestInfo = 'Request from IP: ' + ip + ' ' + method + ' ' + url;
    logger.info(requestInfo);
    next();
  } else if (cert.subject) {
    logger.error(statusMessages.ssl_cert_invalid);
    res.status(403).send({ error: statusMessages.ssl_cert_invalid });
  } else {
    logger.error(statusMessages.ssl_cert_required);
    res.status(401).send({ error: statusMessages.ssl_cert_required });
  }
};
