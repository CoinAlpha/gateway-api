"use strict";
// import { IBCService } from "../services/IBCService/IBCService";
// import fs from "fs";
// import path from "path";
// import { setupSifchainApi } from "../setupSifchainApi";
// import { NetworkEnv } from "../config/getEnv";
// import { Amount, Asset, AssetAmount, Network } from "../entities";
// import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
// import { OfflineAminoSigner } from "@cosmjs/amino";
// import { makeCosmoshubPath } from "@cosmjs/amino";
// import { stringToPath, slip10CurveFromString } from "@cosmjs/crypto";
// import { isBroadcastTxFailure } from "@cosmjs/launchpad";
// const [filename] = process.argv.slice(2);
// const content = fs.readFileSync(path.join(process.cwd(), filename)).toString();
// console.log({ content });
// const {
//   amountPerMessage = 9.2,
//   symbol = "cusdt",
//   messagesToSend = 10,
//   // defaults to max safe uint64
//   maxAmountPerMsg = `9223372036854775807`,
//   maxMsgsPerBatch = 800,
//   networkEnv = NetworkEnv.TESTNET_042_IBC,
//   sourceNetwork = Network.SIFCHAIN,
//   destinationNetwork = Network.COSMOSHUB,
//   mnemonic = `race draft rival universe maid cheese steel logic crowd fork comic easy truth drift tomorrow eye buddy head time cash swing swift midnight borrow`,
// } = JSON.parse(content);
// (async () => {
//   const api = setupSifchainApi(networkEnv);
//   await new Promise((r) => setTimeout(r, 4000));
//   console.log("waiting for wallets to load...");
//   console.log(JSON.parse(content));
//   let amount = Amount(amountPerMessage.toString());
//   console.log(amount);
//   amount = amount.multiply(messagesToSend.toString());
//   const outputs = await api.services.ibc.transferIBCTokens(
//     {
//       sourceNetwork,
//       destinationNetwork,
//       assetAmountToTransfer: AssetAmount(Asset(symbol), amount),
//     },
//     {
//       shouldBatchTransfers: true,
//       maxAmountPerMsg: maxAmountPerMsg,
//       maxMsgsPerBatch: maxMsgsPerBatch,
//     },
//   );
//   const prettyLog = (txt: any) => console.log(JSON.stringify(txt, null, 2));
//   console.log("waiting for txs to complete");
//   while (outputs.length) {
//     const output = outputs.pop();
//     if (!output) break;
//     try {
//       console.log("waiting 10 seconds");
//       await new Promise((r) => setTimeout(r, 10000));
//       if (isBroadcastTxFailure(output)) {
//         console.log("tx failed (start)");
//         prettyLog(output);
//         console.log("tx failed (end)");
//         continue;
//       }
//       console.log(output);
//       const transferComplete = await api.services.ibc.checkIfPacketReceivedByTx(
//         output.transactionHash,
//         sourceNetwork,
//       );
//       console.log(
//         `Status: ${output.transactionHash}: ${
//           transferComplete ? "Received ✅" : `Not Received 🚫`
//         }`,
//       );
//       if (transferComplete) continue;
//     } catch (e) {
//       console.error(e);
//     }
//     outputs.unshift(output);
//   }
//   console.log("batch tx run complete");
// })();
//# sourceMappingURL=batch-tx-load-testing.js.map