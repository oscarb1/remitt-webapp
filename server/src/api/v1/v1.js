import { Router } from 'express';
import exchangeRouter from './exchange/exchange.router.js';

const v1 = Router();

v1.use('/convert', exchangeRouter);

export default v1;
