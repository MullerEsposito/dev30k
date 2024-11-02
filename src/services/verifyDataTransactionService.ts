import * as StellarSdk from '@stellar/stellar-sdk'
import { Api } from '@stellar/stellar-sdk/lib/rpc';

interface IVerifyDataTransaction {
  transactionId: string;
  server: StellarSdk.rpc.Server | StellarSdk.Horizon.Server;
  sourceMessage: string;
}

export async function verifyDataTransactionService({ transactionId, server, sourceMessage }: IVerifyDataTransaction): Promise<boolean> {
  let response: IGetMessageToVerifyOnSorobanResponse | IGetMessageToVerifyOnHorizonResponse;

  if (server instanceof StellarSdk.rpc.Server) {
    response = await getMessageToVerifyOnSoroban({ transactionId, server});
  } else if (server instanceof StellarSdk.Horizon.Server) {
    response = await getMessageToVerifyOnHorizon({ transactionId, server });
  }
  const { messageToVerify, keypair } = response;

  const sourceMessageInBase64 = Buffer.from(btoa(sourceMessage));
  
  if (keypair.verify(sourceMessageInBase64, messageToVerify)) {
    return true; 
  } else {
    return false;    
  }
}

interface IGetMessageToVerifyOnHorizonProps {
  transactionId: string;
  server: StellarSdk.Horizon.Server; 
}
interface IGetMessageToVerifyOnHorizonResponse {
  messageToVerify: Buffer;
  keypair: StellarSdk.Keypair;
}
async function getMessageToVerifyOnHorizon({ transactionId, server }: IGetMessageToVerifyOnHorizonProps): Promise<IGetMessageToVerifyOnHorizonResponse> {
  let messageToVerify: Buffer;
  const transaction = await server.transactions().transaction(transactionId).call();

  const operations = await transaction.operations();

  operations.records.forEach(operation => {
    if (operation.type === "manage_data") {
      messageToVerify = Buffer.from(operation.value as unknown as string, 'base64');
    }
  });

  const keypair = StellarSdk.Keypair.fromPublicKey(transaction.source_account);

  return { messageToVerify, keypair };
}

interface IGetMessageToVerifyOnSorobanProps {
  transactionId: string;
  server: StellarSdk.rpc.Server;
}
interface IGetMessageToVerifyOnSorobanResponse {
  messageToVerify: Buffer;
  keypair: StellarSdk.Keypair;
}
async function getMessageToVerifyOnSoroban({ transactionId, server }: IGetMessageToVerifyOnSorobanProps): Promise<IGetMessageToVerifyOnSorobanResponse  > {
  let messageToVerify: Buffer;
  
  const transaction = await server.getTransaction(transactionId) as Api.GetSuccessfulTransactionResponse;
  const envelopeXDR = transaction.envelopeXdr;
  const transactionXDR = StellarSdk.xdr.TransactionEnvelope.fromXDR(envelopeXDR.toXDR('base64'), "base64");

  transactionXDR.v1().tx().operations().forEach(operation => {
    if (operation.body().switch().name == "manageData") {
      const value  = operation.body().value() as StellarSdk.xdr.ManageDataOp;
      messageToVerify = value.dataValue();
    }
  })

  const publicKey = StellarSdk.StrKey.encodeEd25519PublicKey(transactionXDR.v1().tx().sourceAccount().ed25519());
  const keypair = StellarSdk.Keypair.fromPublicKey(publicKey);

  return { messageToVerify, keypair };
}



