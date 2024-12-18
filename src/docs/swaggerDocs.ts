import { verifyPath } from '../controllers/verifyDataTransactionController/swagger.js';

export const swaggerDocs = {
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
  paths: {
  ...verifyPath
  }
};
