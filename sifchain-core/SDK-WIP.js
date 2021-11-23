// @ts-nocheck
// A playground to test out how different SDK Formats might work
/* 
  Example SDK's:
    * https://developers.coinbase.com/api/v2?javascript#show-authorization-information
    * https://github.com/binance-chain/javascript-sdk/blob/master/docs/README.md#creating-a-client
    * 

*/

const sif = new SifDexClient();

const sifchainClient = new SifchainClient({
  network: "testnet",
  rpc: "http://localhost:8545",
});

const dex = new Sifchain.DEX({
  network: "testnet",
  rpc: "http://localhost:8545",
});

const sdk = new SifchainSDK({
  network: "testnet",
  rpc: "http://localhost:8545",
});

const sifchain = new Sifchain({
  network: "testnet",
  rpc: "http://localhost:8545",
});

const sifchain = Sifchain.createClient({
  network: "testnet",
  rpc: "http://localhost:8545",
});

const sifchain = Sifchain.create({
  network: "testnet",
  rpc: "http://localhost:8545",
});

const sifchain = Sifchain.createClient({
  network: "testnet",
  rpc: "http://localhost:8545",
});

import { Client } from "@sifchain/sdk";

const sifchain = new Client({
  network: "testnet",
  rpc: "http://localhost:8545",
});

import Sifchain, { EthereumProvider } from "@sifchain/sdk";

const sifchain = new Sifchain.Client({
  environment: "testnet",
  rpc: "http://localhost:8545",
});

import { Sif } from "@sifchain/sdk";

const sifchain = new Sif.Chain({
  environment: "testnet",
  rpc: "http://localhost:8545",
});

import { NativeDexClient } from "@sifchain/sdk";

const client = await NativeDexClient.connect();
