import express, { Request } from 'express';

import { NetworksOptions } from '../../utils/enums.js';
import { createServerService } from '../../services/createServerService.js';
import { verifyDataTransactionService } from '../../services/verifyDataTransactionService.js';

export const verifyDataTransactionController = express.Router();

export const networkMap = {
    SOROBAN_MAINNET: NetworksOptions.SOROBAN_MAINNET,
    SOROBAN_TESTNET: NetworksOptions.SOROBAN_TESTNET,
    HORIZON_MAINNET: NetworksOptions.HORIZON_MAINNET,
    HORIZON_TESTNET: NetworksOptions.HORIZON_TESTNET,
};

interface IVerifyRequestParams {
    transactionId: string;
    sourceMessage: string;
    network: NetworksOptions;
}

verifyDataTransactionController.get('/', async (req: Request<{}, {}, {}, IVerifyRequestParams>, res): Promise<void> => {
    const { transactionId, sourceMessage, network } = req.query;

    const missingFields = [];
    if (!transactionId) missingFields.push('transactionId');
    if (!sourceMessage) missingFields.push('sourceMessage');
    if (!network) missingFields.push('network');

    if (missingFields.length > 0) {
        res.status(400).json({
            error: `Campos: ${missingFields.join(', ')} são obrigatórios!`
        });
        return;
    }

    try {
        const server = createServerService(networkMap[network]);
        const isAuthentic = await verifyDataTransactionService({ transactionId, sourceMessage, server });

        res.status(200).json({ isAuthentic });
        return;
    } catch (error) {
        res.status(500).json({ error: 'Erro ao verificar dados da transação', details: error.message });
        return;
    }
});
