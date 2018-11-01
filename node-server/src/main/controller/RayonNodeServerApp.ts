import * as cors from 'cors';
import sendResult from '../../main/dc/sendResult';

// agent
import RayonLogCollectAgent from '../../log/agent/RayonLogCollectAgent';

// dc
import TokenDC from '../../token/dc/TokenDC';
import ContractDC from '../../contract/dc/ContractDC';

// model
import RayonArtifactAgent from '../../log/agent/RayonArtifactAgent';

const express = require('express');
const app = express();

// for use .env variables
require('dotenv').config();
const port = Number(process.env.APP_PORT) || 3000;

// defined use middle ware
app.use(cors({ origin: true, credentials: true }));
app.use(sendResult);

// start history log store
RayonArtifactAgent.startArtifactConvert();
RayonLogCollectAgent.collectionStart();

// datacontroller configure(router)
TokenDC.configure(app);
ContractDC.configure(app);

app.get('/', (req, res) => res.send('Hello World!'));
app.get('/health', (req, res) => res.status(200).send('OK'));

app.listen(port, () => console.log(`server start on port ${port}!`));

export default app;
