import { Router } from 'express';
import exchangeController from './exchange.controller.js';

const exchangeRouter = Router();

exchangeRouter.get('/:amount/:fromCurrency/:toCurrency', exchangeController.convert);

export default exchangeRouter;
