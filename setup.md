# Hummingbot Gateway

## Express Middleware

NodeJS, Express middleware/REST API server that connects to protocol library. 

This can be used as a common API server to handle transactions that requires custom or third party libraries. 

## Development Requirements

- NodeJS 
  - Tested on Node v10.22.1
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

# run debug mode with additional route debug logging
yarn run debug

# Run prod mode
yarn run start

# API
https://localhost:5000/api

# Protocol Endpoints
All endpoint require POST request with data

# ETHEREUM

# get ETH and ERC-20 tokens balances in the user's wallet
https://localhost:5000/eth/balances

# get ERC-20 allowances for a contract address
https://localhost:5000/eth/allowances

# approve a contract to allow transferring tokens to it
https://localhost:5000/eth/approve

# send testnet ETH to WETH contract to get testnet WETH
https://localhost:5000/eth/deposit


# BALANCER

# execute trade
https://localhost:5000/balancer/buy
https://localhost:5000/balancer/sell


```

### SSL Test

SSL is setup for HTTPS traffic to Gateway running at localhost. To run Gateway as standalone API server, use the following test script to generate the SSL certs.

```bash
$ ssl-scripts.sh

# Test endpoint
curl --insecure --key ./certs/client_key.pem --cert ./certs/client_cert.pem https://localhost:5000/api

```

Test endpoint on Python
```python

# update the locaiton path of the pem files

def test_get_api_status(self):
    url = 'https://localhost:5000/api'

    ca_certs = realpath(join(__file__, join("../../certs/ca_cert.pem")))
    client_certs = (realpath(join(__file__, join("../../certs/client_cert.pem"))),
                realpath(join(__file__, join("../../certs/client_key.pem"))))
    response = requests.get(url, verify=ca_certs, cert=client_certs)

    result = response.json()
    print('result', result)

    self.assertTrue('status' in result.keys() and result['status'] == 'ok', f"Gateway API {url} not ready")

```
