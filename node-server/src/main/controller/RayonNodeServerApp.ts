import * as cors from 'cors';

// dc
import TokenDC from '../../token/dc/TokenDC';

const express = require('express');
const app = express();

// for use .env variables
require('dotenv').config();
const port = process.env.APP_PORT;

// defined use middle ware
app.use(cors({ origin: true, credentials: true }));

// datacontroller configure(router)
TokenDC.configure(app);

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`server start on port ${port}!`));
