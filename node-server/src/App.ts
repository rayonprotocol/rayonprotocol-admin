const express = require('express');
const app = express();

import ContractDC from './common/dc/ContractDC';
import TokenDC from './token/dc/TokenDC';

ContractDC.init();
TokenDC.configuration(app);

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(3000, () => console.log('server start on port 3000!'));
