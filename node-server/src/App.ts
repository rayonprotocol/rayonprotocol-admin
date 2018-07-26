
import * as cors from 'cors';
import ContractDC from './common/dc/ContractDC';
import TokenDC from './token/dc/TokenDC';

const express = require('express');
const app = express();

app.use(cors({ origin: true, credentials: true }));

ContractDC.init();
TokenDC.configuration(app);

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(3000, () => console.log('server start on port 3000!'));
