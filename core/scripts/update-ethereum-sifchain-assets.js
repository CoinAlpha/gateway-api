"use strict";
// import { Network, NetworkEnv } from "..";
// import { getConfig } from "../config/getConfig";
// import { setupSifchainApi } from "../setupSifchainApi";
// import Web3 from "web3";
// import ethAssetsRaw from "../config/networks/ethereum/assets.ethereum.sifchain-devnet.json";
// import { IAsset } from "entities";
// const sifchain = setupSifchainApi(NetworkEnv.DEVNET);
// (async () => {
//   const tokensAddresses = await sifchain.services.ethbridge.fetchAllTokenAddresses(
//     () =>
//       new Web3(
//         new Web3.providers.HttpProvider(
//           "https://ropsten.infura.io/v3/f2e434009a9c4db8bfbd1b03ef572170",
//         ),
//       ),
//   );
//   const ethAssets = ethAssetsRaw.assets
//     .filter((a) => {
//       return a.homeNetwork === Network.ETHEREUM;
//     })
//     .map((a) => {
//       return {
//         ...a,
//         address:
//           tokensAddresses?.[
//             sifchain.config.assets.find(
//               (a2: IAsset) =>
//                 a2.homeNetwork === Network.SIFCHAIN &&
//                 a2.symbol.toLowerCase().includes(a.symbol.toLowerCase()),
//             )?.symbol || ""
//           ],
//       };
//     });
//   // fs.writeFileSync(
//   //   "./updated-eth-assets.json",
//   //   JSON.stringify(
//   //     {
//   //       assets: ethAssets,
//   //     },
//   //     null,
//   //     2,
//   //   ),
//   // );
// })();
//# sourceMappingURL=update-ethereum-sifchain-assets.js.map