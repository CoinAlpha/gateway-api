import {DirectSecp256k1HdWallet} from "@cosmjs/proto-signing";
import {SigningStargateClient, coins} from "@cosmjs/stargate";
import fetch from "cross-fetch";
import {MsgSend} from "@cosmjs/stargate/build/codec/cosmos/bank/v1beta1/tx";
import {AKASH_TESTNET} from "../../../config/chains/akash/akash-testnet";

// This contains TEST tokens only, please be nice and don't take them all.
const COUNTERPARTY_TEST_MNEMONIC = process.env.COUNTERPARTY_TEST_MNEMONIC!;

// export const runAkashFaucet = async (toAddress: string) => {
//   const signer = await DirectSecp256k1HdWallet.fromMnemonic(
//     COUNTERPARTY_TEST_MNEMONIC,
//     undefined,
//     "akash",
//   );

//   const faucetAddr = (await signer.getAccounts())[0].address;

//   const client = await SigningStargateClient.connectWithSigner(
//     AKASH_TESTNET.rpcUrl,
//     signer,
//     {
//       prefix: "akash",
//     },
//   );

//   const msg = {
//     typeUrl: "/cosmos.bank.v1beta1.MsgSend",
//     value: {
//       amount: [
//         {
//           denom: "uakt",
//           amount: "100000", // 0.1 uakt
//         },
//       ],
//       fromAddress: faucetAddr,
//       toAddress: toAddress,
//     },
//   };
//   const fee = {
//     amount: coins(200000, "uakt"),
//     gas: "500000", // TODO - see if "auto" setting
//   };

//   const res = await client.signAndBroadcast(faucetAddr, [msg], fee);
//   console.log("res", res);
// };

export const runRowanFaucet = async (sifAddress: string) => {
  const useLocalFaucet = false;
  const faucetGql = async (body: {query: string; variables: object}) => {
    const res = await fetch(
      `${
        useLocalFaucet
          ? "http://localhost:3000"
          : "https://rowan-faucet.vercel.app"
      }/api/graphql`,
      {
        method: "POST",
        headers: {
          origin: "unit-tests.sifchain.finance",
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(body),
      },
    );
    if (!res.ok) throw new Error("Error with faucet " + (await res.text()));
    const json = await res.json();

    if (json.data == null) throw new Error(JSON.stringify(json.errors));

    return json.data;
  };

  const signatureJson = await faucetGql({
    query: `mutation createAccountBalanceProof(
          $address: String!
          $networkEnv: NetworkEnv
        ) {
          createAccountBalanceProof(
            address: $address
            networkEnv: $networkEnv
          ) {
            signature
            contentRaw
          }
        }`,
    variables: {address: sifAddress, networkEnv: "Testnet"},
  });

  const fundJson = await faucetGql({
    query: `mutation fundAccount(
      $signature: String!
      $contentRaw: String!
      $networkEnv: NetworkEnv
    ) {
      fundAccount(
        signature: $signature contentRaw: $contentRaw
        networkEnv: $networkEnv
      )
    }`,
    variables: {
      signature: signatureJson.createAccountBalanceProof.signature,
      contentRaw: signatureJson.createAccountBalanceProof.contentRaw,
      networkEnv: "Testnet",
    },
  });

  if (fundJson) {
    return true;
  } else {
    return false;
  }
};
