export const swaggerDocs = {
  openapi: '3.0.0',
  info: {
    title: 'API de Verificação dos Dados de Transações',
    version: '1.0.0',
    description: 'Documentação da API para a rota de verificação dos dados de uma transação do DEV30K'
  },
  servers: [
    { url: 'https://dev30k.vercel.app', description: 'Produção' },
    { url: 'http://localhost:3000', description: 'Servidor local' }
  ],
  paths: { '/verify': { get: {
    summary: 'Verifica se o value de um Manage Data foi codificado em base64 e assinado pelo mesmo signer do transactionId',
    parameters: [
      {
        in: 'query',
        name: 'transactionId',
        required: true,
        description: 'O ID da transação a ser verificada',
        schema: { type: 'string' }
      },
      {
        in: 'query',
        name: 'sourceMessage',
        required: true,
        description: 'A mensagem de origem para verificação',
        schema: { type: 'string' }
      },
      {
        in: 'query',
        name: 'network',
        required: true,
        description: 'A rede em que a transação será verificada',
        schema: { type: 'string', enum: ['SOROBAN_MAINNET', 'SOROBAN_TESTNET', 'HORIZON_MAINNET', 'HORIZON_TESTNET'] }
      }
    ],
    responses: {
      '200': {
        description: 'Retorna se a sourceMessage foi convertida em base64 e depois assinada pelo mesmo signer da transactionId',
        content: { 
          'application/json': { 
            schema: { 
              type: 'object', 
              properties: {
                isAuthentic: {
                  type: 'boolean',
                  description: 'Indica que foi corretamente codificado e assinado'
                }
              }
            } 
          }
        }
      },
      '400': {
        description: 'Erro de parâmetros ausentes',
        content: { 
          'application/json': { 
            schema: { 
              type: 'object', 
              properties: {
                error: {
                  type: 'string',
                  description: 'Mensagem de erro detalhando os campos ausentes'
                }
              }
            } 
          }
        }
      },
      '500': {
        description: 'Erro interno ao verificar dados da transação',
        content: { 
          'application/json': { 
            schema: { 
              type: 'object', 
              properties: {
                error: { type: 'string', description: 'Mensagem de erro' },
                details: { type: 'string', description: 'Detalhes do erro' }
              }
            } 
          }
        }
      }
    }
  } } },
  components: {},
  tags: []
}