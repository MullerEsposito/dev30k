import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';

import swaggerDocs from './docs/swaggerConfig.js';
import { verifyDataTransactionRoute } from './controllers/verifyDataTransactionController/index.js';

const app = express();
app.use(bodyParser.json());

app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocs);
app.use('/verify', verifyDataTransactionRoute);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);  
});