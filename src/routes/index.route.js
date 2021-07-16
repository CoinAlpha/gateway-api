import {
  getParamData,
  statusMessages,
  loadConfig,
  updateConfig,
} from '../services/utils';

const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({
    config: loadConfig(),
    status: 'ok',
  });
});

router.post('/update', async (req, res) => {
  /*
    POST: /update-config
      x-www-form-urlencoded: {"key": "value",}
    note: param can be set individually
  */
  const paramData = getParamData(req.body);

  try {
    updateConfig(paramData);
    const config = loadConfig();
    res.status(200).json({
      config: config,
    });
  } catch (err) {
    let reason;
    err.reason
      ? (reason = err.reason)
      : (reason = statusMessages.operation_error);
    res.status(500).json({
      error: reason,
      message: err,
    });
  }
});

export default router;
