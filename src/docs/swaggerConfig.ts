import swaggerJsDoc from 'swagger-jsdoc';
// import path from 'path';
// import { fileURLToPath } from 'url';

// // Obter o nome do arquivo
// const __filename = fileURLToPath(import.meta.url);

// // Obter o diretório do arquivo
// const __dirname = path.dirname(__filename);

// console.log('Diretório local:', __dirname);

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
  apis: [
    './src/**/*.js', 
    './src/**/*.ts',
  ],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
// console.log(swaggerDocs['paths']['/verify']['get']['responses']['500']['content']['application/json']['schema']['properties']);

export default swaggerDocs;
