import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';

// import swaggerDocs from './docs/swaggerConfig.js';
import { verifyDataTransactionController } from './controllers/verifyDataTransactionController/index.js';
import { swaggerDocs } from './docs/swaggerDocs.js';

const app = express();
app.use(bodyParser.json());
const SWAGGER_CSS = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";

console.log(swaggerDocs);


app.use('/verify', verifyDataTransactionController);
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocs, {
    customCss: '.swagger-ui .opblock .opblock-summary-path-description-wrapper { align-items: center; display: flex; flex-wrap: wrap; gap: 0 10px; padding: 0 10px; width: 100%; }',
    customCssUrl: SWAGGER_CSS,
}));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);  
});