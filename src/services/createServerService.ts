import * as StellarSdk from "@stellar/stellar-sdk"

import { NetworksOptions } from "../utils/enums.js";

export function createServerService(network: NetworksOptions) {
  switch (network) {
    case NetworksOptions.SOROBAN_MAINNET:
      return new StellarSdk.rpc.Server('https://soroban-rpc.mainnet.stellar.gateway.fm');
    case NetworksOptions.SOROBAN_TESTNET:
      return new StellarSdk.rpc.Server('https://soroban-testnet.stellar.org');
    case NetworksOptions.HORIZON_MAINNET:
      return new StellarSdk.Horizon.Server('https://horizon.stellar.org');
    case NetworksOptions.HORIZON_TESTNET:
      return new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');
    default:
      throw new Error("Server type not supported");
  }
}
