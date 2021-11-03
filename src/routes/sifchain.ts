import express from 'express';
import { Request, Response } from 'express';
import { AssetsApi, Configuration } from '../../sifchain';
const router = express.Router();

const config = new Configuration({ basePath: process.env.REST_API });
const assetsApi = new AssetsApi(config);
// console.log(assetsApi);

router.post('/', async (_req: Request, res: Response) => {
  const kek = await assetsApi.getTotalSupply();
  console.log(kek.data);
  res.send('siffy my iffy yaw');
});

export default router;
