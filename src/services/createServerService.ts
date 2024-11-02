import * as StellarSdk from "@stellar/stellar-sdk"

import { NetworksOptions } from "../utils/enums.js";

export function createServerService(network: NetworksOptions) {
  if (network == NetworksOptions.MAINNET) {
    return new StellarSdk.rpc.Server('https://soroban-rpc.mainnet.stellar.gateway.fm');
  } else if (network == NetworksOptions.TESTNET) {
    return new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');
  } else {
    throw new Error("Server type not supported");
  }
}
