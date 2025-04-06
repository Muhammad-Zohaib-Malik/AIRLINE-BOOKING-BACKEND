import express from 'express';
import dotenv from 'dotenv';
import apiRoutes from './routes/index.js'
import logger from './utils/logger.js';
import connectDB from './config/db.js';
import { scheduleCrons } from './services/cron-job.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

connectDB()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', apiRoutes)

app.listen(port, () => {
 scheduleCrons()
  logger.info(`Server is running on port ${port}`)
});

