import express from 'express';
import { Request, Response } from 'express';
import { Configuration } from '../../sifchain';
import Sifchain from '../services/sifchain';

const router = express.Router();

const sifchain: Sifchain = new Sifchain();

// constants
const config = new Configuration({ basePath: process.env.REST_API });
router.post('/', async (_req: Request, res: Response) => {
  /*
    POST /
  */
  res.status(200).json({
    config,
    lcdUrl: sifchain.getLCDURL(),
    connection: true,
    timestamp: Date.now(),
  });
});

export default router;
