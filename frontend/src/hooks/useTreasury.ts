import {
  buildDepositTx,
  buildProposeWithdrawalTx,
  buildApproveTx,
  buildExecuteTx,
  CONTRACT_IDS,
  readContractValue,
} from "@/lib/soroban";
import { useFreighter } from "./useFreighter";

export function useTreasury() {
  const { address } = useFreighter();

  const getBalance = async (): Promise<number> => {
    const result = await readContractValue(CONTRACT_IDS.treasury, "get_balance", []);
    return Number(result);
  };

  const getConfig = async () => {
    const result = await readContractValue(CONTRACT_IDS.treasury, "get_config", []);
    return result;
  };

  const deposit = async (amount: number): Promise<void> => {
    if (!address) throw new Error("Wallet not connected");
    const tx = await buildDepositTx(CONTRACT_IDS.treasury, address, amount);
    const built = tx.build();
    // TODO: Sign and submit with Freighter when integrated
    console.log("Deposit transaction built:", built.toXDR());
  };

  const proposeWithdrawal = async (
    to: string,
    amount: number,
    memo: string
  ): Promise<number> => {
    if (!address) throw new Error("Wallet not connected");
    const tx = await buildProposeWithdrawalTx(CONTRACT_IDS.treasury, address, to, amount, memo);
    const built = tx.build();
    // TODO: Sign and submit with Freighter when integrated
    console.log("Propose withdrawal transaction built:", built.toXDR());
    return 0;
  };

  const approve = async (txId: number): Promise<void> => {
    if (!address) throw new Error("Wallet not connected");
    const tx = await buildApproveTx(CONTRACT_IDS.treasury, address, txId);
    const built = tx.build();
    // TODO: Sign and submit with Freighter when integrated
    console.log("Approve transaction built:", built.toXDR());
  };

  const execute = async (txId: number): Promise<void> => {
    if (!address) throw new Error("Wallet not connected");
    const tx = await buildExecuteTx(CONTRACT_IDS.treasury, address, txId);
    const built = tx.build();
    // TODO: Sign and submit with Freighter when integrated
    console.log("Execute transaction built:", built.toXDR());
  };

  return {
    getBalance,
    getConfig,
    deposit,
    proposeWithdrawal,
    approve,
    execute,
  };
}
