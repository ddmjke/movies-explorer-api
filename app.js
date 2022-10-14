const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const process = require('process');
const { errors } = require('celebrate');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const corshandler = require('./middlewares/corshandler');

require('dotenv').config();

const { PORT = 3001, NODE_ENV, DB_ADDRESS } = process.env;

const app = express();

const limit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(helmet());
app.use(limit);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(corshandler);

mongoose.connect(NODE_ENV === 'production' ? DB_ADDRESS : 'mongodb://localhost:27017/movieexplorerdb', {
  useNewUrlParser: true,
});

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(require('./routes/index'));

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500)
    .send({
      message: err.statusCode === 500
        ? 'Internal server error'
        : err.message,
    });
  next();
});
app.listen(PORT);
