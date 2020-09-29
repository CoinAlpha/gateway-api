'use strict'

const express = require('express');
const bodyParser = require('body-parser')
const ipFilter = require('express-ipfilter').IpFilter
const httpStatus = require('http-status-codes');
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

// whitelist local ips
// ipv6 format for locahost
const ip_whitelist = ['::ffff:127.0.0.1', '::ffff:1', 'fe80::1', '::1']
// app.use(ipFilter(ip_whitelist, { mode: 'allow' }))
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

module.exports = app;
