import express from 'express';
import { privateRoute } from '../router/private-api.js';
import { publicRoute } from '../router/public-api.js';
import { errorMiddleware } from '../middleware/error-middleware.js';

export const web = express();

web.use(express.json());

web.use(privateRoute);
web.use(publicRoute);

web.use(errorMiddleware);
