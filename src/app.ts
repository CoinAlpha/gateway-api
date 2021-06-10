import bodyParser from 'body-parser';
import express from 'express';
import helmet from 'helmet';
import { statusMessages } from './services/utils';
import { IpFilter } from 'express-ipfilter';
import { logger } from './services/logger';
const access = require('./services/access');

// Routes
const apiRoutes = require('./routes/index.route');
const balancerRoutes = require('./routes/balancer.route');
const ethRoutes = require('./routes/eth.route');
const terraRoutes = require('./routes/terra.route');
const uniswapRoutes = require('./routes/uniswap.route');
const uniswapV3Routes = require('./routes/uniswap_v3.route');
const perpFiRoutes = require('./routes/perpetual_finance.route');

//load configs
const globalConfig =
  require('./services/configuration_manager').configManagerInstance;

// create app
const app = express();

// middleware
// #security: remove response headers from middleware
// https://www.npmjs.com/package/helmet
app.use(helmet());

const ipWhitelist = globalConfig.getCoreConfig('IP_WHITELIST');
if (ipWhitelist) {
  app.use(IpFilter(JSON.parse(ipWhitelist), { mode: 'allow' }));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(access.validateAccess);

// mount routes to specific path
app.use('/api', apiRoutes);
app.use('/eth', ethRoutes);
app.use('/eth/uniswap', uniswapRoutes);
app.use('/eth/uniswap/v3', uniswapV3Routes);
app.use('/eth/balancer', balancerRoutes);
app.use('/terra', terraRoutes);
app.use('/perpfi', perpFiRoutes);
// app.use('/celo', celoRoutes);

app.get('/', (req, res, _next) => {
  res.send('ok');
});

/**
 * Catch all 404 response when routes are not found
 */
app.use((req, res, _next) => {
  const message = `${statusMessages.page_not_found} at ${req.originalUrl}`;
  logger.error(message);
  res.status(404).send({
    error: 'Page not found',
    message: message
  });
});

export default app;
