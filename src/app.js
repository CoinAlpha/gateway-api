import bodyParser from 'body-parser'
import express from 'express'
import helmet from 'helmet'
import httpStatus from 'http-status-codes'

// Routes
import apiRoutes from './routes/index.route'
import balancerRoutes from './routes/balancer.route'
import celoRoutes from './routes/celo.route'
import ethRoutes from './routes/eth.route'
import terraRoutes from './routes/terra.route'

// create app
const app = express();

// middleware
// #security: remove response headers from middleware
// https://www.npmjs.com/package/helmet
app.use(helmet());

// whitelist local ips
// ipv6 format for locahost
// const ipWhitelist = ['::ffff:127.0.0.1', '::ffff:1', 'fe80::1', '::1']
// app.use(ipFilter(ipWhitelist, { mode: 'allow' }))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// mount all routes to this path
app.use('/api', apiRoutes);
app.use('/eth', ethRoutes);
app.use('/celo', celoRoutes);
app.use('/terra', terraRoutes);
app.use('/balancer', balancerRoutes);

app.get('/', (req, res) => {
  res.status(httpStatus.StatusCodes.OK)
    .send({
      status: httpStatus.ReasonPhrases.OK,
    });
});

/**
 * Catch all 404 response when routes are not found
 */
app.use((req, res, next) => {
  res
    .status(httpStatus.StatusCodes.NOT_FOUND)
    .send({
      error: httpStatus.getReasonPhrase(httpStatus.StatusCodes.NOT_FOUND),
    });
});

// strip stacktrace on error
app.use((err, req, res, next) => {
  // console.log('Error handler', err)
  res.status(err.status || 500)
  res.json({
    error: err.message,
  })
})

export default app;
