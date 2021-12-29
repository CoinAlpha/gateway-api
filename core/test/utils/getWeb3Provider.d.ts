import * as Web3 from "web3-core";
/**
 * Returns a web3 instance that is connected to our test ganache system
 * Also sets up out snapshotting system for tests that use web3
 */
export declare function getWeb3Provider(): Promise<Web3.HttpProvider>;
