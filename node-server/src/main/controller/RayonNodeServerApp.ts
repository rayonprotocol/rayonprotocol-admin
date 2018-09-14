import * as cors from 'cors';

// dc
import TokenDC from '../../token/dc/TokenDC';

const express = require('express');
const app = express();

// for use .env variables
require('dotenv').config();
const port = Number(process.env.APP_PORT) || 3000;

// defined use middle ware
app.use(cors({ origin: true, credentials: true }));

// datacontroller configure(router)
TokenDC.configure(app);

app.get('/', (req, res) => res.send('Hello World!'));
app.get('/health', (req, res) => res.status(200).send('OK'));

app.listen(port, () => console.log(`server start on port ${port}!`));
