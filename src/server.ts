import express from 'express';
import bodyParser from 'body-parser';
import * as StellarSdk from '@stellar/stellar-sdk'

import { verifyDataTransactionService } from './services/verifyDataTransactionService.js';
import { createServerService } from './services/createServerService.js';
import { NetworksOptions } from './utils/enums.js';
import { createTransactionService } from './services/createTransactionService.js';

const app = express();
app.use(bodyParser.json());

app.post('/verify', async (req, res) => {
  const { transactionId, sourceMessage, network } = req.body;

  if (!transactionId || !network) {
    res.status(400).json({ error: 'Mensagem e chave secreta são obrigatórias' });
  }

  try {
    const server = createServerService(network as NetworksOptions);
    const isAuthentic = await verifyDataTransactionService({ transactionId, sourceMessage, server });

    res.json({ isAuthentic });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao verificar a assinatura', details: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);  
});