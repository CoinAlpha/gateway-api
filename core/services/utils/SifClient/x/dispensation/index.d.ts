import { LcdClient, Msg } from "@cosmjs/launchpad";
import { DistributionType } from "../../../../../generated/proto/sifnode/dispensation/v1/types";
declare type BaseReq = {
    from: string;
    chain_id: string;
    account_number?: string;
    sequence?: string;
};
declare type IClaimParams = {
    base_req: BaseReq;
    claim_type: DistributionType;
    claim_creator: string;
};
export interface DispensationExtension {
    readonly dispensation: {
        claim: (params: IClaimParams) => Promise<Msg>;
    };
}
export declare function setupDispensationExtension(base: LcdClient): DispensationExtension;
export {};
