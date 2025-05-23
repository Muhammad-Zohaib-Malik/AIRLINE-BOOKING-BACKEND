import express from 'express';
import dotenv from 'dotenv';
import apiRoutes from './routes/index.js'
import logger from './utils/logger.js';
import connectDB from './config/db.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

connectDB()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', apiRoutes)

app.use((err, req, res, next) => {
  logger.error(err.stack || err.message || err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`)
});

