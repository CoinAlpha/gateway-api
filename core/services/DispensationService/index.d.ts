import { DistributionType } from "../../generated/proto/sifnode/dispensation/v1/types";
import { IAsset } from "../../entities";
import { SifUnSignedClient } from "../utils/SifClient";
export declare type IDispensationServiceContext = {
    nativeAsset: IAsset;
    sifApiUrl: string;
    sifRpcUrl: string;
    sifWsUrl: string;
    sifChainId: string;
    sifUnsignedClient?: SifUnSignedClient;
};
declare type IDispensationService = {
    claim: (params: {
        claimType: DistributionType;
        fromAddress: string;
    }) => any;
};
export default function createDispensationService({ sifApiUrl, nativeAsset, sifChainId, sifWsUrl, sifRpcUrl, sifUnsignedClient, }: IDispensationServiceContext): IDispensationService;
export {};
