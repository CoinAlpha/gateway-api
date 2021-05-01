/*
  middleware for validating mutual authentication access
*/
import { logger, debug } from './logger';
import { statusMessages } from '../utils';
import { Request, Response } from 'express';
import { TLSSocket } from 'tls';

export const validateAccess = (req: Request, res: Response, next: Function) => {
  const connection = req.socket as TLSSocket;
  const cert = connection.getPeerCertificate();
  if (connection.authorized) {
    const ip = req.headers['x-forwarded-for'] || connection.remoteAddress;
    const method = req.method;
    const url = req.url;
    const requestInfo = 'Request from IP: ' + ip + ' ' + method + ' ' + url;
    debug.info(requestInfo);
    next();
  } else if (cert.subject) {
    logger.error(statusMessages.ssl_cert_invalid);
    res.status(403).send({ error: statusMessages.ssl_cert_invalid });
  } else {
    logger.error(statusMessages.ssl_cert_required);
    res.status(401).send({ error: statusMessages.ssl_cert_required });
  }
};
