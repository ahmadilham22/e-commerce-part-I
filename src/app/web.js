import "dotenv/config"
import express from 'express';
import { errorMiddleware } from '../middleware/error-middleware.js';
import { publicRoute } from '../router/public-api.js';
import { privateRoute } from '../router/private-api.js';
import cors from 'cors';

export const web = express();

web.use(express.json());

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
};
web.use(cors(corsOptions));

web.use(publicRoute)
web.use(privateRoute)

web.use(errorMiddleware);
