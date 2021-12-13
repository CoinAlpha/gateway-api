import { BaseLiquidityClient } from "./BaseLiquidityClient";
import { SwapClient } from "./SwapClient";
import { Chain } from "../../entities";

export type LiquidityContext = {
  sifApiUrl: string;
  sifRpcUrl: string;
  sifChainId: string;
};

export class LiquidityClient extends BaseLiquidityClient {
  swap = new SwapClient(this.context, this.nativeChain);
}
