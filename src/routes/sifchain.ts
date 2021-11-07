import express from 'express';
import { Request, Response } from 'express';
import { NetworkApi, Configuration } from '../../sifchain';
import Sifchain from '../services/sifchain';

const router = express.Router();

const sifchain: Sifchain = new Sifchain();

// constants
const config = new Configuration({ basePath: sifchain.getBasePath() });
const networkApi = new NetworkApi(config);
router.post('/', async (_req: Request, res: Response) => {
  /*
    POST /
  */
  const networkInfoRes = await networkApi.getNetworkInfo();

  res.status(200).json({
    config,
    networkInfo: networkInfoRes.data,
    lcdUrl: sifchain.getLCDURL(),
    connection: true,
    timestamp: Date.now(),
  });
});

export default router;
