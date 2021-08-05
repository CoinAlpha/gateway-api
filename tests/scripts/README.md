![Hummingbot](https://i.ibb.co/X5zNkKw/blacklogo-with-text.png)

----

The aim of Hummingbot Gateway Test scripts is to test endpoints related to supported decentralized protocols in an ideal order in each script.

## Requirements

- [Have gateway server properly configured and running](https://docs.hummingbot.io/gateway/installation/)
- Ensure you have the following line containing your private key in the gateway's `global_conf.yml` file:

```bash
PRIVATE_KEY: "********"
```

** Note that test scripts are expected to be run on thesame machine running the gateway server. **

## How to run test scripts

- Simply run  `node -r esm NAME_OF_SCRIPT` .i.e. to run `uniswap.v2.test.js`, run:

```bash
node -r esm uniswap.v2.test.js
```
