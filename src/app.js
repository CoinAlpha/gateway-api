import bodyParser from 'body-parser';
import express from 'express';
import helmet from 'helmet';
import { IpFilter } from 'express-ipfilter';
import { statusMessages } from './services/utils';
import { validateAccess } from './services/access';
import { logger } from './services/logger';

// Routes
import apiRoutes from './routes/index.route';
import balancerRoutes from './routes/balancer.route';
import ethRoutes from './routes/eth.route';
import terraRoutes from './routes/terra.route';
import uniswapRoutes from './routes/uniswap.route';
import uniswapV3Routes from './routes/uniswap_v3.route';
import perpFiRoutes from './routes/perpetual_finance.route';

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

app.use(validateAccess);

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
    message
  });
});

export default app;
