import Web3 from "web3";
import { AbiItem } from "web3-utils";
import { Network, getChainsService } from "../../entities";

let abisPromise: Promise<AbiItem[]>;
function fetchBridgebankContractAbis() {
  if (!abisPromise) {
    abisPromise = (async () => {
      const sifchainChain = getChainsService().get(Network.SIFCHAIN);
      const res = await fetch(
        `https://sifchain-changes-server.vercel.app/api/bridgebank-abis/${sifchainChain.chainConfig.chainId}`,
      );
      return res.json();
    })();
  }
  return abisPromise;
}

export async function getBridgeBankContract(web3: Web3, address: string) {
  const abis = await fetchBridgebankContractAbis();
  return new web3.eth.Contract(abis as AbiItem[], address);
}
// bump
