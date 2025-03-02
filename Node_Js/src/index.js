import express from 'express';
import dotenv from 'dotenv';
import apiRoutes from './routes/index.js'
import logger from './utils/logger.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use('/api',apiRoutes)

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`)
});

