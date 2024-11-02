import * as StellarSdk from "@stellar/stellar-sdk"

import { NetworksOptions } from "../utils/enums.js";

interface ICreateTransactionProps {
  server: StellarSdk.rpc.Server | StellarSdk.Horizon.Server;
  keypar: StellarSdk.Keypair;
  operationName: string;
  operationValue: string | Buffer;
  memoText: string;
}

interface ICreateTransactionResponse {
  send: () => Promise<StellarSdk.rpc.Api.SendTransactionResponse | StellarSdk.Horizon.HorizonApi.SubmitAsyncTransactionResponse>
}
export async function createTransactionService({ ...props }: ICreateTransactionProps): Promise<ICreateTransactionResponse> {
  let network: NetworksOptions;
  let account: StellarSdk.Account | StellarSdk.Horizon.AccountResponse;

  if (props.server instanceof StellarSdk.rpc.Server) {
    account = await props.server.getAccount(props.keypar.publicKey());
    network = NetworksOptions.MAINNET;
  } else if (props.server instanceof StellarSdk.Horizon.Server) {
    account = await props.server.loadAccount(props.keypar.publicKey());
    network = NetworksOptions.TESTNET;
  }

  const transaction = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: network == NetworksOptions.MAINNET ? StellarSdk.Networks.PUBLIC : StellarSdk.Networks.TESTNET,
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
    return transactionResult;
    console.log(`Transação enviada com sucesso:\n https://stellar.expert/explorer/public/tx/${transactionResult.hash}`);
  } else if (server instanceof StellarSdk.Horizon.Server) {
    transactionResult = await server.submitAsyncTransaction(transaction);
    return transactionResult;
    console.log(`Transação enviada com sucesso:\n https://stellar.expert/explorer/testnet/tx/${transactionResult.hash}`);
  } else {
    throw new Error("Failed on send transaction: Instance of server invalid!");
  }      
}