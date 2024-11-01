import * as dotenv from "dotenv"
import * as StellarSdk from "@stellar/stellar-sdk"
import { askForNetwork } from "./stellar/utils.js"
import { createServer, createTransaction } from "./stellar/connection-functions.js"

dotenv.config();

(async function main () {
  const keypar = StellarSdk.Keypair.fromSecret(process.env.SECRET_KEY);

  const message = "DEV30K";
  const messageInBase64 = btoa(message);
  const messageInBase64Signed = keypar.sign(Buffer.from(messageInBase64));
  
  const network = await askForNetwork();

  try {
    const server = createServer(network);

    const transaction = await createTransaction({ 
      server, 
      network, 
      keypar, 
      operationName: 'desafio', 
      operationValue: messageInBase64Signed,
      memoText: 'DEV30K' 
    });  

    transaction.send();
  } catch (error) {
    console.log(`${error}`);    
  }
})();