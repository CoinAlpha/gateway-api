#!/usr/bin/env node

const dotenv = require('dotenv');

// terminate if environment not found
const result = dotenv.config();
if (result.error) {
  console.log(result.error);
  process.exit(1);
}

const env = process.env.NODE_ENV;
const port = process.env.PORT;
const local_apihost = ["http://localhost:",port].join("");

const app = require('./config/gateway');

app.listen(port, () => console.log(process.env.APPNAME));
console.log(local_apihost)

module.exports = app;

