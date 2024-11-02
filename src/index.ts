import * as dotenv from "dotenv"
import * as StellarSdk from "@stellar/stellar-sdk"
import { askForNetwork } from "./utils/prompts.js"
import "./server.js";

dotenv.config();

(async function main () {
  // const keypar = StellarSdk.Keypair.fromPublicKey(process.env.PUBLIC_KEY_ACCOUNT_TEST);  
  // const network = await askForNetwork();

  
})();