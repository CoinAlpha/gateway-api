const express = require('express');

const app = express();

const router = express.Router();

router.use((req, res, next) => {
  console.log('index route:', Date.now())
  next()
})

router.get('/status', (req, res) => {
  res.status(200).send('OK')
})

module.exports = router;
