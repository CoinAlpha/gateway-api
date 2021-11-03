// const ethers = require('ethers');
import ethers from "ethers"
import { TokenERC20Info } from './services/ethereum';
import BigNumber from 'bignumber.js';

export interface IBalancer {
    provider: any;
    gasLimit:string;
    network:string;
    vault:string;
    subgraphUrl:string;
    priceSwapOut(tokenIn:TokenERC20Info, tokenOut:TokenERC20Info, tokenOutAmount:BigNumber):Promise<any>;
    priceSwapIn(tokenIn:TokenERC20Info, tokenOut:TokenERC20Info, tokenOutAmount:BigNumber):Promise<any>;
    swapExactOut(wallet:ethers.Wallet, swapInfo:any, gasPrice:any):any;
    swapExactIn(wallet:ethers.Wallet, swapInfo:any, gasPrice:any):any;
}
