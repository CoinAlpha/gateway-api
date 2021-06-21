import { IRouter, Router, Request, Response } from 'express';
//import express from 'express';

export abstract class EVMBase {
  private _router;

  constructor() {
    this._router = Router();

    this._router.post('/', this.getStatus);
    this._router.post('/balances', this.getBalances);
    // this._router.post('/allowances', this.getAllowances);
    this._router.post('/approve', this.approve);
    this._router.get('/poll', this.poll);
    // this._router.get('/addresses', this.getAddresses);
    this._router.get('/gas/price', this.getGasPrice);
  }

  abstract getStatus(req: Request, res: Response): void;

  abstract getBalances(req: Request, res: Response): void;

  // abstract getAllowances(req: Request, res: Response): void;

  abstract approve(req: Request, res: Response): void;

  abstract poll(req: Request, res: Response): void;

  // abstract getAddresses(req: Request, res: Response): void;

  abstract getGasPrice(req: Request, res: Response): void;

  get router(): IRouter {
    return this._router;
  }
}

// abstract getStatus(): string;

// abstract getBalances(addresses: Array<string>): Array<number>;

// abstract getAllowances(symbols: Array<string>, spender: string): Array<number>;

// abstract approve(symbol: string, spender: string, amount: string): string;

// abstract poll(tx: string): string;

// abstract getAddresses(symbols: Array<string>): Array<string>;

//   abstract getGasPrice(): number;
