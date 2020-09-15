# Hummingbot Gateway

## Express Middleware

NodeJS, Express middleware/REST API server that connects to protocol library. 

This can be used as a common API server to handle transactions that requires custom or third party libraries. 


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
http://localhost:5000/status

# Protocol Endpoints
http://localhost:5000/celo/status
http://localhost:5000/celo/exchange_rates

http://localhost:5000/terra/status
http://localhost:5000/terra/exchange_rates

# 
```

