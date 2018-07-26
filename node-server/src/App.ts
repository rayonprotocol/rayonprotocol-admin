import * as cors from 'cors';

// dc
import ContractDC from './common/dc/ContractDC';
import TokenDC from './token/dc/TokenDC';
import MintEventDC from './event/dc/MintEventDC';
import TransferEventDC from './event/dc/TransferEventDC';

const express = require('express');
const app = express();

// defined use middle ware
app.use(cors({ origin: true, credentials: true }));

// contract initialize for getting deployed contract instance
ContractDC.init();

// datacontroller configure(router)
TokenDC.configure(app);
MintEventDC.configure(app);
TransferEventDC.configure(app);

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(3000, () => console.log('server start on port 3000!'));
