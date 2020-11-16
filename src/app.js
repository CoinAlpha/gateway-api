import dotenv from 'dotenv';
import bodyParser from 'body-parser'
import express from 'express'
import helmet from 'helmet'
import { statusMessages } from './services/utils';
import { IpFilter } from 'express-ipfilter'

// Routes
import apiRoutes from './routes/index.route'
import balancerRoutes from './routes/balancer.route'
// import celoRoutes from './routes/celo.route'
import ethRoutes from './routes/eth.route'
import terraRoutes from './routes/terra.route'
import uniswapRoutes from './routes/uniswap.route'

// terminate if environment not found
const result = dotenv.config();
if (result.error) {
  console.log(result.error);
  process.exit(1);
}

// create app
const app = express();

// middleware
// #security: remove response headers from middleware
// https://www.npmjs.com/package/helmet
app.use(helmet());

const ipWhitelist = process.env.IP_WHITELIST;
if (ipWhitelist) {
  app.use(IpFilter(JSON.parse(ipWhitelist), { mode: 'allow' }))
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// mount all routes to this path
app.use('/api', apiRoutes);
app.use('/eth', ethRoutes);
// app.use('/celo', celoRoutes);
app.use('/terra', terraRoutes);
app.use('/balancer', balancerRoutes);
app.use('/uniswap', uniswapRoutes);

app.get('/', (req, res, next) => {
  const cert = req.connection.getPeerCertificate()
  if (req.client.authorized) {
    next()
  } else if (cert.subject) {
    res.status(403).send({ error: statusMessages.ssl_cert_invalid })
  } else {
    res.status(401).send({ error: statusMessages.ssl_cert_required })
  }
})

/**
 * Catch all 404 response when routes are not found
 */
app.use((req, res, next) => {
  res.status(404).send({
    error: 'Page not found',
  });
});

// // strip stacktrace on error
// app.use((err, req, res, next) => {
//   // console.log('Error handler', err)
//   res.status(err.status || 500)
//   res.json({
//     error: err.message,
//   })
// })

export default app;
