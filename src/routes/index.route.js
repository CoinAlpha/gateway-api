import { statusMessages } from '../services/utils';

const express = require('express');

const router = express.Router();

router.use((req, res, next) => {
  const cert = req.connection.getPeerCertificate()
  if (req.client.authorized) {
    next()
  } else if (cert.subject) {
    res.status(403).send({ error: statusMessages.ssl_cert_invalid })
  } else {
    res.status(401).send({ error: statusMessages.ssl_cert_required })
  }
})

router.get('/', (req, res) => {
  res.status(200).json({
    app: process.env.APPNAME,
    status: 'ok',
  });
})

module.exports = router;
