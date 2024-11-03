import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';

import swaggerDocs from './docs/swaggerConfig.js';
import { verifyDataTransactionRoute } from './controllers/verifyDataTransactionController/index.js';

const app = express();
app.use(bodyParser.json());
const SWAGGER_CSS =
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";

app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocs, { customCss: SWAGGER_CSS }));
app.use('/verify', verifyDataTransactionRoute);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);  
});