import bodyParser from 'body-parser';
import express from 'express';
import helmet from 'helmet';
import { statusMessages } from './services/utils';
import { validateAccess } from './services/access';
import { IpFilter } from 'express-ipfilter';
import { logger } from './services/logger';

const winston = require('winston');
const expressWinston = require('express-winston');

// routes
import apiRoutes from './routes/index.route';
import balancerRoutes from './routes/balancer.route';
import ethRoutes from './routes/ethereum';
import perpFiRoutes from './routes/perpetual_finance.route';
import terraRoutes from './routes/terra';
import uniswapRoutes from './routes/uniswap';
import uniswapV3Routes from './routes/uniswap_v3';

// load configs
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

// set up logging for all API queries
app.use(
  expressWinston.logger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json()
    ),
    meta: true,
    msg: 'HTTP {{req.method}} {{req.url}}',
    expressFormat: true,
    colorize: false,
    ignoreRoute: function (_req: any, _res: any) {
      return false;
    },
  })
);

// mount routes to specific path
app.use('/api', apiRoutes);
app.use('/eth', ethRoutes);
app.use('/eth/uniswap', uniswapRoutes);
app.use('/eth/uniswap/v3', uniswapV3Routes);
app.use('/eth/balancer', balancerRoutes);
app.use('/terra', terraRoutes);
app.use('/perpfi', perpFiRoutes);

// a simple, pingable route
app.get('/', (_req, res) => {
  res.send('ok');
});

// Catch all 404 response when routes are not found
app.use((req, res, _next) => {
  const message = `${statusMessages.page_not_found} at ${req.originalUrl}`;
  logger.error(message);
  res.status(404).send({
    error: 'Page not found',
    message: message,
  });
});

export default app;
