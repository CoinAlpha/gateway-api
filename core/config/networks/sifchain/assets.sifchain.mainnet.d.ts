import { IAsset } from "../../../entities";
declare const assets: {
    assets: (Omit<IAsset, "homeNetwork" | "network"> & {
        network: "sifchain";
        homeNetwork: string;
    })[];
};
export default assets;
