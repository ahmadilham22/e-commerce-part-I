import express from 'express';
import { errorMiddleware } from '../middleware/error-middleware.js';
import dotenv from 'dotenv';
import { publicRoute } from '../router/public-api.js';
import { privateRoute } from '../router/private-api.js';

export const web = express();

web.use(express.json());

web.use(publicRoute)
web.use(privateRoute)

web.use(errorMiddleware);
