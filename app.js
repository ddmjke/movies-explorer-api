const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const process = require('process');
const { errors } = require('celebrate');
const helmet = require('helmet');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const corshandler = require('./middlewares/corshandler');
const limiter = require('./utils/limiter');
const { errorHandler } = require('./utils/errorhandler');
const { DB_DEV_ADDRESS } = require('./utils/config');

require('dotenv').config();

const { PORT = 3001, NODE_ENV, DB_ADDRESS } = process.env;

const app = express();

app.use(helmet());
app.use(requestLogger);
app.use(limiter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(corshandler);

mongoose.connect(
  NODE_ENV === 'production'
    ? DB_ADDRESS
    : DB_DEV_ADDRESS,
  {
    useNewUrlParser: true,
  },
);

app.use(require('./routes/index'));

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT);
