# Getting Started

* Instantiate and connect to a Cosmos wallet (Node.js or Keplr)
* Use that Cosmos wallet to connect to two chains (Sifchain and Akash)
* Bridge tokens from a Cosmos chain to Sifchain via IBC

## 0. Instantiate the SDK

```ts
import {
  NetworkEnv,
  createSdk
} from '@sifchain/sdk'

const sdk = createSdk({
  environment: NetworkEnv.TESTNET,
})
```

## 1. Create a wallet

#### Web

```ts
import {
  NetworkEnv,
  createSdk
} from '@sifchain/sdk'
import { KeplrWalletProvider } from '@sifchain/wallet-keplr'

const sdk = createSdk({
  environment: NetworkEnv.TESTNET,
})
const cosmosWallet = new KeplrWalletProvider(sdk.context)
```

#### Node.js

```ts
import {
  DirectSecp256k1HdWalletProvider,
  NetworkEnv
} from '@sifchain/sdk'
const sdk = createSdk({
  environment: NetworkEnv.TESTNET,
});
const cosmosWallet = new DirectSecp256k1HdWalletProvider(sdk.context, {
  mnemonic: process.env.COSMOS_MNEMONIC || "",
})
```

## 2. Connect to wallet

In this example, we'll get the user's AKT balance on Akash via a function `getAktBalance`.

```ts
async function getAktBalance () {
  const akashAddress = await cosmosWallet.connect(sdk.chains.akash);

  const balances = await cosmosWallet.fetchBalances(sdk.chains.akash, cosmosAddress)

  // Then, find the balance from the external Akash address.
  const aktBalance = akashBalances.find(assetAmount => assetAmount.symbol === 'uakt')

  return aktBalance
}
```

## 3. Initiate an IBC transfer

Once we've checked the users AKT balance via `getAktBalance`, transfer 1 AKT from Akash to Sifchain via the IBCBridge.

```ts
async function transferAkt () {
  const aktBalance = await getAktBalance()

  if (!aktBalance?.greaterThan('0')) {
    throw new Error('Not enough AKT balance!')
  }

  // An AssetAmount is a combination of an Asset and decimal-precise Amount
  const transferAmount = AssetAmount(
    'uakt',
     // Convert 1.0 to Akash's 6 decimals precision
    toBaseUnits('1.0', 'uakt')
  )

  const akashAddress = await cosmosWallet.connect(sdk.chains.akash);
  const sifchainAddress = await cosmosWallet.connect(sdk.chains.sifchain);

  // Send an ibc transfer from akash to sifchain
  const bridgeTx = await sdk.bridges.ibc.transfer(cosmosWallet, {
    fromChain: sdk.chains.akash,
    toChain: sdk.chains.sifchain,
    assetAmount: transferAmount,
    fromAddress: akashAddress,
    toAddress: sifchainAddress
  })

  // Then, wait for the transfer to complete.
  const didComplete = await sdk.bridges.ibc.waitForTransferComplete(
    cosmosWallet, 
    bridgeTx
  )

  console.log('Transfer complete!', bridgeTx, didComplete)
}

;(async function main () {
  await importOneAktFromAkash()
})()
```

And that was an IBC transfer with the SDK. Once it completes, there should be one `uakt` in the sifchain wallet.
