'use strict';

require('dotenv').config();
const express = require('express');
const logger = require('./logger');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const  folderRouter  = require('./folders/folders-router');
const notesRouter = require('./notes/notes-router');

const app = express();

const morganOption = (NODE_ENV === 'production');

app.use(morgan(morganOption));
app.use(cors());
app.use(helmet());

// boiler plate for api bearer
app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_KEY;
  const authToken = req.get('Authorization');

  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    logger.error(`Unauthorized request to path: ${req.path}`);
    return res.status(401).json({ error: 'Unauthorized Request' });
  }
  // move to the next middleware
  next();
});
app.use(folderRouter);
app.use(notesRouter);

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;
