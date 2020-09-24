const express = require('express');
const httpStatus = require('http-status-codes');
const util = require('util');
const helmet = require('helmet');
const apiRoutes = require('../index.route');

// Protocol routes
const celoRoutes = require('../protocols/celo.route');
const ethRoutes = require('../protocols/eth.route');
const terraRoutes = require('../protocols/terra.route');
const balancerRoutes = require('../protocols/balancer.route');

const app = express();

// #security: remove response headers from middleware
// https://www.npmjs.com/package/helmet
app.use(helmet());

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

module.exports = app;
