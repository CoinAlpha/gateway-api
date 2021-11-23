import { CoreConfig } from "./../utils/parseConfig";
import { IAsset, Chain, Network } from "../entities";

import createIBCService, { IBCServiceContext } from "./IBCService/IBCService";
import ethbridgeService, { EthbridgeServiceContext } from "./EthbridgeService";
import sifService, { SifServiceContext } from "./SifService";
import clpService, { ClpServiceContext } from "./ClpService";
import eventBusService, { EventBusServiceContext } from "./EventBusService";
import createChainsService, {
  ChainsServiceContext,
} from "./ChainsService/ChainsService";
import createDispensationService, {
  IDispensationServiceContext,
} from "./DispensationService";
import cryptoeconomicsService, {
  CryptoeconomicsServiceContext,
} from "./CryptoeconomicsService";
import storageService, { StorageServiceContext } from "./StorageService";
import createWalletService, { WalletServiceContext } from "./WalletService";
import createTokenRegistry, {
  TokenRegistryContext,
} from "./TokenRegistryService";
import { NativeDexClient } from "./utils/SifClient/NativeDexClient";
import Web3 from "web3";

export type Services = ReturnType<typeof createServices>;

export type WithService<T extends keyof Services = keyof Services> = {
  services: Pick<Services, T>;
};

export type ServiceContext = {
  blockExplorerUrl: string;
  assets: IAsset[];
} & SifServiceContext &
  ClpServiceContext &
  EthbridgeServiceContext &
  ClpServiceContext &
  EventBusServiceContext &
  IDispensationServiceContext & // add contexts from other APIs
  CryptoeconomicsServiceContext &
  StorageServiceContext &
  IBCServiceContext &
  ChainsServiceContext &
  WalletServiceContext &
  TokenRegistryContext;

export function createServices(context: ServiceContext) {
  const ChainsService = createChainsService(context);
  const IBCService = createIBCService(context);
  const EthbridgeService = ethbridgeService(context);
  const SifService = sifService(context);
  const ClpService = clpService(context);
  const EventBusService = eventBusService(context);
  const DispensationService = createDispensationService(context);
  const CryptoeconomicsService = cryptoeconomicsService(context);
  const StorageService = storageService(context);
  const WalletService = createWalletService({
    ...context,
    chains: ChainsService.list(),
  });
  const TokenRegistryService = createTokenRegistry(context);

  /* 

    Let's leave the metadata logging in place at least until IBC is off the ground. 
    I have to look this up for someone several times a day.
    
    - McCall
    
  */

  try {
    if (!globalThis.window) throw "";
    if (localStorage.DO_NOT_SPAM) throw "";
    if (location.hostname !== "dex.sifchain.finance") {
      setTimeout(() => {
        IBCService.logIBCNetworkMetadata();
      }, 8 * 1000);
    }
  } catch (e) {}
  return {
    Web3: Web3,
    chains: ChainsService,
    ibc: IBCService,
    clp: ClpService,
    sif: SifService,
    ethbridge: EthbridgeService,
    bus: EventBusService,
    dispensation: DispensationService,
    cryptoeconomics: CryptoeconomicsService,
    storage: StorageService,
    wallet: WalletService,
    tokenRegistry: TokenRegistryService,
  };
}
