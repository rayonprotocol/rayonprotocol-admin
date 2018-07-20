const express = require('express');
const app = express();

import ContractDC from './common/dc/ContractDC';

ContractDC.init();

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(3000, () => console.log('server start on port 3000!'));
