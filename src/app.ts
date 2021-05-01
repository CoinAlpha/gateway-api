import express from 'express';
import helmet from 'helmet';
import { statusMessages } from './utils';
import { validateAccess } from './services/access';
import { IpFilter } from 'express-ipfilter';
import { logger } from './services/logger';

// Routes
import apiRoutes from './routes/index.route';
import balancerRoutes from './routes/balancer.route';
// import celoRoutes from './routes/celo.route'
import ethRoutes from './routes/eth.route';
import terraRoutes from './routes/terra.route';
import uniswapRoutes from './routes/uniswap.route';
import perpFiRoutes from './routes/perpetual_finance.route';

// create app
const app = express();

// middleware
// #security: remove response headers from middleware
// https://www.npmjs.com/package/helmet
app.use(helmet());

const ipWhitelist = process.env.IP_WHITELIST;
if (ipWhitelist) {
  app.use(IpFilter(JSON.parse(ipWhitelist), { mode: 'allow' }));
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(validateAccess);

// mount routes to specific path
app.use('/api', apiRoutes);
app.use('/eth', ethRoutes);
app.use('/eth/uniswap', uniswapRoutes);
app.use('/eth/balancer', balancerRoutes);
app.use('/terra', terraRoutes);
app.use('/perpfi', perpFiRoutes);
// app.use('/celo', celoRoutes);

app.get('/', (req, res, next) => {
  res.send('ok');
});

/**
 * Catch all 404 response when routes are not found
 */
app.use((req, res, next) => {
  const message = `${statusMessages.page_not_found} at ${req.originalUrl}`;
  logger.error(message);
  res.status(404).send({
    error: 'Page not found',
    message: message,
  });
});

export default app;
