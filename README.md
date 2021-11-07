# Pecunia

## How to setup the gateway-api

A more detailed explanation of how to setup the **gateway-api**.
1. Unzip the ```/pecunia-resources/certs.zip``` and add the files to ```/certs/```
2. Add the ```/pecunia-resources/global_conf.yml``` to ```/conf/```
3. Run terminal command: ```yarn```  or ```npm install```
4. ```yarn build``` or ```npm run build```
5. Now you can run the program with: ```yarn start``` or ```npm run start```
6. Use a API test program such as Postman and sen POST request to:
https://localhost:5000/terra/
(*You have to disable SSL in Postman, as the prompt indicates when you send this request*)

If you encounter Typescript type errors, just add '```any```' to the type that is throwing the error. E.g:<br>
```wallet: Wallet,``` => ```wallet: any,```

## Notes
- The Sifchain SDK has been added in ```/sifchain/```

- Files ```/src/routes/sifchain.ts``` and ```/src/services/sifchain.ts``` have been added.

----
![Hummingbot](https://i.ibb.co/X5zNkKw/blacklogo-with-text.png)

----

Hummingbot Gateway is an open-source project that integrates cryptocurrency trading on both **centralized exchanges** and **decentralized protocols**. It allows users to run a client that executes customized, automated trading strategies for cryptocurrencies.

We created hummingbot to promote **decentralized market-making**: enabling members of the community to contribute to the liquidity and trading efficiency in cryptocurrency markets.

## Getting Started

### Run gateway-api

You can either use the hummingbot client to create a config file or you can 
create or edit one manually. Copy `conf/global_conf.yml.example` to 
`conf/global_conf.yml` then edit the file with your settings.

gateway-api is a TypeScript project and has a build phase. You can use `npm`
or `yarn` to download dependencies, build then run it.


```bash
yarn
yarn build
yarn start
```

### Learn more about Hummingbot

- [Website](https://hummingbot.io)
- [Documentation](https://docs.hummingbot.io)
- [FAQs](https://docs.hummingbot.io/faq/)

### Install Hummingbot

- [Quickstart guide](https://docs.hummingbot.io/quickstart/)
- [All installation options](https://docs.hummingbot.io/installation/overview/)

### Get support
- Chat with our support team on [Discord](https://discord.hummingbot.io)
- Email us at support@hummingbot.io

### Chat with other traders
- Join our community on [Discord](https://discord.coinalpha.com) or [Reddit](https://www.reddit.com/r/Hummingbot/)
- Follow Hummingbot on [Twitter](https://twitter.com/hummingbot_io)

## Contributions

We welcome contributions from the community:
- **Code and documentation contributions** via [pull requests](https://github.com/CoinAlpha/gateway-api/pulls)
- **Bug reports and feature requests** through [Github issues](https://github.com/CoinAlpha/gateway-api/issues)
- When contributing, please review the [contributing guidelines](CONTRIBUTING.md)

## About us

Hummingbot Gateway was created and is maintained by CoinAlpha, Inc. We are [a global team of engineers and traders](https://hummingbot.io/about/).

- **General**: contact us at [dev@hummingbot.io](mailto:dev@hummingbot.io) or join our [Discord server](https://discord.hummingbot.io).
- **Business inquiries**: contact us at [partnerships@hummingbot.io](mailto:partnerships@hummingbot.io).

## Legal

- **License**: Hummingbot is licensed under [Apache 2.0](./LICENSE).

## Development

This repo uses `eslint` and `prettier`. When you run `git commit` it will trigger the `pre-commit` hook.
This will run `eslint` on the `src` and `test` directories.

You can lint before committing with:

```bash
yarn run lint
```

You can run the prettifier before committing with:

```bash
yarn run prettier
```
