import * as cors from 'cors';

// dc
import TokenDC from '../../token/dc/TokenDC';

const express = require('express');
const app = express();

// defined use middle ware
app.use(cors({ origin: true, credentials: true }));

// datacontroller configure(router)
TokenDC.configure(app);

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(3000, () => console.log('server start on port 3000!'));