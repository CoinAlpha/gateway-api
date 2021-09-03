![Hummingbot](https://i.ibb.co/X5zNkKw/blacklogo-with-text.png)

Test scripts for endpoints used by different connectors in Hummingbot Gateway

## Requirements

- [Run the Gateway server](https://docs.hummingbot.io/gateway/installation/)

```bash
yarn start
```

- Expose your Ethereum wallet private key as environment variable `PRIVATE_KEY`

```bash
export PRIVATE_KEY = [your private key]
```

## How to run

From the root Hummingbot directory, run  `node -r esm PATH_TO_SCRIPT` .i.e. to run `uniswap.v2.test.js`, run:

```bash
node -r esm ./tests/scripts/uniswap.v2.test.js
```
