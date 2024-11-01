import * as StellarSdk from "@stellar/stellar-sdk"

import { NetworksOptions } from "../enums.js";

export function createServer(network: NetworksOptions) {
  if (network == NetworksOptions.MAINNET) {
    return new StellarSdk.rpc.Server('https://soroban-rpc.mainnet.stellar.gateway.fm', { allowHttp: true });
  } else if (network == NetworksOptions.TESTNET) {
    return new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');
  } else {
    throw new Error("Server type not supported");
  }
}

interface ICreateTransactionProps {
  server: StellarSdk.rpc.Server | StellarSdk.Horizon.Server;
  network: NetworksOptions;
  keypar: StellarSdk.Keypair;
  operationName: string;
  operationValue: string | Buffer;
  memoText: string;
}

export async function createTransaction({ ...props }: ICreateTransactionProps): Promise<{ send: () => Promise<void>}> {
  let account: StellarSdk.Account | StellarSdk.Horizon.AccountResponse;

  if (props.server instanceof StellarSdk.rpc.Server) {
    account = await props.server.getAccount(props.keypar.publicKey());
  } else if (props.server instanceof StellarSdk.Horizon.Server) {
    account = await props.server.loadAccount(props.keypar.publicKey());
  }

  const transaction = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: props.network == NetworksOptions.MAINNET ? StellarSdk.Networks.PUBLIC : StellarSdk.Networks.TESTNET,
  })
  .addOperation(StellarSdk.Operation.manageData({
    name: props.operationName,
    value: props.operationValue,
  }))
  .addMemo(StellarSdk.Memo.text(props.memoText))
  .setTimeout(30)
  .build();

  transaction.sign(props.keypar);

  return { send: () => sendTransaction({ transaction, server: props.server })};
}

interface ISendTransactionProps {
  transaction: StellarSdk.Transaction;
  server: StellarSdk.rpc.Server | StellarSdk.Horizon.Server;
}

async function sendTransaction({ transaction, server }: ISendTransactionProps) {
  let transactionResult: StellarSdk.rpc.Api.SendTransactionResponse | StellarSdk.Horizon.HorizonApi.SubmitAsyncTransactionResponse;
  if (server instanceof StellarSdk.rpc.Server) {
    transactionResult = await server.sendTransaction(transaction);
    console.log(`Transação enviada com sucesso:\n https://stellar.expert/explorer/public/tx/${transactionResult.hash}`);
  } else if (server instanceof StellarSdk.Horizon.Server) {
    transactionResult = await server.submitAsyncTransaction(transaction);
    console.log(`Transação enviada com sucesso:\n https://stellar.expert/explorer/testnet/tx/${transactionResult.hash}`);
  } else {
    throw new Error("Failed on send transaction: Instance of server invalid!");
  }      
}