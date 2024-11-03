import swaggerJsDoc from 'swagger-jsdoc';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Verificação dos Dados de Transações',
      version: '1.0.0',
      description: 'Documentação da API para a rota de verificação dos dados de uma transação do DEV30K',
    },
    servers: [
      {
        url: 'https://dev30k.vercel.app',
        description: 'Produção'
      },
      {
        url: 'http://localhost:3000',
        description: 'Servidor local'
      },
    ],
  },
  apis: [__dirname + '/../controllers/**/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export default swaggerDocs;
