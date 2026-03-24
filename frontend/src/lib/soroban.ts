/**
 * Soroban contract interaction helpers.
 */

import {
  Contract,
  SorobanRpc,
  TransactionBuilder,
  Networks,
  nativeToScVal,
  Address,
  xdr,
} from "@stellar/stellar-sdk";
import { SOROBAN_RPC_URL, NETWORK_PASSPHRASE } from "./network";

// ============================================================================
// Contract IDs
// ============================================================================

export const CONTRACT_IDS = {
  treasury: "PLACEHOLDER_TREASURY_CONTRACT_ID",
  governance: "PLACEHOLDER_GOVERNANCE_CONTRACT_ID",
  tokenVault: "PLACEHOLDER_TOKEN_VAULT_CONTRACT_ID",
  accessControl: "PLACEHOLDER_ACCESS_CONTROL_CONTRACT_ID",
} as const;

// ============================================================================
// Server Instance
// ============================================================================

const server = new SorobanRpc.Server(SOROBAN_RPC_URL);

// ============================================================================
// Soroban RPC Helpers
// ============================================================================

export async function buildContractCall(
  contractId: string,
  method: string,
  args: xdr.ScVal[],
  sourceAddress: string
): Promise<TransactionBuilder> {
  const account = await server.getAccount(sourceAddress);
  const contract = new Contract(contractId);

  const tx = new TransactionBuilder(account, {
    fee: "100",
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(contract.call(method, ...args))
    .setTimeout(30);

  return tx;
}

export async function signAndSubmit(transaction: any): Promise<any> {
  throw new Error("Sign and submit requires Freighter integration. See issue FE-2.");
}

export async function readContractValue(
  contractId: string,
  method: string,
  args: xdr.ScVal[] = []
): Promise<any> {
  const contract = new Contract(contractId);
  
  const account = await server.getAccount(contractId);
  
  const tx = new TransactionBuilder(account, {
    fee: "100",
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(contract.call(method, ...args))
    .setTimeout(30)
    .build();

  const simulated = await server.simulateTransaction(tx);
  
  if (SorobanRpc.Api.isSimulationSuccess(simulated)) {
    return simulated.result?.retval;
  }
  
  throw new Error("Contract read failed");
}

// ============================================================================
// Treasury Transaction Builders
// ============================================================================

export async function buildDepositTx(
  contractId: string,
  from: string,
  amount: number
): Promise<TransactionBuilder> {
  const args = [
    nativeToScVal(Address.fromString(from), { type: "address" }),
    nativeToScVal(amount, { type: "i128" }),
  ];
  
  return buildContractCall(contractId, "deposit", args, from);
}

export async function buildProposeWithdrawalTx(
  contractId: string,
  proposer: string,
  to: string,
  amount: number,
  memo: string
): Promise<TransactionBuilder> {
  const args = [
    nativeToScVal(Address.fromString(proposer), { type: "address" }),
    nativeToScVal(Address.fromString(to), { type: "address" }),
    nativeToScVal(amount, { type: "i128" }),
    nativeToScVal(memo, { type: "string" }),
  ];
  
  return buildContractCall(contractId, "propose_withdrawal", args, proposer);
}

export async function buildApproveTx(
  contractId: string,
  signer: string,
  txId: number
): Promise<TransactionBuilder> {
  const args = [
    nativeToScVal(Address.fromString(signer), { type: "address" }),
    nativeToScVal(txId, { type: "u32" }),
  ];
  
  return buildContractCall(contractId, "approve", args, signer);
}

export async function buildExecuteTx(
  contractId: string,
  executor: string,
  txId: number
): Promise<TransactionBuilder> {
  const args = [
    nativeToScVal(Address.fromString(executor), { type: "address" }),
    nativeToScVal(txId, { type: "u32" }),
  ];
  
  return buildContractCall(contractId, "execute", args, executor);
}
