import Web3 from "web3";
import { AbiItem } from "web3-utils";
import fetch from "cross-fetch";

let abisPromise: Promise<AbiItem[]>;
function fetchBridgebankContractAbis(sifChainId: string) {
  if (!abisPromise) {
    abisPromise = (async () => {
      const res = await fetch(
        `https://sifchain-changes-server.vercel.app/api/bridgebank-abis/${sifChainId}`,
      );
      return res.json();
    })();
  }
  return abisPromise;
}

export async function getBridgeBankContract(
  web3: Web3,
  sifChainId: string,
  address: string,
) {
  const abis = await fetchBridgebankContractAbis(sifChainId);
  return new web3.eth.Contract(abis as AbiItem[], address);
}
