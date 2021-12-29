import { Keplr } from "@keplr-wallet/types";
declare type provider = Keplr;
export default function getKeplrProvider(): Promise<provider | null>;
export {};
