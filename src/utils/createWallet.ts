import * as StellarSdk from "@stellar/stellar-sdk"

const keypair = StellarSdk.Keypair.random();

console.log(`
  Private key: ${keypair.secret()} \n
  Public key: ${keypair.publicKey()}
`);
