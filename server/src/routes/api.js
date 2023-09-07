import { Router } from 'express';
import v1Router from './v1/v1.js';

const api = Router();

api.use('/v1', v1Router);

export default api;
