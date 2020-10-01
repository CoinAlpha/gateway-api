const express = require('express');

const router = express.Router();

router.use((req, res, next) => {
  console.log('index route:', Date.now())
  next()
})

router.get('/status', (req, res) => {
  res.status(200).json({
    app: process.env.APPNAME,
    version: '0.0.1',
    status: 'ok',
  });
})

module.exports = router;
