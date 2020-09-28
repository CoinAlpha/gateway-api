# Hummingbot Gateway

## Express Middleware

NodeJS, Express middleware/REST API server that connects to protocol library. 

This can be used as a common API server to handle transactions that requires custom or third party libraries. 

## Development Requirements

- NodeJS 
  - Tested on Node v10.22.0
  - https://docs.npmjs.com/downloading-and-installing-node-js-and-npm

  ```bash
  # Using Homebrew MacOS:
  brew install node

  ```

- Yarn (for node package installations)
  - Tested on v1.22.5
  - To install yarn:
  ```bash
  npm install yarn

  ```

- ExpressJS - Install through package.json

[optional]
To switch to specific Node version, you can use `n` to handle the version installation and switch easily.

```bash
# install n
npm -g install n
# list remote available node version
n ls-remote
# list locally installed node version
n ls
# install specific version (e.g. 10, 12.18.3, 14.11.0)
n 10
# use specific version, then select installed version
n


## Setup

```bash

git clone <repo>
cd <repo>

# install npm packages
yarn install

# setup config
cp .env.example .env

# run dev mode with hot reload on code changes
yarn run dev

# Run prod mode
yarn run start

# API
http://localhost:5000/
http://localhost:5000/api/status

# Protocol Endpoints
http://localhost:5000/celo/status
http://localhost:5001/celo/price?trading_pair=UST-KRT&trade_type=sell&amount=1.123

http://localhost:5000/terra/status

http://localhost:5000/balancer/exchange_rates


