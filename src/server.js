import path from 'path';
import fs from 'fs';
import http from 'http';
import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';

import config from './config';

const router = express.Router();
const app = express();

const setAllowed = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Methods',
    'HEAD, PUT, POST, GET, OPTIONS, DELETE',
  );
  res.header(
    'Access-Control-Allow-Headers',
    'origin, content-type, Authorization, x-access-token',
  );

  if (req.method === 'OPTIONS') {
    return res.status(405).send().end();
  } else {
    next();
  }
};

app.use(express.static(path.join(__dirname, '../static')));
router.get('/', (req, res) => {
  res.json({
    version: '0.0.41',
  });
});
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(setAllowed);
app.use('/v1', router);

console.log('Server port: ', config.appPort);
const launchServer = () => http.createServer(app).listen(config.appPort);

export { launchServer, router };
